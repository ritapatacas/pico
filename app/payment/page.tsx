"use client";
import { useEffect, useState, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import Script from "next/script";
import { useCart } from "@/contexts/cart-context";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useLanguageSettings } from "@/hooks/use-settings-store";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function PayPalButton({ amount }: { amount: number }) {
  const paypalRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguageSettings();

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).paypal && paypalRef.current) {
      (window as any).paypal.Buttons({
        createOrder: (data: any, actions: any) => actions.order.create({
          purchase_units: [{ amount: { value: amount.toFixed(2) } }],
        }),
        onApprove: (data: any, actions: any) => actions.order.capture().then((details: any) => {
          alert(t("payment.completedBy") + " " + details.payer.name.given_name);
        }),
      }).render(paypalRef.current);
    }
  }, [amount, t]);

  return <div ref={paypalRef}></div>;
}

export default function PaymentPage() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { t } = useLanguageSettings();
  const [shipping, setShipping] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const shippingData = localStorage.getItem("shipping");
      if (shippingData) {
        setShipping(JSON.parse(shippingData));
      }
    } catch (error) {
      console.error("Error loading shipping data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>{t("payment.loading")}</p>
        </div>
      </div>
    );
  }

  // Redirect if cart is empty or no shipping info
  if (cartItems.length === 0) {
    router.push('#products');
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <div className="text-center">
          <p>{t("payment.redirectingToProducts")}</p>
        </div>
      </div>
    );
  }

  if (!shipping || !shipping.name) {
    router.push('/checkout');
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <div className="text-center">
          <p>{t("payment.redirectingToCheckout")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">{t("payment.title")}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Methods */}
        <div>
          <h2 className="text-xl font-semibold mb-4">{t("payment.paymentMethod")}</h2>
          <div className="space-y-4">
            {/* Stripe Button */}
            <Card>
              <CardContent className="p-6">
                {paymentError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                    {paymentError}
                  </div>
                )}
                <button
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 py-3 text-sm font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={paymentLoading}
                  onClick={async () => {
                    setPaymentLoading(true);
                    setPaymentError(null);
                    
                    try {
                      const items = cartItems.map(item => ({
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image,
                      }));
                      
                      // Use absolute URL to ensure correct port
                      const apiUrl = `${window.location.origin}/api/checkout_sessions`;
                      console.log('Calling API at:', apiUrl);
                      
                      const res = await fetch(apiUrl, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ items }),
                      });
                      
                      console.log('Response status:', res.status);
                      const data = await res.json();
                      console.log('Response data:', data);
                      
                      if (!res.ok) {
                        throw new Error(data.error || t("payment.paymentError"));
                      }
                      
                      const stripe = await stripePromise;
                      
                      if (data.url) {
                        window.location.href = data.url;
                      } else if (stripe && data.id) {
                        stripe.redirectToCheckout({ sessionId: data.id });
                      } else {
                        throw new Error(t("payment.invalidServerResponse"));
                      }
                    } catch (error) {
                      console.error('Payment error:', error);
                      setPaymentError(error instanceof Error ? error.message : t("payment.unknownError"));
                    } finally {
                      setPaymentLoading(false);
                    }
                  }}
                >
                  {paymentLoading ? t("payment.processing") : t("payment.payWithCard")}
                </button>
              </CardContent>
            </Card>

            {/* PayPal Button */}
            <Card>
              <CardContent className="p-6">
                <Script src="https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&currency=EUR" strategy="afterInteractive" />
                <PayPalButton amount={cartTotal} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <h2 className="text-xl font-semibold mb-4">{t("payment.orderSummary")}</h2>
          
          {/* Shipping Info */}
          <Card className="mb-4">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">{t("payment.shippingAddress")}</h3>
              <div className="text-sm space-y-1">
                <div>{shipping.name}</div>
                <div>{shipping.address}</div>
                <div>{shipping.city}, {shipping.postal}, {shipping.country}</div>
                <div>{shipping.email}</div>
              </div>
            </CardContent>
          </Card>

          {/* Cart Items */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">{t("payment.orderItems")}</h3>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.price.toFixed(2).replace(".", ",")}€ × {item.quantity}
                      </p>
                    </div>
                    <span className="font-medium">
                      {(item.price * item.quantity).toFixed(2).replace(".", ",")}€
                    </span>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>{t("payment.total")}:</span>
                    <span>{cartTotal.toFixed(2).replace(".", ",")}€</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 