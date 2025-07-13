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
  slot: 1; // Apenas 1 slot por dia
  price: number;
  description: string;
  available: boolean;
}

export interface DeliverySlot {
  slot: 1; // Apenas slot 1
  label: string; // "tarde"
  available: boolean;
  maxCapacity: number;
  currentBookings: number;
}

export interface DeliveryAvailability {
  date: string;
  slot: DeliverySlot; // Singular, apenas 1 slot
}

export interface ScheduleOptions {
  deliveryType: 'pickup' | 'delivery';
  station?: string; // Para pickup: PG, LIS, AMA
  address?: string; // Para delivery
  preferredTime?: string; // Campo livre para horário preferencial
}

// Database types (mantendo compatibilidade)
export interface DeliveryRecord {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  address: string;
  display_name: string;
  latitude: number;
  longitude: number;
  delivery_type: 'pickup' | 'delivery';
  pickup_station?: string;
  delivery_date: string;
  delivery_slot: number; // Manter como number para compatibilidade
  nearest_station: string;
  distance_to_station_meters: number;
  deviation: number;
  delivery_price: number;
  order_id?: string;
  stripe_session_id?: string;
  status: 'pending' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled';
  driver_notes?: string;
  customer_notes?: string;
  preferred_time?: string; // Novo campo para horário preferencial
  created_at: string;
  updated_at: string;
  delivered_at?: string;
}

export interface CreateDeliveryRequest {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  address: string;
  delivery_type: 'pickup' | 'delivery';
  pickup_station?: string;
  delivery_date: string;
  delivery_slot: 1; // Sempre slot 1
  order_id?: string;
  stripe_session_id?: string;
  customer_notes?: string;
  preferred_time?: string; // Horário preferencial
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
      available_slot: DeliverySlot; // Singular
    }>;
  };
  delivery_options: {
    address: string;
    coordinates: DeliveryCoordinates;
    nearest_station: string;
    distance_km: number;
    deviation: number;
    base_price: number;
    available_dates: DeliveryAvailability[];
  } | null;
  error?: string;
}