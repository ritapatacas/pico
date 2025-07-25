"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Mail, Home } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/contexts/cart-context";

interface PaymentDetails {
  status: string;
  amount: string;
  customer_email?: string;
  order_id?: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: string;
  }>;
}

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      // Clear cart and shipping info after successful payment
      clearCart();
      localStorage.removeItem("shipping");
      
      // Verify the payment session with Stripe
      verifyPaymentSession(sessionId);
    } else {
      setLoading(false);
    }
  }, [sessionId, clearCart]);

  const verifyPaymentSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/verify-session?session_id=${sessionId}`);
      const data = await response.json();
      
      if (response.ok) {
        setPaymentDetails(data);
      } else {
        setError(data.error || 'Erro ao verificar pagamento');
      }
    } catch (error) {
      console.error('Error verifying session:', error);
      setError('Erro ao verificar pagamento');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando pagamento...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-red-600 mb-2">
              Erro na Verificação
            </h1>
            <p className="text-gray-600">{error}</p>
          </div>
          <Link href="/">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Voltar à Loja
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pagamento Concluído!
          </h1>
          <p className="text-gray-600 text-lg">
            Obrigado pela sua compra. O seu pedido foi processado com sucesso.
          </p>
        </div>

        {paymentDetails && (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Resumo do Pedido
              </h2>
              
              {paymentDetails.items && paymentDetails.items.length > 0 && (
                <div className="space-y-3 mb-4">
                  {paymentDetails.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-600">
                        {item.quantity} × {item.price}€
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span>{paymentDetails.amount}€</span>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Próximos Passos
              </h2>
              <div className="space-y-3 text-sm text-gray-700">
                <p>✅ <strong>Pagamento confirmado</strong> - O seu pagamento foi processado com sucesso</p>
                <p>📧 <strong>Email de confirmação</strong> - Enviaremos um email com os detalhes do pedido</p>
                <p>📦 <strong>Preparação do pedido</strong> - O seu pedido será preparado e enviado em breve</p>
                {paymentDetails.order_id && (
                  <p>🆔 <strong>ID do Pedido:</strong> {paymentDetails.order_id}</p>
                )}
              </div>
            </div>

            {/* Session ID */}
            {sessionId && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  <strong>ID da Sessão:</strong> {sessionId}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 space-y-4">
          <Link href="/">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2">
              <Home className="h-4 w-4" />
              Voltar à Loja
            </Button>
          </Link>
          
          <Link href="/mirtilos">
            <Button variant="outline" className="w-full">
              Continuar a Comprar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 