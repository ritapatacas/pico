import { supabase } from '@/lib/supabaseClient'

export interface Client {
  id: string
  name: string
  email: string
  mobile?: string
  address?: string
  provider?: string
  provider_id?: string
  image_url?: string
  // ... outros campos
}

export async function findOrCreateClient(clientData: {
  name: string
  email: string
  mobile?: string
  address?: string
  provider?: string
  provider_id?: string
  image_url?: string
}): Promise<string> {
  const { data, error } = await supabase.rpc('find_or_create_client', {
    p_name: clientData.name,
    p_email: clientData.email,
    p_mobile: clientData.mobile,
    p_address: clientData.address,
    p_provider: clientData.provider,
    p_provider_id: clientData.provider_id,
    p_image_url: clientData.image_url,
  })

  if (error) throw error
  return data
}

export async function getClientStats(clientId: string) {
  const { data, error } = await supabase.rpc('get_client_stats', {
    p_client_id: clientId
  })

  if (error) throw error
  return data
} 