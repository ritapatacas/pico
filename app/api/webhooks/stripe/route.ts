import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { OrderManager, Order } from '@/lib/orders';

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
    const orderDetails: Order = {
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

    // Save order to storage
    OrderManager.saveOrder(orderDetails);

    // Here you would typically:
    // 1. Save order to database (already done above)
    // 2. Update inventory
    // 3. Send confirmation email
    // 4. Create shipping label
    // 5. Update order status

    console.log('Order processed successfully:', {
      orderId: session.id,
      customer: orderDetails.customerEmail,
      total: `${orderDetails.amount} ${orderDetails.currency}`,
      items: orderDetails.items.length,
    });

    // TODO: Send confirmation email
    // await sendOrderConfirmationEmail(orderDetails);

    return orderDetails;
  } catch (error) {
    console.error('Error processing order:', error);
    throw error;
  }
}

// Helper function to handle failed payments
async function handleFailedPayment(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Handling failed payment:', paymentIntent.id);
    
    // Here you would typically:
    // 1. Update order status to failed
    // 2. Send failure notification to customer
    // 3. Restore inventory if needed
    // 4. Log the failure for retry

    console.log('Payment failed details:', {
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      failureReason: paymentIntent.last_payment_error?.message,
    });

    // TODO: Send failure notification email
    // await sendPaymentFailureEmail(paymentIntent);

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
    // In production, you might want to return an error status
    // but for now, we'll return success to prevent Stripe from retrying
  }

  return NextResponse.json({ received: true });
} 