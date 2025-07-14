"use client";

import { useState } from "react";
import { geocodeAddress } from "@/lib/geocode";
import { supabase } from "@/lib/supabaseClient";
import DeliveryCalendar from "@/components/DeliveryCalendar";
import { findNearestStationAndDeviation } from "@/lib/delivery/calculations";

type DeliveryOption = {
  date: string;
  slot: 1 | 2 | 3 | 4;
  price: number;
  available: boolean;
};

export default function AddressForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lon: number; displayName: string } | null>(null);
  const [slots, setSlots] = useState<DeliveryOption[] | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<1 | 2 | 3 | 4 | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const coords = await geocodeAddress(address);
      setCoords(coords);

      // Mock delivery options - in real app, this would come from API
      const mockSlots: DeliveryOption[] = [
        { date: "2024-01-15", slot: 1, price: 5.00, available: true },
        { date: "2024-01-15", slot: 2, price: 5.00, available: true },
        { date: "2024-01-15", slot: 3, price: 5.00, available: true },
        { date: "2024-01-15", slot: 4, price: 5.00, available: true },
        { date: "2024-01-16", slot: 1, price: 5.00, available: true },
        { date: "2024-01-16", slot: 2, price: 5.00, available: true },
        { date: "2024-01-16", slot: 3, price: 5.00, available: true },
        { date: "2024-01-16", slot: 4, price: 5.00, available: true },
      ];
      setSlots(mockSlots);
    } catch (err: any) {
      setError(err.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  async function submitDelivery() {
    if (!selectedDate || !selectedSlot || !coords || !name || !email) return;

    console.log('Submitting delivery with:', {
      name,
      email,
      address,
      selectedDate,
      selectedSlot,
      coords
    });

    try {
      // Calculate deviation based on distance
      const deviation = calculateDeviation(coords.lat, coords.lon);
      
      // Find or create client
      let clientId: string;
      const { data: existingClient, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('email', email)
        .single();

      if (clientError && clientError.code !== 'PGRST116') {
        console.error('Error finding client:', clientError);
        throw new Error('Error finding client');
      }

      if (existingClient) {
        clientId = existingClient.id;
      } else {
        // Create new client
        const { data: newClient, error: createError } = await supabase
          .from('clients')
          .insert([{
            name,
            email,
            is_guest: true,
          }])
          .select('id')
          .single();

        if (createError) {
          console.error('Error creating client:', createError);
          throw new Error('Error creating client');
        }
        clientId = newClient.id;
      }

      // Create address
      const { data: addressData, error: addressError } = await supabase
        .from('addresses')
        .insert([{
          client_id: clientId,
          address,
          latitude: coords.lat,
          longitude: coords.lon,
          is_primary: true, // First address is primary
        }])
        .select('id')
        .single();

      if (addressError) {
        console.error('Error creating address:', addressError);
        throw new Error('Error creating address');
      }

      // Create delivery
      const { data: deliveryData, error: deliveryError } = await supabase
        .from('deliveries')
        .insert([{
          client_id: clientId,
          address_id: addressData.id,
          delivery_type: 'delivery',
          delivery_date: selectedDate,
          delivery_slot: selectedSlot,
          deviation: deviation,
          delivery_price: 5.00, // Fixed price for now
          status: 'pending'
        }])
        .select();

      if (deliveryError) {
        console.error('Supabase error:', deliveryError);
        throw deliveryError;
      }

      // Show success
      alert("✅ Encomenda registada com sucesso!");
      // Clear form
      setSelectedDate(null);
      setSelectedSlot(null);
      setName("");
      setEmail("");
      setAddress("");
      setCoords(null);
      setSlots(null);

    } catch (err: any) {
      alert("❌ Erro ao salvar: " + err.message);
    }
  }

  // Helper function to calculate deviation (1-5) based on distance
  function calculateDeviation(lat: number, lon: number): number {
    const { deviation } = findNearestStationAndDeviation({ lat, lon });
    return deviation;
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-gray-700 font-medium">Nome:</span>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label className="block">
          <span className="text-gray-700 font-medium">Email:</span>
          <input
            type="email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="block">
          <span className="text-gray-700 font-medium">Morada:</span>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>
        
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading || !address || !name || !email}
        >
          {loading ? "A procurar..." : "Obter Opções de Entrega"}
        </button>
      </form>

      {error && <p className="text-red-600 mt-4">⚠️ {error}</p>}

      {coords && (
        <div className="mt-6 p-4 border rounded bg-gray-100 space-y-2">
          <p><strong>📍 Morada encontrada:</strong> {coords.displayName}</p>
          <p><strong>Latitude:</strong> {coords.lat}</p>
          <p><strong>Longitude:</strong> {coords.lon}</p>
        </div>
      )}

      {slots && (
        <div className="mt-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">📅 Opções de Entrega:</h2>
            <DeliveryCalendar
              options={slots}
              onSelect={(date, slot) => {
                setSelectedDate(date);
                setSelectedSlot(slot);
              }}
            />
          </div>

          {selectedDate && selectedSlot && (
            <div className="p-4 border rounded bg-green-50">
              <p><strong>Entrega selecionada:</strong> {selectedDate} – Slot {selectedSlot}</p>
              <button
                onClick={submitDelivery}
                className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Confirmar Entrega
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}