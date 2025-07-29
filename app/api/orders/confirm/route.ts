import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { Order } from '@/lib/types';

// /api/orders/confirm?orderId=...&action=approve|reject&token=...
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');
  const action = searchParams.get('action');
  const token = searchParams.get('token');

  if (!orderId || !action || !token) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  // Fetch order and validate token
  const { data: order, error } = await supabase
    .from('orders')
    .select('id, admin_token, status')
    .eq('id', orderId)
    .single();

  if (error || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  if (order.admin_token !== token) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
  }

  // Only allow approving if pending
  if (order.status !== 'pending') {
    return NextResponse.json({ error: 'Order is not pending' }, { status: 400 });
  }

  let newStatus: Order['status'];
  if (action === 'approve') {
    newStatus = 'confirmed';
  } else if (action === 'reject') {
    newStatus = 'cancelled';
  } else {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  // Update status
  const { error: updateError } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId);

  if (updateError) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }

  // Simple response (can be HTML or JSON)
  return NextResponse.json({ success: true, status: newStatus });
} 