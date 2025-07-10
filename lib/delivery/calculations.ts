// lib/delivery/calculations.ts

import { STATIONS_COORDS, FREE_RADIUS_METERS, DEVIATION_THRESHOLDS_METERS } from '../deliveryConfig';
import type { Station, DeliveryCoordinates, DistanceCalculation } from './types';

/**
 * Calculate the distance between two points using Haversine formula
 * Returns distance in meters
 */
export function calculateHaversineDistance(
  point1: DeliveryCoordinates,
  point2: DeliveryCoordinates
): number {
  const R = 6371000; // Earth's radius in meters
  const φ1 = (point1.lat * Math.PI) / 180;
  const φ2 = (point2.lat * Math.PI) / 180;
  const Δφ = ((point2.lat - point1.lat) * Math.PI) / 180;
  const Δλ = ((point2.lon - point1.lon) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c; // Distance in meters
}

/**
 * Find the nearest station and calculate deviation level
 */
export function findNearestStationAndDeviation(
  customerCoords: DeliveryCoordinates
): DistanceCalculation {
  let nearestStation = STATIONS_COORDS[0];
  let minDistance = Infinity;

  // Find the nearest station
  for (const station of STATIONS_COORDS) {
    const distance = calculateHaversineDistance(customerCoords, {
      lat: station.lat,
      lon: station.lon,
    });

    if (distance < minDistance) {
      minDistance = distance;
      nearestStation = station;
    }
  }

  // Calculate deviation level (1-5)
  let deviation = 5; // Default to highest deviation
  for (let i = 0; i < DEVIATION_THRESHOLDS_METERS.length; i++) {
    if (minDistance <= DEVIATION_THRESHOLDS_METERS[i]) {
      deviation = i + 1;
      break;
    }
  }

  return {
    nearestStation,
    distanceMeters: Math.round(minDistance),
    deviation,
  };
}

/**
 * Calculate delivery price based on distance and deviation
 */
export function calculateDeliveryPrice(
  distanceMeters: number,
  deviation: number
): number {
  const basePrice = 5.0; // Base delivery price in euros
  
  // Free delivery within 5km (deviation 1)
  if (deviation === 1) {
    return 0;
  }
  
  // Reduced price for deviation 2 (5-10km)
  if (deviation === 2) {
    return basePrice * 0.6; // 40% discount
  }
  
  // Standard price for deviation 3 (10-20km)
  if (deviation === 3) {
    return basePrice;
  }
  
  // Increased price for deviation 4 (20-40km)
  if (deviation === 4) {
    return basePrice * 1.5;
  }
  
  // Premium price for deviation 5 (40km+)
  const distanceKm = distanceMeters / 1000;
  const extraKm = Math.max(0, distanceKm - 40);
  return basePrice * 2 + (extraKm * 0.5); // €2 per extra km beyond 40km
}

/**
 * Format distance for display
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

/**
 * Get delivery description based on deviation
 */
export function getDeliveryDescription(
  deviation: number,
  distanceMeters: number
): string {
  const distance = formatDistance(distanceMeters);
  
  switch (deviation) {
    case 1:
      return `Entrega gratuita (${distance})`;
    case 2:
      return `Entrega com desconto (${distance})`;
    case 3:
      return `Entrega standard (${distance})`;
    case 4:
      return `Entrega alargada (${distance})`;
    case 5:
      return `Entrega premium (${distance})`;
    default:
      return `Entrega (${distance})`;
  }
}

/**
 * Check if delivery is available for a given distance
 * You can set a maximum delivery radius here
 */
export function isDeliveryAvailable(distanceMeters: number): boolean {
  const MAX_DELIVERY_RADIUS_METERS = 80000; // 80km max
  return distanceMeters <= MAX_DELIVERY_RADIUS_METERS;
}