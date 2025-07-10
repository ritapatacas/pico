"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguageSettings } from "@/hooks/use-settings-store";
import DeliveryCalendar from "@/components/DeliveryCalendar";
import SuccessModal from "@/components/SuccessModal";
import TestModal from "@/components/TestModal";

const PICKUP_STATIONS = [
  { value: "Lisboa", label: "Lisboa" },
  { value: "Amadora", label: "Amadora" },
  { value: "Pedrógão Grande", label: "Pedrógão Grande" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { t, language } = useLanguageSettings();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    deliveryType: "pickup", // 'pickup' ou 'delivery'
    pickupStation: "Lisboa",
    address: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<1 | 2 | 3 | 4 | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [successModalData, setSuccessModalData] = useState<{
    sessionId?: string;
    paymentMethod: 'stripe' | 'cash';
    deliveryInfo?: {
      type: 'pickup' | 'delivery';
      location: string;
      date: string;
      slot?: number;
    };
  } | null>(null);

  // Mock de opções de entrega (substituir por fetch real se necessário)
  const deliveryOptions = [
    { date: "2025-07-12", slot: 1 as 1, price: 0, available: true },
    { date: "2025-07-13", slot: 2 as 2, price: 1.5, available: true },
    { date: "2025-07-14", slot: 3 as 3, price: 2.5, available: false },
    { date: "2025-07-15", slot: 4 as 4, price: 3.0, available: true }
  ];

  // Opções para o calendário, ajustando preço para pickup
  const calendarOptions = form.deliveryType === "pickup"
    ? deliveryOptions.map(opt => ({ ...opt, price: 0 }))
    : deliveryOptions;

  useEffect(() => {
    if (cartItems.length === 0 && !showSuccessModal && !showTestModal) {
      setShouldRedirect(true);
    }
  }, [cartItems.length, showSuccessModal, showTestModal]);

  useEffect(() => {
    if (shouldRedirect) {
      router.push('#products');
    }
  }, [shouldRedirect, router]);

  // Helper function to get delivery info from form
  const getDeliveryInfo = () => {
    if (!selectedDate) return undefined;
    
    return {
      type: form.deliveryType as 'pickup' | 'delivery',
      location: form.deliveryType === 'pickup' ? form.pickupStation : form.address,
      date: selectedDate,
      slot: selectedSlot || undefined
    };
  };

  // Check for success parameters from payment redirect
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const success = searchParams.get('success');
    
    console.log('Checkout useEffect - sessionId:', sessionId, 'success:', success);
    console.log('Current form state:', form);
    console.log('Selected date/slot:', selectedDate, selectedSlot);
    
    if (success === 'true' && sessionId) {
      console.log('Showing success modal for Stripe payment');
      const deliveryInfo = getDeliveryInfo();
      console.log('Delivery info:', deliveryInfo);
      
      // Show success modal for Stripe payment
      setSuccessModalData({
        sessionId,
        paymentMethod: 'stripe',
        deliveryInfo: deliveryInfo
      });
      setShowSuccessModal(true);
    }
  }, [searchParams, form.deliveryType, form.pickupStation, form.address, selectedDate, selectedSlot]);

  if (shouldRedirect) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>{t("checkout.redirectingToProducts")}</p>
        </div>
      </div>
    );
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleDeliveryTypeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setForm((prev) => ({
      ...prev,
      deliveryType: value,
      // Reset dependent fields
      pickupStation: value === "pickup" ? "Lisboa" : "",
      address: value === "delivery" ? "" : "",
    }));
  }

  function handlePickupStationChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, pickupStation: e.target.value }));
  }

  async function handleAddressChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, address: value }));
    // Só tentar geocodificar se houver valor suficiente
    if (form.deliveryType === "delivery" && value.length > 5) {
      try {
        const res = await fetch(`/api/delivery/options?lat=0&lon=0&address=${encodeURIComponent(value)}`);
        // Aqui normalmente farias a geocodificação real, mas para já simula:
        // Exemplo: const { lat, lon } = await geocodeAddress(value);
        // console.log('Coordenadas encontradas:', lat, lon);
        // Para já, só loga o valor da morada
        console.log('Morada introduzida:', value);
      } catch (err) {
        // Ignorar erros nesta simulação
      }
    }
  }

  function handlePayNow() {
    // Guardar dados e redirecionar para pagamento
    localStorage.setItem("shipping", JSON.stringify(form));
    router.push("/payment?discount=10");
  }

  function handleCashOnDelivery() {
    // Mostrar modal de sucesso para contra-reembolso
    localStorage.setItem("shipping", JSON.stringify(form));
    setSuccessModalData({
      paymentMethod: 'cash',
      deliveryInfo: getDeliveryInfo()
    });
    setShowSuccessModal(true);
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">{t("checkout.title")}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping Form */}
        <div>
          <form className="space-y-4 bg-white p-6 rounded shadow" onSubmit={e => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <input name="name" value={form.name} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Telemóvel</label>
              <input name="phone" type="tel" value={form.phone} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Entrega</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="deliveryType"
                    value="pickup"
                    checked={form.deliveryType === "pickup"}
                    onChange={handleDeliveryTypeChange}
                  />
                  Levantar em mão
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="deliveryType"
                    value="delivery"
                    checked={form.deliveryType === "delivery"}
                    onChange={handleDeliveryTypeChange}
                  />
                  Agendar entrega
                </label>
              </div>
            </div>
            {form.deliveryType === "pickup" && (
              <div>
                <label className="block text-sm font-medium mb-1">Escolha a estação</label>
                <div className="flex gap-4 mt-2">
                  {PICKUP_STATIONS.map((station) => (
                    <label key={station.value} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="pickupStation"
                        value={station.value}
                        checked={form.pickupStation === station.value}
                        onChange={handlePickupStationChange}
                        required
                      />
                      {station.label}
                    </label>
                  ))}
                </div>
              </div>
            )}
            {form.deliveryType === "delivery" && (
              <div>
                <label className="block text-sm font-medium mb-1">Morada</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleAddressChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            )}
            {/* Mostrar calendário de agendamento se já houver estação ou morada preenchida */}
            {((form.deliveryType === "pickup" && form.pickupStation) || (form.deliveryType === "delivery" && form.address)) && (
              <div className="mt-6">
                <DeliveryCalendar
                  options={calendarOptions}
                  onSelect={(date, slot) => {
                    setSelectedDate(date);
                    setSelectedSlot(slot);
                  }}
                />
                {selectedDate && selectedSlot && (
                  <div className="mt-4 p-3 border rounded bg-green-50">
                    <p><strong>Entrega agendada:</strong> {selectedDate} – Slot {selectedSlot}</p>
                  </div>
                )}
              </div>
            )}
            <div className="flex gap-2 mt-6">
              <Button type="button" onClick={handlePayNow} className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700">
                Pagar agora (10% desconto)
              </Button>
              <Button type="button" onClick={handleCashOnDelivery} className="w-full bg-gray-800 text-white py-3 rounded hover:bg-black">
                Contra-reembolso
              </Button>
            </div>
            <div className="mt-4 space-y-2">
              <Button 
                type="button" 
                onClick={() => {
                  console.log('Test button clicked');
                  setSuccessModalData({
                    paymentMethod: 'cash',
                    deliveryInfo: {
                      type: 'pickup',
                      location: 'Test Location',
                      date: '2025-07-15',
                      slot: 2
                    }
                  });
                  setShowSuccessModal(true);
                }} 
                className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 text-sm"
              >
                🧪 TESTE SUCCESS MODAL
              </Button>
              <Button 
                type="button" 
                onClick={() => {
                  console.log('🔵 BLUE BUTTON CLICKED!');
                  setShowTestModal(true);
                  console.log('🔵 showTestModal set to true');
                }} 
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm"
              >
                🧪 TESTE MODAL SIMPLES
              </Button>
            </div>
          </form>
        </div>
        {/* Order Summary */}
        <div>
          <h2 className="text-xl font-semibold mb-4">{t("checkout.orderSummary")}</h2>
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
                    <span>{t("checkout.total")}:</span>
                    <span>{cartTotal.toFixed(2).replace(".", ",")}€</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Success Modal */}
      {(() => {
        console.log('Rendering SuccessModal - successModalData:', successModalData, 'showSuccessModal:', showSuccessModal);
        return null;
      })()}
      {successModalData && (
        <SuccessModal
          open={showSuccessModal}
          onClose={() => {
            console.log('Closing success modal');
            setShowSuccessModal(false);
            setSuccessModalData(null);
          }}
          sessionId={successModalData.sessionId}
          paymentMethod={successModalData.paymentMethod}
          deliveryInfo={successModalData.deliveryInfo}
        />
      )}
      
      {/* Test Modal */}
      {(() => {
        console.log('Rendering TestModal - showTestModal:', showTestModal);
        return null;
      })()}
      <TestModal
        open={showTestModal}
        onClose={() => {
          console.log('Closing test modal');
          setShowTestModal(false);
        }}
      />
    </div>
  );
} 