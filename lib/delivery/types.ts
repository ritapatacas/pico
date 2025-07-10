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
    slot: number;
    price: number;
    description: string;
  }
  
  export interface DeliverySlot {
    slot: number;
    label: string;
    available: boolean;
    maxCapacity: number;
    currentBookings: number;
  }
  
  export interface DeliveryAvailability {
    date: string;
    slots: DeliverySlot[];
  }
  
  // Database types
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
    delivery_slot: number;
    nearest_station: string;
    distance_to_station_meters: number;
    deviation: number;
    delivery_price: number;
    order_id?: string;
    stripe_session_id?: string;
    status: 'pending' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled';
    driver_notes?: string;
    customer_notes?: string;
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
    delivery_slot: number;
    order_id?: string;
    stripe_session_id?: string;
    customer_notes?: string;
  }
  
  export interface DeliveryOptionsRequest {
    address: string;
    date?: string; // If not provided, will check multiple dates
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
      nearest_station: string;
      distance_km: number;
      deviation: number;
      base_price: number;
      available_dates: DeliveryAvailability[];
    } | null;
    error?: string;
  }