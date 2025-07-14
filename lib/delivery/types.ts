// lib/delivery/types.ts

export interface Station {
  name: string;
  lat: number;
  lon: number;
}

export interface DeliveryCoordinates {
  lat: number;
  lon: number;
}

export interface GeocodeResult {
  lat: number;
  lon: number;
  displayName: string;
}

export interface DistanceCalculation {
  nearestStation: Station;
  distanceMeters: number;
  deviation: number;
}

export interface DeliveryOption {
  type: 'pickup' | 'delivery';
  station?: string;
  date: string;
  slot: 1 | 2 | 3 | 4; // Updated to support multiple slots
  price: number;
  description: string;
  available: boolean;
}

export interface DeliverySlot {
  slot: 1 | 2 | 3 | 4; // Updated to support multiple slots
  label: string;
  available: boolean;
  maxCapacity: number;
  currentBookings: number;
}

export interface DeliveryAvailability {
  date: string;
  slots: DeliverySlot[]; // Updated to support multiple slots
}

export interface ScheduleOptions {
  deliveryType: 'pickup' | 'delivery';
  station?: string; // Para pickup: PG, LIS, AMA
  address?: string; // Para delivery
  preferredTime?: string; // Campo livre para horário preferencial
}

// Database types (updated for new structure)
export interface DeliveryRecord {
  id: string;
  client_id: string;
  order_id?: string;
  address_id?: string;
  delivery_type: 'pickup' | 'delivery';
  pickup_station?: string;
  delivery_date: string;
  delivery_slot: 1 | 2 | 3 | 4;
  deviation: number;
  delivery_price: number;
  stripe_session_id?: string;
  status: 'pending' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface CreateDeliveryRequest {
  client_id: string;
  order_id?: string;
  address_id?: string;
  delivery_type: 'pickup' | 'delivery';
  pickup_station?: string;
  delivery_date: string;
  delivery_slot: 1 | 2 | 3 | 4;
  deviation: number;
  delivery_price: number;
  stripe_session_id?: string;
}

export interface DeliveryOptionsRequest {
  address: string;
  date?: string;
}

export interface DeliveryOptionsResponse {
  pickup_options: {
    stations: Array<{
      name: string;
      address: string;
      available_slots: DeliverySlot[];
    }>;
  };
  delivery_options: {
    address: string;
    coordinates: DeliveryCoordinates;
    deviation: number;
    base_price: number;
    available_dates: DeliveryAvailability[];
  } | null;
  error?: string;
}