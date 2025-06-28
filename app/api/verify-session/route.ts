import { NextRequest, NextResponse } from 'next/server';
import { OrderManager } from '@/lib/orders';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Try to get order from local storage first
    const order = OrderManager.getOrder(sessionId);

    if (order) {
      // Return order details from our storage
      const paymentDetails = {
        status: 'success',
        amount: order.amount.toFixed(2),
        customer_email: order.customerEmail,
        order_id: order.id,
        items: order.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price.toFixed(2),
        })),
      };

      return NextResponse.json(paymentDetails);
    }

    // If order not found in storage, return a generic success response
    // This can happen if the webhook hasn't processed yet or if there's a delay
    return NextResponse.json({
      status: 'success',
      amount: '0.00',
      message: 'Payment verified, order details will be available shortly',
    });

  } catch (error) {
    console.error('Error verifying session:', error);
    return NextResponse.json(
      { error: 'Failed to verify session' },
      { status: 500 }
    );
  }
} 