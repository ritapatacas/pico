import { supabase } from '@/lib/supabaseClient'
import type { Order, OrderItem, OrderWithItems } from '@/lib/types'

// Legacy interface for backward compatibility
export interface LegacyOrder {
  id: string;
  sessionId: string;
  customerEmail?: string;
  customerName?: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  createdAt: Date;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
}

// Simple order storage using localStorage (legacy)
// In production, this would be replaced with a database
export class OrderManager {
  private static STORAGE_KEY = 'picodarosa_orders';

  static saveOrder(order: LegacyOrder): void {
    if (typeof window === 'undefined') return;
    
    const orders = this.getAllOrders();
    orders.push(order);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
  }

  static getOrder(sessionId: string): LegacyOrder | null {
    if (typeof window === 'undefined') return null;
    
    const orders = this.getAllOrders();
    return orders.find(order => order.sessionId === sessionId) || null;
  }

  static getAllOrders(): LegacyOrder[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading orders:', error);
      return [];
    }
  }

  static updateOrderStatus(sessionId: string, status: LegacyOrder['status']): void {
    if (typeof window === 'undefined') return;
    
    const orders = this.getAllOrders();
    const orderIndex = orders.findIndex(order => order.sessionId === sessionId);
    
    if (orderIndex !== -1) {
      orders[orderIndex].status = status;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
    }
  }

  static getOrdersByEmail(email: string): LegacyOrder[] {
    if (typeof window === 'undefined') return [];
    
    const orders = this.getAllOrders();
    return orders.filter(order => order.customerEmail === email);
  }

  static clearOrders(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

// New database functions
export async function getOrderBySessionId(sessionId: string): Promise<OrderWithItems | null> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(*),
      client:clients(*),
      delivery:deliveries!deliveries_order_id_fkey(*)
    `)
    .eq('stripe_session_id', sessionId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Not found
    }
    throw error
  }

  return data
}

export async function getOrdersByClientId(clientId: string): Promise<OrderWithItems[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(*),
      client:clients(*),
      delivery:deliveries!deliveries_order_id_fkey(*)
    `)
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data || []
}

export async function getOrdersByEmail(email: string): Promise<OrderWithItems[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(*),
      client:clients!inner(*),
      delivery:deliveries!deliveries_order_id_fkey(*)
    `)
    .eq('client.email', email)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data || []
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)

  if (error) {
    throw error
  }
}

export async function createOrder(orderData: {
  client_id: string
  stripe_session_id?: string
  payment_method: Order['payment_method']
  subtotal: number
  delivery_fee: number
  discount: number
  total: number
  currency: string
  items: Array<{
    product_id?: string
    product_name: string
    quantity: number
    unit_price: number
    total_price: number
  }>
}): Promise<OrderWithItems> {
  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([{
      client_id: orderData.client_id,
      stripe_session_id: orderData.stripe_session_id,
      payment_method: orderData.payment_method,
      payment_status: 'pending',
      subtotal: orderData.subtotal,
      delivery_fee: orderData.delivery_fee,
      discount: orderData.discount,
      total: orderData.total,
      currency: orderData.currency,
      status: 'pending',
    }])
    .select()
    .single()

  if (orderError) {
    throw orderError
  }

  // Create order items
  if (orderData.items.length > 0) {
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
    }))

    console.log('Creating order items:', orderItems);

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      throw itemsError
    }
  }

  // Return complete order with items
  if (order.stripe_session_id) {
    return getOrderBySessionId(order.stripe_session_id) || order
  } else {
    // For cash orders, return the order directly since we don't have a session ID
    return order
  }
} 