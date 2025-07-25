import { supabase } from '@/lib/supabaseClient'

export interface Client {
  id: string
  name: string
  email: string
  mobile?: string
  is_guest: boolean
  provider?: string
  provider_id?: string
  image_url?: string
  given_name?: string
  family_name?: string
  locale?: string
  verified_email: boolean
  country: string
  newsletter_subscribed: boolean
  language_preference: string
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

export interface ClientWithAddresses extends Client {
  addresses: Address[]
}

export async function findOrCreateClient(clientData: {
  name: string
  email: string
  mobile?: string
  provider?: string
  provider_id?: string
  image_url?: string
  given_name?: string
  family_name?: string
  locale?: string
  verified_email?: boolean
}): Promise<string> {
  // Check if client exists
  const { data: existingClient, error: findError } = await supabase
    .from('clients')
    .select('id')
    .eq('email', clientData.email)
    .single()

  if (findError && findError.code !== 'PGRST116') {
    throw findError
  }

  if (existingClient) {
    return existingClient.id
  }

  // Create new client
  const { data: newClient, error: createError } = await supabase
    .from('clients')
    .insert([{
      name: clientData.name,
      email: clientData.email,
      mobile: clientData.mobile,
      is_guest: false,
      provider: clientData.provider,
      provider_id: clientData.provider_id,
      image_url: clientData.image_url,
      given_name: clientData.given_name,
      family_name: clientData.family_name,
      locale: clientData.locale,
      verified_email: clientData.verified_email ?? false,
    }])
    .select('id')
    .single()

  if (createError) {
    throw createError
  }

  return newClient.id
}

export async function getClientStats(clientId: string) {
  // Get client with orders and deliveries
  const { data, error } = await supabase
    .from('clients')
    .select(`
      *,
      orders(count, status),
      deliveries(count, status)
    `)
    .eq('id', clientId)
    .single()

  if (error) {
    throw error
  }

  return data
} 