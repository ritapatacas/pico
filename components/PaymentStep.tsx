"use client";
import { useEffect, useState, useRef } from "react";
import { useCart } from "@/contexts/cart-context";
import { Button } from "./ui/button";
import Script from "next/script";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function PayPalButton({ amount }: { amount: number }) {
  const paypalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).paypal && paypalRef.current) {
      (window as any).paypal.Buttons({
        createOrder: (data: any, actions: any) => actions.order.create({
          purchase_units: [{ amount: { value: amount.toFixed(2) } }],
        }),
        onApprove: (data: any, actions: any) => actions.order.capture().then((details: any) => {
          alert("Pagamento concluído por " + details.payer.name.given_name);
        }),
      }).render(paypalRef.current);
    }
  }, [amount]);

  return <div ref={paypalRef}></div>;
}

export default function PaymentStep({ onBack }: { onBack: () => void }) {
  const [shipping, setShipping] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { cartItems, cartTotal } = useCart();

  useEffect(() => {
    setShipping(JSON.parse(localStorage.getItem("shipping") || "{}"));
  }, []);

  const handleStripePayment = async () => {
    if (cartItems.length === 0) {
      setError("O carrinho está vazio");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const items = cartItems.map((item: any) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      if (!res.ok) {
        throw new Error("Erro ao processar pagamento");
      }

      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const stripe = await stripePromise;
      
      if (data.url) {
        window.location.href = data.url;
      } else if (stripe && data.id) {
        const { error } = await stripe.redirectToCheckout({ sessionId: data.id });
        if (error) {
          throw new Error(error.message);
        }
      } else {
        throw new Error("Resposta inválida do servidor");
      }
    } catch (err) {
      console.error("Erro no pagamento:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!shipping) return <div className="flex items-center justify-center h-32">Carregando...</div>;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto -mr-4 pr-4">
        <h2 className="font-semibold mb-2">Endereço de Entrega</h2>
        <div className="bg-gray-50 p-3 rounded mb-4">
          <div className="font-medium">{shipping.name}</div>
          <div>{shipping.address}</div>
          <div>{shipping.city}, {shipping.postal}, {shipping.country}</div>
          <div className="text-gray-600">{shipping.email}</div>
        </div>
        
        <div className="my-6 bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Resumo do Pedido</h2>
          {cartItems.map(item => (
            <div key={item.id} className="flex justify-between mb-2">
              <span>{item.name} x{item.quantity}</span>
              <span>{(item.price * item.quantity).toFixed(2).replace('.',',')}€</span>
            </div>
          ))}
          <div className="border-t pt-2 mt-2">
            <div className="font-bold text-lg">Total: {cartTotal.toFixed(2)} €</div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
      </div>
      
      <div className="border-t pt-4 flex gap-2 mt-4">
        <Button 
          type="button" 
          variant="outline" 
          className="flex-1" 
          onClick={onBack}
          disabled={isProcessing}
        >
          Voltar
        </Button>
        
        {/* Stripe Button */}
        <Button
          className="flex-1 bg-blue-600 text-white hover:bg-blue-700 py-2 text-sm font-medium disabled:opacity-50"
          onClick={handleStripePayment}
          disabled={isProcessing || cartItems.length === 0}
        >
          {isProcessing ? "Processando..." : "Pagar com Cartão / MB WAY"}
        </Button>
        
        {/* PayPal Button */}
        <div className="flex-1">
          <Script 
            src="https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&currency=EUR" 
            strategy="afterInteractive" 
          />
          <PayPalButton amount={cartTotal} />
        </div>
      </div>
    </div>
  );
} 