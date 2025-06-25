import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    if (!endpointSecret || !sig) {
      throw new Error('Webhook secret or signature missing');
    }
    
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Payment successful for session:', session.id);
      
      // Aqui você pode:
      // - Atualizar o status do pedido no banco de dados
      // - Enviar email de confirmação
      // - Atualizar o inventário
      // - etc.
      
      break;
      
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('Payment intent succeeded:', paymentIntent.id);
      break;
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object as Stripe.PaymentIntent;
      console.log('Payment failed:', failedPayment.id);
      
      // Aqui você pode:
      // - Notificar o cliente sobre a falha
      // - Tentar novamente o pagamento
      // - etc.
      
      break;
      
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
} 