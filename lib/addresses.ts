import { supabase } from '@/lib/supabaseClient'
import type { Address } from '@/lib/types'

/**
 * Get all addresses for a client
 */
export async function getClientAddresses(clientId: string): Promise<Address[]> {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('client_id', clientId)
    .order('is_primary', { ascending: false })
    .order('created_at', { ascending: true })

  if (error) {
    throw error
  }

  return data || []
}

/**
 * Get primary address for a client
 */
export async function getPrimaryAddress(clientId: string): Promise<Address | null> {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('client_id', clientId)
    .eq('is_primary', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Not found
    }
    throw error
  }

  return data
}

/**
 * Create a new address
 */
export async function createAddress(addressData: {
  client_id: string
  address: string
  postal_code?: string
  city?: string
  latitude?: number
  longitude?: number
  is_primary?: boolean
}): Promise<Address> {
  // If this is a primary address, unset other primary addresses for this client
  if (addressData.is_primary) {
    await supabase
      .from('addresses')
      .update({ is_primary: false })
      .eq('client_id', addressData.client_id)
      .eq('is_primary', true)
  }

  const { data, error } = await supabase
    .from('addresses')
    .insert([{
      ...addressData,
      is_primary: addressData.is_primary ?? false,
    }])
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

/**
 * Update an address
 */
export async function updateAddress(
  id: string,
  updates: Partial<Address>
): Promise<Address> {
  // If setting this as primary, unset other primary addresses for the same client
  if (updates.is_primary) {
    const { data: currentAddress } = await supabase
      .from('addresses')
      .select('client_id')
      .eq('id', id)
      .single()

    if (currentAddress) {
      await supabase
        .from('addresses')
        .update({ is_primary: false })
        .eq('client_id', currentAddress.client_id)
        .eq('is_primary', true)
        .neq('id', id)
    }
  }

  const { data, error } = await supabase
    .from('addresses')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

/**
 * Delete an address
 */
export async function deleteAddress(id: string): Promise<void> {
  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }
}

/**
 * Set an address as primary
 */
export async function setPrimaryAddress(id: string): Promise<Address> {
  // Get the client_id for this address
  const { data: address, error: fetchError } = await supabase
    .from('addresses')
    .select('client_id')
    .eq('id', id)
    .single()

  if (fetchError) {
    throw fetchError
  }

  // Unset other primary addresses for this client
  await supabase
    .from('addresses')
    .update({ is_primary: false })
    .eq('client_id', address.client_id)
    .eq('is_primary', true)

  // Set this address as primary
  const { data, error } = await supabase
    .from('addresses')
    .update({ is_primary: true })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

/**
 * Find or create address for a client
 */
export async function findOrCreateAddress(
  clientId: string,
  addressData: {
    address: string
    postal_code?: string
    city?: string
    latitude?: number
    longitude?: number
  }
): Promise<Address> {
  // Check if address already exists for this client
  const { data: existingAddress, error: findError } = await supabase
    .from('addresses')
    .select('*')
    .eq('client_id', clientId)
    .eq('address', addressData.address)
    .single()

  if (findError && findError.code !== 'PGRST116') {
    throw findError
  }

  if (existingAddress) {
    return existingAddress
  }

  // Create new address
  return createAddress({
    client_id: clientId,
    ...addressData,
    is_primary: false, // Don't make it primary by default
  })
} 