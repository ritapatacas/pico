"use client";
import { useEffect, useState, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import Script from "next/script";

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

export default function PaymentPage() {
  const [shipping, setShipping] = useState<any>(null);
  const [cart, setCart] = useState<any>(null);

  useEffect(() => {
    setShipping(JSON.parse(localStorage.getItem("shipping") || "{}"));
    setCart(JSON.parse(localStorage.getItem("cart") || "{}"));
  }, []);

  if (!shipping || !cart || !cart.name) return <div>Carregando...</div>;

  const total = cart.price * cart.quantity;

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Pagamento</h1>
      <div className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Endereço de Entrega</h2>
        <div>{shipping.name}</div>
        <div>{shipping.address}</div>
        <div>
          {shipping.city}, {shipping.postal}, {shipping.country}
        </div>
        <div>{shipping.email}</div>
      </div>
      <div className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Resumo do Pedido</h2>
        <div>{cart.name}</div>
        <div>Quantidade: {cart.quantity}</div>
        <div className="font-bold mt-2">Total: {total.toFixed(2)} €</div>
      </div>
      <div className="flex gap-2 mt-4">
        {/* Stripe Button */}
        <button
          className="flex-1 bg-blue-600 text-white hover:bg-blue-700 py-2 text-sm font-medium rounded"
          onClick={async () => {
            const items = [
              {
                name: cart.name,
                price: cart.price,
                quantity: cart.quantity,
                image: cart.image,
              },
            ];
            const res = await fetch("/api/checkout_sessions", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ items }),
            });
            const data = await res.json();
            const stripe = await stripePromise;
            if (data.url) {
              window.location.href = data.url;
            } else if (stripe && data.id) {
              stripe.redirectToCheckout({ sessionId: data.id });
            }
          }}
        >
          Pagar com Cartão / MB WAY
        </button>
        {/* PayPal Button */}
        <div className="flex-1">
          <Script src="https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&currency=EUR" strategy="afterInteractive" />
          <PayPalButton amount={total} />
        </div>
      </div>
    </div>
  );
} 