import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Check if Stripe secret key is configured
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY is not configured in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

// Helper function to convert relative image paths to absolute URLs
function getAbsoluteImageUrl(imagePath: string, request: NextRequest): string {
  if (!imagePath) return '';
  
  // If it's already an absolute URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Convert relative path to absolute URL
  const baseUrl = request.nextUrl.origin;
  return `${baseUrl}${imagePath}`;
}

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is properly configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is missing');
      return NextResponse.json(
        { error: 'Stripe não está configurado. Contacte o administrador.' },
        { status: 500 }
      );
    }

    const { items } = await request.json();

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items inválidos' },
        { status: 400 }
      );
    }

    // Criar a sessão de checkout do Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
            images: item.image ? [getAbsoluteImageUrl(item.image, request)] : [],
          },
          unit_amount: Math.round(item.price * 100), // Stripe usa centavos
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/payment`,
      locale: 'pt',
      currency: 'eur',
      payment_method_options: {
        card: {
          request_three_d_secure: 'automatic',
        },
      },
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Invalid API key')) {
        return NextResponse.json(
          { error: 'Chave da API do Stripe inválida. Contacte o administrador.' },
          { status: 500 }
        );
      }
      if (error.message.includes('No such product')) {
        return NextResponse.json(
          { error: 'Produto não encontrado no Stripe' },
          { status: 400 }
        );
      }
      if (error.message.includes('Not a valid URL')) {
        return NextResponse.json(
          { error: 'URL da imagem inválida. Contacte o administrador.' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Erro interno do servidor. Tente novamente mais tarde.' },
      { status: 500 }
    );
  }
} 