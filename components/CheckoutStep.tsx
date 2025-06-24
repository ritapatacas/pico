"use client";
import { useState } from "react";
import { Button } from "./ui/button";

export default function CheckoutStep({ onNext, onBack }: { onNext: () => void, onBack: () => void }) {
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
    localStorage.setItem("shipping", JSON.stringify(form));
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow mt-4">
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
      <div className="flex gap-2 mt-4">
        <Button type="button" variant="outline" className="flex-1" onClick={onBack}>Voltar</Button>
        <Button type="submit" className="flex-1 bg-black text-white hover:bg-gray-800">Ir para Pagamento</Button>
      </div>
    </form>
  );
} 