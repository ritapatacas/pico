import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { OrderManager, LegacyOrder } from '@/lib/orders';
import { supabase } from '@/lib/supabaseClient';
import { getProductIdsByKeys } from '@/lib/products';

// Check if Stripe secret key is configured
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY is not configured in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Helper function to process successful orders
async function processSuccessfulOrder(session: Stripe.Checkout.Session) {
  try {
    console.log('Processing successful order for session:', session.id);
    
    // Extract order details
    const orderDetails: LegacyOrder = {
      id: session.id,
      sessionId: session.id,
      customerEmail: session.customer_details?.email || undefined,
      customerName: session.customer_details?.name || undefined,
      amount: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency || 'eur',
      paymentStatus: session.payment_status || 'unknown',
      createdAt: new Date(session.created * 1000),
      status: 'confirmed',
      items: session.line_items?.data.map(item => ({
        name: item.description || 'Product',
        quantity: item.quantity || 1,
        price: item.amount_total ? item.amount_total / 100 : 0,
      })) || [],
    };

    console.log('Order details:', orderDetails);

    // Save order to local storage (existing functionality)
    OrderManager.saveOrder(orderDetails);

    // Find or create client
    let clientId: string | null = null;
    if (orderDetails.customerEmail) {
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('email', orderDetails.customerEmail)
        .single();

      if (clientError && clientError.code !== 'PGRST116') {
        console.error('Error finding client:', clientError);
      } else if (clientData) {
        clientId = clientData.id;
      } else {
        // Create guest client if not found
        const { data: newClient, error: createError } = await supabase
          .from('clients')
          .insert([{
            email: orderDetails.customerEmail,
            name: orderDetails.customerName || 'Guest User',
            is_guest: true,
          }])
          .select('id')
          .single();

        if (createError) {
          console.error('Error creating guest client:', createError);
        } else {
          clientId = newClient.id;
        }
      }
    }

    // Save order to Supabase database with new structure
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            client_id: clientId,
            stripe_session_id: session.id,
            payment_method: 'stripe',
            payment_status: orderDetails.paymentStatus === 'paid' ? 'completed' : 'pending',
            subtotal: orderDetails.amount,
            delivery_fee: 0.00, // Will be updated when delivery is linked
            discount: 0.00,
            total: orderDetails.amount,
            currency: orderDetails.currency.toUpperCase(),
            status: 'confirmed',
            notes: null,
          }
        ])
        .select()
        .single();

      if (orderError) {
        console.error('Error saving order to database:', orderError);
      } else {
        console.log('Order saved to database successfully:', orderData);
        
        // Save order items
        if (orderDetails.items.length > 0) {
          // Extract product keys from Stripe line items metadata
          const productKeys = session.line_items?.data
            .map(item => {
              const product = item.price?.product;
              return typeof product === 'object' && 'metadata' in product ? product.metadata?.product_key : undefined;
            })
            .filter(Boolean) as string[] || [];

          // Get product IDs from product keys
          const productIds = productKeys.length > 0 ? await getProductIdsByKeys(productKeys) : {};

          const orderItems = orderDetails.items.map((item, index) => {
            const stripeItem = session.line_items?.data[index];
            const product = stripeItem?.price?.product;
            const productKey = typeof product === 'object' && 'metadata' in product ? product.metadata?.product_key : undefined;
            
            return {
              order_id: orderData.id,
              product_id: productKey ? productIds[productKey] : null,
              product_name: item.name,
              quantity: item.quantity,
              unit_price: item.price / item.quantity,
              total_price: item.price,
            };
          });

          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

          if (itemsError) {
            console.error('Error saving order items:', itemsError);
          } else {
            console.log('Order items saved successfully');
          }
        }
        
        // Process delivery information if exists
        await processDeliveryInfo(session.id, orderData.id);
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Continue processing even if database save fails
    }

    // Here you would typically:
    // 1. Update inventory
    // 2. Send confirmation email
    // 3. Create shipping label
    // 4. Update order status

    console.log('Order processed successfully:', {
      orderId: session.id,
      customer: orderDetails.customerEmail,
      total: `${orderDetails.amount} ${orderDetails.currency}`,
      items: orderDetails.items.length,
    });

    return orderDetails;
  } catch (error) {
    console.error('Error processing order:', error);
    throw error;
  }
}

// Helper function to process delivery information
async function processDeliveryInfo(sessionId: string, orderId: string) {
  try {
    // Check if there's delivery info for this session
    const { data: deliveries, error } = await supabase
      .from('deliveries')
      .select('*')
      .eq('stripe_session_id', sessionId);

    if (error) {
      console.error('Error checking delivery info:', error);
      return;
    }

    if (deliveries && deliveries.length > 0) {
      // Update delivery records with order ID and confirm status
      for (const delivery of deliveries) {
        const { error: updateError } = await supabase
          .from('deliveries')
          .update({ 
            order_id: orderId,
            status: 'confirmed' 
          })
          .eq('id', delivery.id);

        if (updateError) {
          console.error('Error updating delivery info:', updateError);
        } else {
          console.log('Delivery info updated for order:', orderId);
        }
      }
    }
  } catch (error) {
    console.error('Error processing delivery info:', error);
  }
}

// Helper function to handle failed payments
async function handleFailedPayment(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Handling failed payment:', paymentIntent.id);
    
    // Update any pending deliveries to failed status
    const { error } = await supabase
      .from('deliveries')
      .update({ status: 'cancelled' })
      .eq('stripe_session_id', paymentIntent.id);

    if (error) {
      console.error('Error updating failed payment delivery status:', error);
    }

    console.log('Payment failed details:', {
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      failureReason: paymentIntent.last_payment_error?.message,
    });

  } catch (error) {
    console.error('Error handling failed payment:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  // Check if webhook secret is configured
  if (!endpointSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    if (!sig) {
      throw new Error('Stripe signature missing');
    }
    
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Payment successful for session:', session.id);
        
        // Process the successful order
        await processSuccessfulOrder(session);
        break;
        
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment intent succeeded:', paymentIntent.id);
        break;
        
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', failedPayment.id);
        
        // Handle the failed payment
        await handleFailedPayment(failedPayment);
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Invoice payment succeeded:', invoice.id);
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice;
        console.log('Invoice payment failed:', failedInvoice.id);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Error processing webhook event:', error);
    // Return success to prevent Stripe from retrying
  }

  return NextResponse.json({ received: true });
}