"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    if (sessionId) {
      // Aqui você pode fazer uma chamada para verificar o status do pagamento
      // Por enquanto, vamos simular que foi bem-sucedido
      setTimeout(() => {
        setPaymentDetails({
          status: "success",
          amount: "0.00", // Seria obtido da API do Stripe
        });
        setLoading(false);
      }, 1000);
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Verificando pagamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Pagamento Concluído!
          </h1>
          <p className="text-gray-600">
            Obrigado pela sua compra. O seu pedido foi processado com sucesso.
          </p>
        </div>

        {sessionId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">
              <strong>ID da Sessão:</strong> {sessionId}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Enviaremos um email de confirmação com os detalhes do seu pedido.
          </p>
          
          <div className="pt-4">
            <Link href="/">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Voltar à Loja
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 