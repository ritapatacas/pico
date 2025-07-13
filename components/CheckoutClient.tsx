"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguageSettings } from "@/hooks/use-settings-store";
import DeliveryCalendar from "@/components/DeliveryCalendar";
import SuccessModal from "@/components/SuccessModal";
import TestModal from "@/components/TestModal";

const PICKUP_STATIONS = [
  { value: "LIS", label: "Lisboa" },
  { value: "AMA", label: "Amadora" },
  { value: "PG", label: "Pedrógão Grande" },
];

export default function CheckoutClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
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

  // Buscar dados do cliente quando o usuário estiver autenticado
  useEffect(() => {
    const fetchClientData = async () => {
      if (isAuthenticated && user?.email) {
        try {
          const response = await fetch(`/api/client/${encodeURIComponent(user.email)}`);
          if (response.ok) {
            const clientData = await response.json();
            setForm(prev => ({
              ...prev,
              name: clientData.name || "",
              email: clientData.email || "",
              phone: clientData.mobile || "", // Usar o campo mobile da tabela clients
            }));
          }
        } catch (error) {
          console.error('Erro ao buscar dados do cliente:', error);
        }
      }
    };

    if (!authLoading) {
      fetchClientData();
    }
  }, [isAuthenticated, user?.email, authLoading]);

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

  // Mostrar loading enquanto verifica autenticação
  if (authLoading) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Verificando autenticação...</p>
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

  function handlePickupStationChange(value: string) {
    setForm((prev) => ({ ...prev, pickupStation: value }));
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

  async function saveClientData() {
    if (isAuthenticated && user?.email) {
      try {
        await fetch(`/api/client/${encodeURIComponent(user.email)}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: form.name,
            mobile: form.phone,
            address: form.address,
          }),
        });
      } catch (error) {
        console.error('Erro ao salvar dados do cliente:', error);
      }
    }
  }

  async function handlePayNow() {
    // Salvar dados do cliente se estiver logado
    await saveClientData();

    // Guardar dados e redirecionar para pagamento
    localStorage.setItem("shipping", JSON.stringify(form));
    router.push("/payment?discount=10");
  }

  async function handleCashOnDelivery() {
    // Salvar dados do cliente se estiver logado
    await saveClientData();

    // Mostrar modal de sucesso para contra-reembolso
    localStorage.setItem("shipping", JSON.stringify(form));
    setSuccessModalData({
      paymentMethod: 'cash',
      deliveryInfo: getDeliveryInfo()
    });
    setShowSuccessModal(true);
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-5">
      <h1 className="text-2xl font-bold px-1 mb-4">{t("checkout.title")}</h1>



      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping Form */}
        <div>
          <form className="space-y-3 bg-white p-6 rounded shadow" onSubmit={e => e.preventDefault()}>
            <div>
              <label className="block text-sm font-semibold font-medium mb-1">Nome</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border rounded px-3"
                placeholder={isAuthenticated ? "Nome do usuário logado" : "Digite seu nome"}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold font-medium mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border rounded px-3"
                placeholder={isAuthenticated ? "" : "Digite seu email"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium font-semibold mb-1">Telemóvel</label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full border rounded px-3"
                placeholder={isAuthenticated ? "" : "Digite seu telemóvel"}
              />
            </div>
            <div>
              <label className="block text-lg font-bold mb-1">Entrega</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="deliveryType"
                    value="pickup"
                    checked={form.deliveryType === "pickup"}
                    onChange={handleDeliveryTypeChange}
                    className="accent-black"
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
                    className="accent-black"
                  />
                  Agendar entrega
                </label>
              </div>
            </div>
            {form.deliveryType === "pickup" && (
              <div>
                <label className="block text-sm font-medium mb-1">Escolha a estação</label>
                <Select value={form.pickupStation} onValueChange={handlePickupStationChange} required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione uma estação" />
                  </SelectTrigger>
                  <SelectContent>
                    {PICKUP_STATIONS.map((station) => (
                      <SelectItem key={station.value} value={station.value}>
                        {station.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {form.deliveryType === "delivery" && (
              <div>
                <label className="block text-sm font-semibold font-medium mb-1">Morada</label>
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
                  <div className="mt-4 p-3 border border-gray-300 rounded bg-gray-50">
                    <p className="text-gray-800"><strong>Entrega agendada:</strong> {selectedDate} – Slot {selectedSlot}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2 mt-6 font-bold">
              <Button type="button" onClick={handlePayNow} className="flex-1 bg-green-600 text-white py-3 rounded hover:bg-green-700">
                Pagar (10% desconto)
              </Button>
              <Button type="button" onClick={handleCashOnDelivery} className="flex-1 bg-gray-800 text-white py-3 rounded hover:bg-black">
                Contra-reembolso
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