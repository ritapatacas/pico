import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const PRODUCER_EMAIL = 'opicodarosa@gmail.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'info@picodarosa.pt'; // sandbox for tests

function getBaseUrl() {
  if (process.env.NODE_ENV === 'production') {
    return 'https://picodarosa.pt';
  }
  return 'http://localhost:3000';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, adminToken, orderSummary } = body;
    if (!orderId || !adminToken || !orderSummary) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const baseUrl = getBaseUrl();
    const approveUrl = `${baseUrl}/api/orders/confirm?orderId=${orderId}&action=approve&token=${adminToken}`;
    const rejectUrl = `${baseUrl}/api/orders/confirm?orderId=${orderId}&action=reject&token=${adminToken}`;

    const html = `
      <h2>Nova encomenda recebida</h2>
      <p>Resumo do pedido:</p>
      <pre>${orderSummary}</pre>
      <p>
        <a href="${approveUrl}" style="padding:10px 20px;background:#22c55e;color:#fff;text-decoration:none;border-radius:4px;">Aprovar</a>
        &nbsp;
        <a href="${rejectUrl}" style="padding:10px 20px;background:#ef4444;color:#fff;text-decoration:none;border-radius:4px;">Rejeitar</a>
      </p>
      <p>Ou gere o pedido manualmente no painel de admin.</p>
    `;

    console.log('Enviando email via Resend:', {
      from: FROM_EMAIL,
      to: PRODUCER_EMAIL,
      orderId,
      adminToken,
      orderSummary,
    });

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: PRODUCER_EMAIL,
      subject: 'Nova encomenda recebida',
      html,
    });

    if (error) {
      console.error('Erro do Resend:', error);
      return NextResponse.json({ error: error.message || 'Erro ao enviar email', details: error }, { status: 500 });
    }

    console.log('Email enviado com sucesso:', data);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Erro inesperado ao enviar email:', err);
    return NextResponse.json({ error: err.message || 'Erro inesperado', details: err }, { status: 500 });
  }
} 