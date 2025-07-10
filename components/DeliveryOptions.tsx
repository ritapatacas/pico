"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar, Clock, MapPin, Truck, AlertCircle } from "lucide-react";
import { useLanguageSettings } from "@/hooks/use-settings-store";

interface DeliverySlot {
  slot: number;
  label: string;
  available: boolean;
  maxCapacity: number;
  currentBookings: number;
}

interface DeliveryAvailability {
  date: string;
  slots: DeliverySlot[];
}

interface DeliveryOptionsData {
  pickup_options: {
    stations: Array<{
      name: string;
      address: string;
      available_slots: DeliverySlot[];
    }>;
  };
  delivery_options: {
    address: string;
    coordinates: { lat: number; lon: number };
    nearest_station: string;
    distance_km: number;
    deviation: number;
    base_price: number;
    available_dates: DeliveryAvailability[];
  } | null;
  error?: string;
}

interface SelectedDelivery {
  type: 'pickup' | 'delivery';
  station?: string;
  date: string;
  slot: number;
  price: number;
}

interface DeliveryOptionsProps {
  address: string;
  onDeliverySelected: (delivery: SelectedDelivery) => void;
  onAddressChange?: (address: string) => void;
}

export default function DeliveryOptions({ 
  address, 
  onDeliverySelected, 
  onAddressChange 
}: DeliveryOptionsProps) {
  const { t } = useLanguageSettings();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DeliveryOptionsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'pickup' | 'delivery'>('delivery');
  const [selectedStation, setSelectedStation] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<number>(0);
  const [currentAddress, setCurrentAddress] = useState(address);

  // Fetch delivery options
  const fetchDeliveryOptions = async (addressToSearch: string) => {
    if (!addressToSearch.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/delivery/options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: addressToSearch })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Erro ao buscar opções de entrega');
      }

      setData(result);
      
      // Auto-select first available option
      if (result.delivery_options) {
        setSelectedType('delivery');
        if (result.delivery_options.available_dates.length > 0) {
          setSelectedDate(result.delivery_options.available_dates[0].date);
          const firstAvailableSlot = result.delivery_options.available_dates[0].slots.find((s: DeliverySlot) => s.available);
          if (firstAvailableSlot) {
            setSelectedSlot(firstAvailableSlot.slot);
          }
        }
      } else if (result.pickup_options.stations.length > 0) {
        setSelectedType('pickup');
        setSelectedStation(result.pickup_options.stations[0].name);
      }
      
      if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  // Handle address search
  const handleAddressSearch = () => {
    fetchDeliveryOptions(currentAddress);
    onAddressChange?.(currentAddress);
  };

  // Calculate selected delivery details
  const getSelectedDeliveryDetails = (): SelectedDelivery | null => {
    if (!data) return null;

    if (selectedType === 'pickup') {
      return {
        type: 'pickup',
        station: selectedStation,
        date: selectedDate,
        slot: selectedSlot,
        price: 0
      };
    } else if (data.delivery_options && selectedDate && selectedSlot) {
      return {
        type: 'delivery',
        date: selectedDate,
        slot: selectedSlot,
        price: data.delivery_options.base_price
      };
    }

    return null;
  };

  // Handle confirm selection
  const handleConfirmSelection = () => {
    const selection = getSelectedDeliveryDetails();
    if (selection) {
      onDeliverySelected(selection);
    }
  };

  // Format slot label
  const getSlotLabel = (slot: number): string => {
    const labels = {
      1: '14:00 - 15:30',
      2: '15:30 - 17:00',
      3: '17:00 - 18:30',
      4: '18:30 - 20:00'
    };
    return labels[slot as keyof typeof labels] || `Slot ${slot}`;
  };

  // Format date for display
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-PT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="space-y-6">
      {/* Address Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Morada de Entrega
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={currentAddress}
              onChange={(e) => setCurrentAddress(e.target.value)}
              placeholder="Introduza a sua morada completa..."
              className="flex-1 border rounded px-3 py-2"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddressSearch();
                }
              }}
            />
            <Button onClick={handleAddressSearch} disabled={loading}>
              {loading ? 'A procurar...' : 'Procurar'}
            </Button>
          </div>
          
          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delivery Options */}
      {data && (
        <Card>
          <CardHeader>
            <CardTitle>Opções de Entrega</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Delivery Type Selection */}
            <RadioGroup 
              value={selectedType} 
              onValueChange={(value) => setSelectedType(value as 'pickup' | 'delivery')}
            >
              {/* Pickup Option */}
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pickup" id="pickup" />
                <label htmlFor="pickup" className="flex items-center gap-2 cursor-pointer">
                  <MapPin className="h-4 w-4" />
                  <span>Levantamento numa estação</span>
                  <Badge variant="secondary">Gratuito</Badge>
                </label>
              </div>

              {/* Delivery Option */}
              {data.delivery_options && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="delivery" id="delivery" />
                  <label htmlFor="delivery" className="flex items-center gap-2 cursor-pointer">
                    <Truck className="h-4 w-4" />
                    <span>Entrega ao domicílio</span>
                    <Badge variant={data.delivery_options.base_price === 0 ? "secondary" : "default"}>
                      {data.delivery_options.base_price === 0 
                        ? 'Gratuito' 
                        : `${data.delivery_options.base_price.toFixed(2)}€`
                      }
                    </Badge>
                    <span className="text-sm text-gray-500">
                      ({data.delivery_options.distance_km}km)
                    </span>
                  </label>
                </div>
              )}
            </RadioGroup>

            {/* Pickup Stations */}
            {selectedType === 'pickup' && (
              <div className="space-y-4">
                <h3 className="font-semibold">Escolha uma estação:</h3>
                <RadioGroup value={selectedStation} onValueChange={setSelectedStation}>
                  {data.pickup_options.stations.map((station) => (
                    <div key={station.name} className="flex items-center space-x-2">
                      <RadioGroupItem value={station.name} id={`station-${station.name}`} />
                      <label htmlFor={`station-${station.name}`} className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <span>{station.address}</span>
                          <Badge variant="outline">
                            {station.available_slots.filter(s => s.available).length} slots
                          </Badge>
                        </div>
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Date Selection */}
            {((selectedType === 'delivery' && data.delivery_options) || 
              (selectedType === 'pickup' && selectedStation)) && (
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Escolha o dia:
                </h3>
                
                {selectedType === 'delivery' && data.delivery_options && (
                  <RadioGroup value={selectedDate} onValueChange={setSelectedDate}>
                    {data.delivery_options.available_dates.map((dateOption) => (
                      <div key={dateOption.date} className="flex items-center space-x-2">
                        <RadioGroupItem value={dateOption.date} id={`date-${dateOption.date}`} />
                        <label htmlFor={`date-${dateOption.date}`} className="flex-1 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <span>{formatDate(dateOption.date)}</span>
                            <Badge variant="outline">
                              {dateOption.slots.filter(s => s.available).length} slots
                            </Badge>
                          </div>
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </div>
            )}

            {/* Time Slot Selection */}
            {selectedDate && (
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Escolha o horário:
                </h3>
                
                {(() => {
                  let availableSlots: DeliverySlot[] = [];
                  
                  if (selectedType === 'delivery' && data.delivery_options) {
                    const dateOption = data.delivery_options.available_dates.find(d => d.date === selectedDate);
                    availableSlots = dateOption?.slots || [];
                  } else if (selectedType === 'pickup' && selectedStation) {
                    const station = data.pickup_options.stations.find(s => s.name === selectedStation);
                    availableSlots = station?.available_slots || [];
                  }

                  return (
                    <RadioGroup value={selectedSlot.toString()} onValueChange={(value) => setSelectedSlot(Number(value))}>
                      {availableSlots.map((slot) => (
                        <div key={slot.slot} className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value={slot.slot.toString()} 
                            id={`slot-${slot.slot}`}
                            disabled={!slot.available}
                          />
                          <label 
                            htmlFor={`slot-${slot.slot}`} 
                            className={`flex-1 cursor-pointer ${!slot.available ? 'opacity-50' : ''}`}
                          >
                            <div className="flex justify-between items-center">
                              <span>{getSlotLabel(slot.slot)}</span>
                              <div className="flex items-center gap-2">
                                <Badge variant={slot.available ? "outline" : "secondary"}>
                                  {slot.currentBookings}/{slot.maxCapacity}
                                </Badge>
                                {!slot.available && (
                                  <Badge variant="destructive">Esgotado</Badge>
                                )}
                              </div>
                            </div>
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  );
                })()}
              </div>
            )}

            {/* Confirm Button */}
            {getSelectedDeliveryDetails() && (
              <div className="pt-4 border-t">
                <Button 
                  onClick={handleConfirmSelection}
                  className="w-full"
                  size="lg"
                >
                  Confirmar {selectedType === 'pickup' ? 'Levantamento' : 'Entrega'}
                  {selectedType === 'delivery' && data.delivery_options && 
                    ` (${data.delivery_options.base_price.toFixed(2)}€)`
                  }
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}