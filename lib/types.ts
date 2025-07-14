// lib/types.ts - Database types for the new structure

export interface Client {
  id: string
  name: string
  email: string
  mobile?: string
  is_guest: boolean
  provider?: 'google' | 'facebook' | 'apple'
  provider_id?: string
  image_url?: string
  given_name?: string
  family_name?: string
  locale?: string
  verified_email: boolean
  country: string
  newsletter_subscribed: boolean
  language_preference: 'pt' | 'en'
  created_at: string
  updated_at: string
  last_login_at?: string
}

export interface Address {
  id: string
  client_id: string
  address: string
  postal_code?: string
  city?: string
  is_primary: boolean
  latitude?: number
  longitude?: number
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  key: string
  name: string
  main_image?: string
  background_image?: string
  weight: number
  price: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  client_id: string
  stripe_session_id?: string
  payment_method: 'stripe' | 'cash_on_delivery'
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
  subtotal: number
  delivery_fee: number
  discount: number
  total: number
  currency: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  notes?: string
  delivery_id?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
}

export interface Delivery {
  id: string
  client_id: string
  order_id?: string
  address_id?: string
  delivery_type: 'pickup' | 'delivery'
  pickup_station?: string
  delivery_date: string
  delivery_slot: 1 | 2 | 3 | 4
  deviation: number
  delivery_price: number
  stripe_session_id?: string
  status: 'pending' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled'
  created_at: string
  updated_at: string
}

// Extended types with relations
export interface ClientWithAddresses extends Client {
  addresses: Address[]
}

export interface OrderWithItems extends Order {
  items: OrderItem[]
  client: Client
  delivery?: Delivery
}

export interface DeliveryWithDetails extends Delivery {
  client: Client
  address?: Address
  order?: Order
} 