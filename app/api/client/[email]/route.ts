import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: { email: string } }
) {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select(`
        *,
        addresses(*)
      `)
      .eq('email', decodeURIComponent(params.email))
      .single()

    if (error) {
      console.error('Error fetching client:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { email: string } }
) {
  try {
    const body = await request.json()
    const { name, mobile, address } = body

    // Update client basic info
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (mobile !== undefined) updateData.mobile = mobile

    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .update(updateData)
      .eq('email', decodeURIComponent(params.email))
      .select()
      .single()

    if (clientError) {
      console.error('Error updating client:', clientError)
      return NextResponse.json({ error: clientError.message }, { status: 400 })
    }

    // Update address if provided
    if (address !== undefined && clientData) {
      // Check if client has a primary address
      const { data: existingAddress, error: addressCheckError } = await supabase
        .from('addresses')
        .select('id')
        .eq('client_id', clientData.id)
        .eq('is_primary', true)
        .single()

      if (addressCheckError && addressCheckError.code !== 'PGRST116') {
        console.error('Error checking existing address:', addressCheckError)
      }

      if (existingAddress) {
        // Update existing primary address
        const { error: addressUpdateError } = await supabase
          .from('addresses')
          .update({ address })
          .eq('id', existingAddress.id)

        if (addressUpdateError) {
          console.error('Error updating address:', addressUpdateError)
        }
      } else {
        // Create new primary address
        const { error: addressCreateError } = await supabase
          .from('addresses')
          .insert([{
            client_id: clientData.id,
            address,
            is_primary: true,
          }])

        if (addressCreateError) {
          console.error('Error creating address:', addressCreateError)
        }
      }
    }

    // Return updated client with addresses
    const { data: finalData, error: finalError } = await supabase
      .from('clients')
      .select(`
        *,
        addresses(*)
      `)
      .eq('email', decodeURIComponent(params.email))
      .single()

    if (finalError) {
      console.error('Error fetching final client data:', finalError)
      return NextResponse.json({ error: finalError.message }, { status: 400 })
    }

    return NextResponse.json(finalData)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 