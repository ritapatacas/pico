"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postal: "",
    country: "Portugal",
  });
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // Here you would typically save shipping info to your backend or context
    // and then redirect to payment (Stripe/PayPal)
    // For demo, just redirect to a fake payment page
    router.push("/payment");
  }

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Finalizar Compra</h1>
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
        <button type="submit" disabled={submitting} className="w-full bg-black text-white py-3 rounded mt-4 hover:bg-gray-800">
          {submitting ? "A processar..." : "Ir para Pagamento"}
        </button>
      </form>
      {/* Order summary could go here */}
    </div>
  );
} 