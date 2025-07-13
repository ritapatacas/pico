// lib/delivery/scheduleService.ts

import { calculateDeliveryPrice, findNearestStationAndDeviation } from './calculations';
import type { 
  DeliveryOption, 
  DeliveryAvailability, 
  DeliverySlot, 
  ScheduleOptions,
  DeliveryCoordinates 
} from './types';

/**
 * Calcula as datas disponíveis baseado no tipo de entrega
 */
function getAvailableDates(deliveryType: 'pickup' | 'delivery', station?: string): string[] {
  const today = new Date();
  const dates: string[] = [];
  
  let startDays: number;
  let maxDays = 15; // Até 15 dias depois
  
  // Determinar quantos dias depois começar
  if (deliveryType === 'pickup') {
    if (station === 'PG') {
      startDays = 1; // D+1 para Pedrógão Grande
    } else {
      startDays = 2; // D+2 para Lisboa e Amadora
    }
  } else {
    startDays = 4; // D+4 para delivery
  }
  
  for (let i = startDays; i <= maxDays; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Para delivery, excluir fins de semana
    if (deliveryType === 'delivery') {
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) { // Domingo ou Sábado
        continue;
      }
    }
    
    dates.push(date.toISOString().split('T')[0]); // YYYY-MM-DD
  }
  
  return dates;
}

/**
 * Cria um slot "tarde" para uma data
 */
function createAfternoonSlot(available: boolean = true): DeliverySlot {
  return {
    slot: 1,
    label: 'tarde',
    available,
    maxCapacity: 10, // Capacidade padrão
    currentBookings: 0 // Por agora, assumir disponibilidade total
  };
}

/**
 * Gera opções de agendamento para pickup
 */
export function generatePickupOptions(station: string): DeliveryOption[] {
  const availableDates = getAvailableDates('pickup', station);
  
  return availableDates.map(date => ({
    type: 'pickup' as const,
    station,
    date,
    slot: 1 as const,
    price: 0, // Pickup é sempre gratuito
    description: `Pickup em ${station}`,
    available: true
  }));
}

/**
 * Gera opções de agendamento para delivery
 */
export async function generateDeliveryOptions(
  address: string,
  coordinates: DeliveryCoordinates
): Promise<DeliveryOption[]> {
  const availableDates = getAvailableDates('delivery');
  
  // Calcular preço usando a lógica existente
  const { nearestStation, distanceMeters, deviation } = findNearestStationAndDeviation(coordinates);
  const price = calculateDeliveryPrice(distanceMeters, deviation);
  
  return availableDates.map(date => ({
    type: 'delivery' as const,
    date,
    slot: 1 as const,
    price,
    description: `Entrega em ${address}`,
    available: true
  }));
}

/**
 * Gera disponibilidade detalhada para o calendário
 */
export function generateScheduleAvailability(options: ScheduleOptions): DeliveryAvailability[] {
  const availableDates = getAvailableDates(options.deliveryType, options.station);
  
  return availableDates.map(date => ({
    date,
    slot: createAfternoonSlot(true)
  }));
}

/**
 * Função principal para obter opções de agendamento
 * Compatível com o formato esperado pelo componente DeliveryCalendar
 */
export async function getScheduleOptions(
  deliveryType: 'pickup' | 'delivery',
  station?: string,
  address?: string,
  coordinates?: DeliveryCoordinates
): Promise<DeliveryOption[]> {
  if (deliveryType === 'pickup' && station) {
    return generatePickupOptions(station);
  }
  
  if (deliveryType === 'delivery' && address && coordinates) {
    return await generateDeliveryOptions(address, coordinates);
  }
  
  return [];
}

/**
 * Valida se uma data é válida para agendamento
 */
export function isValidScheduleDate(
  date: string,
  deliveryType: 'pickup' | 'delivery',
  station?: string
): boolean {
  const availableDates = getAvailableDates(deliveryType, station);
  return availableDates.includes(date);
}

/**
 * Obter próxima data disponível
 */
export function getNextAvailableDate(
  deliveryType: 'pickup' | 'delivery',
  station?: string
): string | null {
  const availableDates = getAvailableDates(deliveryType, station);
  return availableDates.length > 0 ? availableDates[0] : null;
}

/**
 * Formatar data para exibição
 */
export function formatScheduleDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-PT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}