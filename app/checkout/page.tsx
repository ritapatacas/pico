"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postal: "",
    country: "Portugal",
  });
  const [submitting, setSubmitting] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Handle redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      setShouldRedirect(true);
    }
  }, [cartItems.length]);

  useEffect(() => {
    if (shouldRedirect) {
      router.push('/mirtilos');
    }
  }, [shouldRedirect, router]);

  // Show loading while redirecting
  if (shouldRedirect) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Redirecionando para produtos...</p>
        </div>
      </div>
    );
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    
    // Save shipping info to localStorage for payment page
    localStorage.setItem("shipping", JSON.stringify(form));
    
    // Navigate to payment page
    router.push("/payment");
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Finalizar Compra</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping Form */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Informações de Entrega</h2>
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <input name="name" value={form.name} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Morada</label>
              <input name="address" value={form.address} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Cidade</label>
                <input name="city" value={form.city} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
              </div>
              <div className="w-32">
                <label className="block text-sm font-medium mb-1">Código Postal</label>
                <input name="postal" value={form.postal} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">País</label>
              <input name="country" value={form.country} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
            </div>
            <Button type="submit" disabled={submitting} className="w-full bg-black text-white py-3 rounded mt-4 hover:bg-gray-800">
              {submitting ? "A processar..." : "Ir para Pagamento"}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
          <Card>
            <CardContent className="p-6">
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
                    <span>Total:</span>
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