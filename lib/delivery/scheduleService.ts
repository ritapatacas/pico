// lib/delivery/scheduleService.ts

import { calculateDeliveryPrice, findNearestStationAndDeviation } from './calculations';
import type { 
  DeliveryOption, 
  DeliveryAvailability, 
  DeliverySlot, 
  ScheduleOptions,
  DeliveryCoordinates 
} from './types';

/**
 * Calculate available dates based on delivery type
 */
function getAvailableDates(deliveryType: 'pickup' | 'delivery', station?: string): string[] {
  const today = new Date();
  const dates: string[] = [];
  
  let startDays: number;
  let maxDays = 15; // Up to 15 days after
  
  // Determine how many days after to start
  if (deliveryType === 'pickup') {
    if (station === 'PG') {
      startDays = 1; // D+1 (tomorrow) for Pedrógão Grande
    } else {
      startDays = 2; // D+2 (2 days after) for Lisboa and Amadora
    }
  } else {
    startDays = 4; // D+4 para delivery
  }
  
  for (let i = startDays; i <= maxDays; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // For delivery, exclude weekends
    if (deliveryType === 'delivery') {
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday or Saturday
        continue;
      }
    }
    
    dates.push(date.toISOString().split('T')[0]); // YYYY-MM-DD
  }
  
  return dates;
}

/**
 * Create an afternoon slot for a date
 */
function createAfternoonSlot(available: boolean = true): DeliverySlot {
  return {
    slot: 1,
    label: 'tarde',
    available,
    maxCapacity: 10,
    currentBookings: 0 // For now, assume total availability
  };
}

/**
 * Generate pickup options
 */
export function generatePickupOptions(station: string): DeliveryOption[] {
  const availableDates = getAvailableDates('pickup', station);
  
  return availableDates.map(date => ({
    type: 'pickup' as const,
    station,
    date,
    slot: 1 as const,
    price: 0, // Pickup is always free
    description: `Pickup em ${station}`,
    available: true
  }));
}

/**
 * Generate delivery options
 */
export async function generateDeliveryOptions(
  address: string,
  coordinates: DeliveryCoordinates
): Promise<DeliveryOption[]> {
  const availableDates = getAvailableDates('delivery');
  
  // Calculate price using existing logic
  const { nearestStation, distanceMeters, deviation } = findNearestStationAndDeviation(coordinates);
  const price = calculateDeliveryPrice(distanceMeters, deviation);
  
  return availableDates.map(date => ({
    type: 'delivery' as const,
    date,
    slot: 1 as const,
    price,
    description: `Entrega em ${address}`,
    available: true
  }));
}

/**
 * Generate detailed availability for the calendar
 */
export function generateScheduleAvailability(options: ScheduleOptions): DeliveryAvailability[] {
  const availableDates = getAvailableDates(options.deliveryType, options.station);
  
  return availableDates.map(date => ({
    date,
    slot: createAfternoonSlot(true)
  }));
}

/**
 * Main function to get scheduling options
 * Compatible with the format expected by the DeliveryCalendar component
 */
export async function getScheduleOptions(
  deliveryType: 'pickup' | 'delivery',
  station?: string,
  address?: string,
  coordinates?: DeliveryCoordinates
): Promise<DeliveryOption[]> {
  if (deliveryType === 'pickup' && station) {
    return generatePickupOptions(station);
  }
  
  if (deliveryType === 'delivery' && address && coordinates) {
    return await generateDeliveryOptions(address, coordinates);
  }
  
  return [];
}

/**
 * Validate if a date is valid for scheduling
 */
export function isValidScheduleDate(
  date: string,
  deliveryType: 'pickup' | 'delivery',
  station?: string
): boolean {
  const availableDates = getAvailableDates(deliveryType, station);
  return availableDates.includes(date);
}

/**
 * Get next available date
 */
export function getNextAvailableDate(
  deliveryType: 'pickup' | 'delivery',
  station?: string
): string | null {
  const availableDates = getAvailableDates(deliveryType, station);
  return availableDates.length > 0 ? availableDates[0] : null;
}

/**
 * Format date for display
 */
export function formatScheduleDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-PT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}