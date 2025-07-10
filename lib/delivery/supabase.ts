// lib/delivery/supabase.ts

import { supabase } from '../supabaseClient';
import type { DeliveryRecord, CreateDeliveryRequest, DeliverySlot } from './types';

/**
 * Get available delivery slots for a specific date and station
 */
export async function getAvailableSlots(
  date: string,
  station?: string
): Promise<DeliverySlot[]> {
  const maxCapacityPerSlot = 10; // Maximum deliveries per slot
  
  // Get current bookings for the date
  let query = supabase
    .from('deliveries')
    .select('delivery_slot')
    .eq('delivery_date', date)
    .eq('status', 'confirmed');

  if (station) {
    query = query.eq('nearest_station', station);
  }

  const { data: bookings, error } = await query;
  
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
  request: CreateDeliveryRequest,
  coordinates: { lat: number; lon: number },
  displayName: string,
  nearestStation: string,
  distanceMeters: number,
  deviation: number,
  price: number
): Promise<DeliveryRecord> {
  const deliveryData = {
    customer_name: request.customer_name,
    customer_email: request.customer_email,
    customer_phone: request.customer_phone,
    address: request.address,
    display_name: displayName,
    latitude: coordinates.lat,
    longitude: coordinates.lon,
    delivery_type: request.delivery_type,
    pickup_station: request.pickup_station,
    delivery_date: request.delivery_date,
    delivery_slot: request.delivery_slot,
    nearest_station: nearestStation,
    distance_to_station_meters: distanceMeters,
    deviation,
    delivery_price: price,
    order_id: request.order_id,
    stripe_session_id: request.stripe_session_id,
    customer_notes: request.customer_notes,
    status: 'pending' as const,
  };

  const { data, error } = await supabase
    .from('deliveries')
    .insert(deliveryData)
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
  status: DeliveryRecord['status'],
  driverNotes?: string
): Promise<void> {
  const updateData: any = { status };
  
  if (driverNotes) {
    updateData.driver_notes = driverNotes;
  }
  
  if (status === 'delivered') {
    updateData.delivered_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('deliveries')
    .update(updateData)
    .eq('id', id);

  if (error) {
    console.error('Error updating delivery status:', error);
    throw new Error('Failed to update delivery status');
  }
}

/**
 * Get deliveries for a customer
 */
export async function getCustomerDeliveries(email: string): Promise<DeliveryRecord[]> {
  const { data, error } = await supabase
    .from('deliveries')
    .select('*')
    .eq('customer_email', email)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching customer deliveries:', error);
    throw new Error('Failed to fetch customer deliveries');
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
    .select('*')
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