"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import DeliveryOptions from "./DeliveryOptions";

interface SelectedDelivery {
  type: 'pickup' | 'delivery';
  station?: string;
  date: string;
  slot: number;
  price: number;
}

export default function CheckoutStep({ onNext, onBack }: { onNext: () => void, onBack: () => void }) {
  const [step, setStep] = useState<'customer-info' | 'delivery'>('customer-info');
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postal: "",
    country: "Portugal",
  });
  const [deliverySelection, setDeliverySelection] = useState<SelectedDelivery | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function getFullAddress(): string {
    return `${form.address}, ${form.city} ${form.postal}, ${form.country}`.trim();
  }

  async function handleCustomerInfoSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Advance to delivery step
    setStep('delivery');
  }

  async function handleFinalSubmit() {
    setSubmitting(true);
    
    // Save client and delivery data
    const checkoutData = {
      customer: form,
      delivery: deliverySelection,
      fullAddress: getFullAddress()
    };
    
    localStorage.setItem("shipping", JSON.stringify(form));
    localStorage.setItem("delivery", JSON.stringify(deliverySelection));
    
    onNext();
  }

  function handleDeliverySelected(delivery: SelectedDelivery) {
    setDeliverySelection(delivery);
  }

  function handleAddressChange(newAddress: string) {
    // Update address field when address is changed in DeliveryOptions
    setForm(prev => ({ ...prev, address: newAddress }));
  }

  if (step === 'customer-info') {
    return (
      <form onSubmit={handleCustomerInfoSubmit} className="flex flex-col h-full">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Informações do Cliente</h2>
          <p className="text-sm text-gray-600">Preencha os seus dados para continuar</p>
        </div>
        
        <div className="flex-grow space-y-4 overflow-y-auto -mr-4 pr-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome Completo</label>
            <input 
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              required 
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black" 
              placeholder="O seu nome completo"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              name="email" 
              type="email" 
              value={form.email} 
              onChange={handleChange} 
              required 
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black" 
              placeholder="seu.email@exemplo.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Morada</label>
            <input 
              name="address" 
              value={form.address} 
              onChange={handleChange} 
              required 
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black" 
              placeholder="Rua, número, andar (se aplicável)"
            />
          </div>
          
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Cidade</label>
              <input 
                name="city" 
                value={form.city} 
                onChange={handleChange} 
                required 
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black" 
                placeholder="Lisboa"
              />
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium mb-1">Código Postal</label>
              <input 
                name="postal" 
                value={form.postal} 
                onChange={handleChange} 
                required 
                pattern="[0-9]{4}-[0-9]{3}"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black" 
                placeholder="1000-001"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">País</label>
            <input 
              name="country" 
              value={form.country} 
              onChange={handleChange} 
              required 
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black" 
            />
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button type="button" variant="outline" className="flex-1" onClick={onBack}>
            Voltar
          </Button>
          <Button type="submit" className="flex-1 bg-black text-white hover:bg-gray-800">
            Continuar para Entrega
          </Button>
        </div>
      </form>
    );
  }

  // Step: delivery
  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Opções de Entrega</h2>
        <p className="text-sm text-gray-600">
          Cliente: <strong>{form.name}</strong> ({form.email})
        </p>
      </div>
      
      <div className="flex-grow overflow-y-auto -mr-4 pr-4">
        <DeliveryOptions
          address={getFullAddress()}
          onDeliverySelected={handleDeliverySelected}
          onAddressChange={handleAddressChange}
        />
      </div>
      
      <div className="flex gap-2 mt-4 pt-4 border-t">
        <Button 
          type="button" 
          variant="outline" 
          className="flex-1" 
          onClick={() => setStep('customer-info')}
        >
          Voltar aos Dados
        </Button>
        
        <Button 
          type="button" 
          className="flex-1 bg-black text-white hover:bg-gray-800" 
          onClick={handleFinalSubmit}
          disabled={!deliverySelection || submitting}
        >
          {submitting ? 'A processar...' : 
           deliverySelection 
             ? `Continuar (${deliverySelection.type === 'pickup' ? 'Levantamento' : `Entrega ${deliverySelection.price.toFixed(2)}€`})`
             : 'Selecione uma opção de entrega'
          }
        </Button>
      </div>
      
      { /* Summary of the selection */ }
      {deliverySelection && (
        <div className="mt-4 p-3 bg-gray-50 rounded border-l-4 border-black">
          <h3 className="font-semibold text-sm">Resumo da Entrega:</h3>
          <div className="text-sm text-gray-600 mt-1">
            <p>
              <strong>Tipo:</strong> {deliverySelection.type === 'pickup' ? 'Levantamento' : 'Entrega ao domicílio'}
            </p>
            {deliverySelection.station && (
              <p><strong>Estação:</strong> {deliverySelection.station}</p>
            )}
            <p><strong>Data:</strong> {new Date(deliverySelection.date).toLocaleDateString('pt-PT')}</p>
            <p><strong>Horário:</strong> Slot {deliverySelection.slot}</p>
            <p><strong>Preço:</strong> {deliverySelection.price === 0 ? 'Gratuito' : `${deliverySelection.price.toFixed(2)}€`}</p>
          </div>
        </div>
      )}
    </div>
  );
}