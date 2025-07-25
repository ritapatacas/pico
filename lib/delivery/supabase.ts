// lib/delivery/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
import type { DeliveryRecord, CreateDeliveryRequest, DeliverySlot } from './types';

/**
 * Get available delivery slots for a specific date
 */
export async function getAvailableSlots(
  date: string
): Promise<DeliverySlot[]> {
  const maxCapacityPerSlot = 10; // Maximum deliveries per slot
  
  // Get current bookings for the date
  const { data: bookings, error } = await supabase
    .from('deliveries')
    .select('delivery_slot')
    .eq('delivery_date', date)
    .eq('status', 'confirmed');
  
  if (error) {
    console.error('Error fetching delivery slots:', error);
    throw new Error('Failed to fetch delivery slots');
  }

  // Count bookings per slot
  const slotCounts: Record<number, number> = {};
  bookings?.forEach(booking => {
    slotCounts[booking.delivery_slot] = (slotCounts[booking.delivery_slot] || 0) + 1;
  });

  // Create slot objects
  const slots: DeliverySlot[] = [
    {
      slot: 1,
      label: '14:00 - 15:30',
      available: (slotCounts[1] || 0) < maxCapacityPerSlot,
      maxCapacity: maxCapacityPerSlot,
      currentBookings: slotCounts[1] || 0,
    },
    {
      slot: 2,
      label: '15:30 - 17:00',
      available: (slotCounts[2] || 0) < maxCapacityPerSlot,
      maxCapacity: maxCapacityPerSlot,
      currentBookings: slotCounts[2] || 0,
    },
    {
      slot: 3,
      label: '17:00 - 18:30',
      available: (slotCounts[3] || 0) < maxCapacityPerSlot,
      maxCapacity: maxCapacityPerSlot,
      currentBookings: slotCounts[3] || 0,
    },
    {
      slot: 4,
      label: '18:30 - 20:00',
      available: (slotCounts[4] || 0) < maxCapacityPerSlot,
      maxCapacity: maxCapacityPerSlot,
      currentBookings: slotCounts[4] || 0,
    },
  ];

  return slots;
}

/**
 * Create a new delivery booking
 */
export async function createDelivery(
  request: CreateDeliveryRequest
): Promise<DeliveryRecord> {
  const { data, error } = await supabase
    .from('deliveries')
    .insert(request)
    .select()
    .single();

  if (error) {
    console.error('Error creating delivery:', error);
    throw new Error('Failed to create delivery booking');
  }

  return data;
}

/**
 * Get delivery by ID
 */
export async function getDeliveryById(id: string): Promise<DeliveryRecord | null> {
  const { data, error } = await supabase
    .from('deliveries')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    console.error('Error fetching delivery:', error);
    throw new Error('Failed to fetch delivery');
  }

  return data;
}

/**
 * Update delivery status
 */
export async function updateDeliveryStatus(
  id: string,
  status: DeliveryRecord['status']
): Promise<void> {
  const { error } = await supabase
    .from('deliveries')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Error updating delivery status:', error);
    throw new Error('Failed to update delivery status');
  }
}

/**
 * Get deliveries for a client
 */
export async function getClientDeliveries(clientId: string): Promise<DeliveryRecord[]> {
  const { data, error } = await supabase
    .from('deliveries')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching client deliveries:', error);
    throw new Error('Failed to fetch client deliveries');
  }

  return data || [];
}

/**
 * Get deliveries for admin view
 */
export async function getDeliveriesForDate(
  date: string,
  status?: DeliveryRecord['status']
): Promise<DeliveryRecord[]> {
  let query = supabase
    .from('deliveries')
    .select(`
      *,
      clients(name, email),
      addresses(address, city, postal_code)
    `)
    .eq('delivery_date', date);

  if (status) {
    query = query.eq('status', status);
  }

  query = query.order('delivery_slot', { ascending: true });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching deliveries for date:', error);
    throw new Error('Failed to fetch deliveries');
  }

  return data || [];
} 