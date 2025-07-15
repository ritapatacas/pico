"use client";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Mail, Home, Calendar, MapPin, CreditCard, Banknote } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/contexts/cart-context";
import Modal from "@/components/ui/Modal";
import { createOrder } from "@/lib/orders";
import { findOrCreateClient } from "@/lib/clients";
import { findOrCreateAddress } from "@/lib/addresses";
import { createDelivery } from "@/lib/delivery/supabase";
import { getProductIdsByKeys } from "@/lib/products";

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
        setLoading(true);
        // For cash on delivery, create order in database
        createCashOrder();
      }
    }
  }, [open, sessionId, paymentMethod, deliveryInfo, cartItems, cartTotal, clearCart]);

  const createCashOrder = async () => {
    try {
      const shippingData = localStorage.getItem("shipping");
      if (!shippingData) {
        throw new Error('Shipping data not found');
      }

      const shipping = JSON.parse(shippingData);
      
      // Create or find client
      const clientId = await findOrCreateClient({
        name: shipping.name,
        email: shipping.email,
        mobile: shipping.phone,
      });

      // Create address if delivery
      let addressId: string | undefined;
      if (deliveryInfo?.type === 'delivery' && shipping.address) {
        const address = await findOrCreateAddress(clientId, {
          address: shipping.address,
        });
        addressId = address.id;
      }

      // Get product IDs from product keys
      const productKeys = cartItems
        .map(item => item.product_key)
        .filter(Boolean) as string[];
      
      console.log('Cart items:', cartItems);
      console.log('Product keys extracted:', productKeys);
      
      const productIds = await getProductIdsByKeys(productKeys);
      console.log('Product IDs found:', productIds);

      // Create order
      const order = await createOrder({
        client_id: clientId,
        payment_method: 'cash_on_delivery',
        subtotal: cartTotal,
        delivery_fee: deliveryFee,
        discount: 0,
        total: cartTotal + deliveryFee,
        currency: 'EUR',
        items: cartItems.map(item => {
          let productId = item.product_key ? productIds[item.product_key] : null;
          
          // If no product_id found, try to find a default product for this item
          if (!productId && item.size) {
            // Try to find a product based on the size
            const defaultKey = item.size === '125g' ? 'BLU_125' : 
                             item.size === '250g' ? 'BLU_250' : 
                             item.size === '500g' ? 'BLU_500' : 
                             item.size === '700g' ? 'BLU_700' : null;
            if (defaultKey && productIds[defaultKey]) {
              console.log(`Using default product key ${defaultKey} for item ${item.name}`);
              productId = productIds[defaultKey];
            }
          }
          
          // If still no product_id, try to find any blueberry product
          if (!productId) {
            const fallbackKey = 'BLU_250'; // Default to 250g
            if (productIds[fallbackKey]) {
              console.log(`Using fallback product key ${fallbackKey} for item ${item.name}`);
              productId = productIds[fallbackKey];
            }
          }
          
          return {
            product_id: productId || undefined,
            product_name: item.name,
            quantity: item.quantity,
            unit_price: item.price,
            total_price: item.price * item.quantity,
          };
        }),
      });

      // Enviar email ao produtor
      if (order.id && order.admin_token) {
        const orderSummary = cartItems.map(item =>
          `${item.quantity} x ${item.name} (${(item.price * item.quantity).toFixed(2)}€)`
        ).join('\n') + `\nTotal: ${(cartTotal + deliveryFee).toFixed(2)}€`;
        try {
          await fetch('/api/send-confirmation-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: order.id,
              adminToken: order.admin_token,
              orderSummary,
            }),
          });
        } catch (err) {
          console.error('Erro ao enviar email ao produtor:', err);
        }
        // Enviar email ao cliente
        try {
          await fetch('/api/send-client-confirmation-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: shipping.email,
              orderSummary,
              orderId: order.id,
            }),
          });
        } catch (err) {
          console.error('Erro ao enviar email ao cliente:', err);
        }
      }

      // Create delivery if needed
      if (deliveryInfo && deliveryInfo.date) {
        console.log('Creating delivery for order:', order.id);
        await createDelivery({
          client_id: clientId,
          order_id: order.id,
          address_id: addressId,
          delivery_type: deliveryInfo.type,
          pickup_station: deliveryInfo.type === 'pickup' ? deliveryInfo.location : undefined,
          delivery_date: deliveryInfo.date,
          delivery_slot: (deliveryInfo.slot || 1) as 1 | 2 | 3 | 4,
          deviation: 1, // Default deviation
          delivery_price: deliveryFee,
        });
        console.log('Delivery created successfully');
      }

      // Set payment details
      setPaymentDetails({
        status: 'success',
        amount: (cartTotal + deliveryFee).toFixed(2),
        customer_email: shipping.email,
        order_id: order.id,
        items: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: (item.price * item.quantity).toFixed(2),
        })),
      });

      // Clear cart and shipping info
      clearCart();
      localStorage.removeItem("shipping");

    } catch (error) {
      console.error('Error creating cash order:', error);
      setError('Erro ao criar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

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
          <p className="text-gray-600">
            {paymentMethod === 'cash' ? 'Processando pedido...' : 'Verificando pagamento...'}
          </p>
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
            Pedido processado!
          </h1>
          <p className="text-gray-600 text-lg">
            O seu pedido foi processado com sucesso, verifique os detalhes da encomenda e o email de confirmação
          </p>
        </div>

        <div className="space-y-6">
          {/* Combined Order Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Detalhes do Pedido
            </h2>

            {/* Order Items */}
            <div className="mb-4">

              {paymentDetails?.items && paymentDetails.items.length > 0 ? (
                <div className="space-y-2">
                  {paymentDetails.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span>{item.name}</span>
                      <span className="text-gray-600">
                        {item.quantity} × {item.price}€
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <span>{item.name}</span>
                      <span className="text-gray-600">
                        {item.quantity} × {item.price.toFixed(2)}€
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Total */}
              <div className="border-t border-gray-100 pt-2 mt-4 space-y-2">
                {deliveryFee > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span>Taxa de entrega:</span>
                    <span>{deliveryFee.toFixed(2)}€</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-lg font-bold mb-2 pb-5 border-b ">
                  <span>Total:</span>
                  <span>
                    {paymentDetails?.amount || (cartTotal + deliveryFee).toFixed(2)}€
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-2 pb-2 border-b border-gray-100">
              <p className="font-bold text-lg mb-2 text-gray-600 uppercase tracking-wide">
                Pagamento
              </p>
              <div className="flex items-center gap-2 text-sm">
                {paymentMethod === 'stripe' ? <CreditCard className="h-4 w-4" /> : <Banknote className="h-4 w-4" />}
                <span>
                  {paymentMethod === 'stripe' ? 'Cartão de Crédito/Débito' : 'Contra-reembolso'}
                </span>
              </div>
            </div>

            {/* Delivery Information */}
            {deliveryInfo && (
              <div className="mb-2 pb-2">
                <p className="font-bold text-lg mb-2 text-gray-600 uppercase tracking-wide">
                  Entrega
                </p>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    <span>{deliveryInfo.type === 'pickup' ? 'Levantar em mão' : 'Entrega ao domicílio'}</span>
                  </div>
                  <div className="ml-5">
                    <span>{deliveryInfo.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(deliveryInfo.date)}</span>
                  </div>
                  {deliveryInfo.slot && (
                    <div className="ml-5 text-gray-600">
                      {formatSlot(deliveryInfo.slot)}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Session ID for Stripe payments */}
          {sessionId && paymentMethod === 'stripe' && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                <strong>ID da Sessão:</strong> {sessionId}
              </p>
            </div>
          )}

          {/* Order ID for cash payments */}
          {paymentDetails?.order_id && paymentMethod === 'cash' && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                <strong>ID do Pedido:</strong> {paymentDetails.order_id}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 space-y-4">
          <Link href="/">
            <Button className="w-full text-white bg-black hover:bg-gray-900 flex items-center justify-center gap-2">
              Voltar
            </Button>
          </Link>

        </div>
      </div>
    </Modal>
  );
} 