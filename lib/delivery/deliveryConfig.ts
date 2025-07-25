// lib/delivery/deliveryConfig.ts

export const STATIONS_COORDS = [
    { name: "AMA", lat: 38.7561867, lon: -9.2457022 },
    { name: "LIS", lat: 38.7168141, lon: -9.1325403 },
    { name: "PG", lat: 39.9169584, lon: -8.145564 }
];

export const FREE_RADIUS_METERS = 5000; // 5 km


export const DEVIATION_THRESHOLDS_METERS = [
    FREE_RADIUS_METERS,         // 1
    FREE_RADIUS_METERS * 2,     // 2
    FREE_RADIUS_METERS * 4,     // 3
    FREE_RADIUS_METERS * 8      // 4
    // above → 5
  ];
  