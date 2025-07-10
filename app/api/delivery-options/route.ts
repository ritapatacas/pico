// lib/deliveryUtils.ts

import { STATIONS_COORDS, FREE_RADIUS_METERS } from "../../../lib/deliveryConfig";

export function haversineDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // earth's radius in meters
  const toRad = (angle: number) => (angle * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function calculateDeviation(lat: number, lon: number): number {
  const distances = STATIONS_COORDS.map((station) =>
    haversineDistanceMeters(lat, lon, station.lat, station.lon)
  );

  const minDist = Math.min(...distances);

  if (minDist <= FREE_RADIUS_METERS) return 1;
  if (minDist <= 2 * FREE_RADIUS_METERS) return 2;
  if (minDist <= 4 * FREE_RADIUS_METERS) return 3;
  if (minDist <= 8 * FREE_RADIUS_METERS) return 4;
  return 5;
}
