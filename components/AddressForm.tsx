"use client";

import { useState } from "react";
import { geocodeAddress } from "@/lib/geocode";
import { supabase } from "@/lib/supabaseClient";
import DeliveryCalendar from "@/components/DeliveryCalendar";

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
  const [coords, setCoords] = useState<{ lat: number; lon: number; displayName: string } | null>(null);
  const [slots, setSlots] = useState<DeliveryOption[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<1 | 2 | 3 | 4 | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCoords(null);
    setSlots(null);

    try {
      const result = await geocodeAddress(address);
      setCoords({ ...result, displayName: "" });

      const res = await fetch(`/api/delivery-options?lat=${result.lat}&lon=${result.lon}`);
      if (!res.ok) throw new Error("Erro ao obter opções de entrega");
      const data = await res.json();
      setSlots(data);
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
      // Calculate deviation based on distance (you can adjust this logic)
      const deviation = calculateDeviation(coords.lat, coords.lon);
      
      console.log('About to insert into Supabase:', {
        name: name,
        email: email,
        address: address,
        display_name: coords.displayName,
        latitude: coords.lat,
        longitude: coords.lon,
        delivery_date: selectedDate,
        delivery_slot: selectedSlot,
        deviation: deviation,
        status: 'pending'
      });

      // Save to Supabase
      const { data, error } = await supabase
        .from('deliveries')
        .insert([
          {
            name: name,
            email: email,
            address: address,
            display_name: coords.displayName,
            latitude: coords.lat,
            longitude: coords.lon,
            delivery_date: selectedDate,
            delivery_slot: selectedSlot,
            deviation: deviation,
            status: 'pending'
          }
        ])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // Also call your existing API
      // Comment out this section temporarily to test Supabase only
      /*
      const response = await fetch("/api/schedule-delivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          email: email,
          address,
          lat: coords.lat,
          lon: coords.lon,
          date: selectedDate,
          slot: selectedSlot,
          deviation: deviation,
        }),
      });
    
      const result = await response.json();
      if (result.success) {
        alert("✅ Encomenda registada com sucesso!");
        // Clear form
        setSelectedDate(null);
        setSelectedSlot(null);
        setName("");
        setEmail("");
        setAddress("");
        setCoords(null);
        setSlots(null);
      } else {
        alert("❌ Erro: " + result.error);
      }
      */

      // Just show success for Supabase
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
    // This is a simple example - you can implement your own logic
    // For now, returning a random value between 1-5
    return Math.floor(Math.random() * 5) + 1;
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
