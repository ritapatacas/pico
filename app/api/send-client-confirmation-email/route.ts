import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || 'info@picodarosa.pt';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { to, orderSummary, orderId } = body;
    if (!to || !orderSummary) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const html = `
      <h2>Obrigado pela sua encomenda!</h2>
      <p>Recebemos o seu pedido e está em processamento.</p>
      <p>Resumo do pedido:</p>
      <pre>${orderSummary}</pre>
      ${orderId ? `<p><strong>ID do Pedido:</strong> ${orderId}</p>` : ''}
      <p>Em breve receberá uma atualização do estado da sua encomenda.</p>
      <p>Se tiver dúvidas, responda a este email.</p>
    `;

    console.log('Enviando email de confirmação ao cliente:', { from: FROM_EMAIL, to, orderId, orderSummary });

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Confirmação da sua encomenda',
      html,
    });

    if (error) {
      console.error('Erro do Resend (cliente):', error);
      return NextResponse.json({ error: error.message || 'Erro ao enviar email', details: error }, { status: 500 });
    }

    console.log('Email de confirmação enviado ao cliente:', data);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Erro inesperado ao enviar email ao cliente:', err);
    return NextResponse.json({ error: err.message || 'Erro inesperado', details: err }, { status: 500 });
  }
} 