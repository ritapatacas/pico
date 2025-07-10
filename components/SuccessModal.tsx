"use client";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Mail, Home, Calendar, MapPin, CreditCard, Banknote } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/contexts/cart-context";
import Modal from "@/components/ui/Modal";

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

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  sessionId?: string;
  paymentMethod?: 'stripe' | 'cash';
  deliveryInfo?: {
    type: 'pickup' | 'delivery';
    location: string;
    date: string;
    slot?: number;
  };
}

export default function SuccessModal({ 
  open, 
  onClose, 
  sessionId, 
  paymentMethod = 'stripe',
  deliveryInfo 
}: SuccessModalProps) {
  const { clearCart, cartItems, cartTotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasClearedCart = useRef(false);
  const [deliveryFee, setDeliveryFee] = useState(0);

  console.log('SuccessModal render - open:', open, 'sessionId:', sessionId, 'paymentMethod:', paymentMethod, 'deliveryInfo:', deliveryInfo);

  useEffect(() => {
    if (open && !hasClearedCart.current) {
      hasClearedCart.current = true;
      
      // Get delivery fee from localStorage if available
      try {
        const shippingData = localStorage.getItem("shipping");
        if (shippingData) {
          const shipping = JSON.parse(shippingData);
          // Calculate delivery fee based on delivery type and slot
          if (deliveryInfo?.type === 'delivery' && deliveryInfo?.slot) {
            const deliveryOptions = [
              { slot: 1, price: 0 },
              { slot: 2, price: 1.5 },
              { slot: 3, price: 2.5 },
              { slot: 4, price: 3.0 }
            ];
            const option = deliveryOptions.find(opt => opt.slot === deliveryInfo.slot);
            setDeliveryFee(option?.price || 0);
          } else {
            setDeliveryFee(0); // Pickup is free
          }
        }
      } catch (error) {
        console.error('Error parsing shipping data:', error);
        setDeliveryFee(0);
      }
      
      if (sessionId && paymentMethod === 'stripe') {
        setLoading(true);
        // Clear cart and shipping info after successful payment
        clearCart();
        localStorage.removeItem("shipping");
        
        // Verify the payment session with Stripe
        verifyPaymentSession(sessionId);
      } else if (paymentMethod === 'cash') {
        // For cash on delivery, don't clear cart immediately - show success first
        localStorage.removeItem("shipping");
        setLoading(false);
      }
    }
  }, [open, sessionId, paymentMethod, deliveryInfo]); // Added deliveryInfo to dependencies

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

  const handleClose = () => {
    setError(null);
    setPaymentDetails(null);
    hasClearedCart.current = false;
    
    // Clear cart when modal is closed
    if (paymentMethod === 'cash') {
      clearCart();
    }
    
    onClose();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatSlot = (slot: number) => {
    const slots = {
      1: '09:00 - 12:00',
      2: '12:00 - 15:00', 
      3: '15:00 - 18:00',
      4: '18:00 - 21:00'
    };
    return slots[slot as keyof typeof slots] || `Slot ${slot}`;
  };

  if (loading) {
    return (
      <Modal open={open} onClose={handleClose}>
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando pagamento...</p>
        </div>
      </Modal>
    );
  }

  if (error) {
    return (
      <Modal open={open} onClose={handleClose}>
        <div className="max-w-md w-full bg-white rounded-lg p-8 text-center">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-red-600 mb-2">
              Erro na Verificação
            </h1>
            <p className="text-gray-600">{error}</p>
          </div>
          <Button onClick={handleClose} className="w-full bg-blue-600 hover:bg-blue-700">
            Fechar
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pedido Confirmado!
          </h1>
          <p className="text-gray-600 text-lg">
            Obrigado pela sua compra. O seu pedido foi processado com sucesso.
          </p>
        </div>

        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Resumo do Pedido
            </h2>
            
            {paymentDetails?.items && paymentDetails.items.length > 0 ? (
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
            ) : (
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-600">
                      {item.quantity} × {item.price.toFixed(2)}€
                    </span>
                  </div>
                ))}
              </div>
            )}
            
            <div className="border-t pt-4 space-y-2">
              {deliveryFee > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span>Taxa de entrega:</span>
                  <span>{deliveryFee.toFixed(2)}€</span>
                </div>
              )}
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span>
                  {paymentDetails?.amount || (cartTotal + deliveryFee).toFixed(2)}€
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              {paymentMethod === 'stripe' ? <CreditCard className="h-5 w-5" /> : <Banknote className="h-5 w-5" />}
              Método de Pagamento
            </h2>
            <div className="text-sm text-gray-700">
              {paymentMethod === 'stripe' ? (
                <p>💳 <strong>Cartão de Crédito/Débito</strong> - Pagamento processado com sucesso</p>
              ) : (
                <p>💵 <strong>Contra-reembolso</strong> - Pagamento na entrega</p>
              )}
            </div>
          </div>

          {/* Delivery Information */}
          {deliveryInfo && (
            <div className="bg-green-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Informações de Entrega
              </h2>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Tipo:</span>
                  <span>{deliveryInfo.type === 'pickup' ? 'Levantar em mão' : 'Entrega ao domicílio'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Local:</span>
                  <span>{deliveryInfo.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Data:</span>
                  <span>{formatDate(deliveryInfo.date)}</span>
                </div>
                {deliveryInfo.slot && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Horário:</span>
                    <span>{formatSlot(deliveryInfo.slot)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Details */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Próximos Passos
            </h2>
            <div className="space-y-3 text-sm text-gray-700">
              <p>✅ <strong>Pedido confirmado</strong> - O seu pedido foi processado com sucesso</p>
              <p>📧 <strong>Email de confirmação</strong> - Enviaremos um email com os detalhes do pedido</p>
              <p>📦 <strong>Preparação do pedido</strong> - O seu pedido será preparado e enviado em breve</p>
              {paymentDetails?.order_id && (
                <p>🆔 <strong>ID do Pedido:</strong> {paymentDetails.order_id}</p>
              )}
            </div>
          </div>

          {/* Session ID for Stripe payments */}
          {sessionId && paymentMethod === 'stripe' && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                <strong>ID da Sessão:</strong> {sessionId}
              </p>
            </div>
          )}
        </div>

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
    </Modal>
  );
} 