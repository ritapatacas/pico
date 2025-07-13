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
      .select('*')
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

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (mobile !== undefined) updateData.mobile = mobile
    if (address !== undefined) updateData.address = address

    const { data, error } = await supabase
      .from('clients')
      .update(updateData)
      .eq('email', decodeURIComponent(params.email))
      .select()
      .single()

    if (error) {
      console.error('Error updating client:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 