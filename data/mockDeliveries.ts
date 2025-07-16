// data/mockDeliveries.ts

export type Delivery = {
  date: string;
  slot: "1" | "2" | "3" | "4" | "5";
  coords: {
    lat: number;
    lon: number;
  };
};

export const mockDeliveries: Delivery[] = [
  {
    date: "2025-07-11",
    slot: "1",
    coords: { lat: 38.7169, lon: -9.1399 },
  },
  {
    date: "2025-07-12",
    slot: "2",
    coords: { lat: 38.5746, lon: -9.0437 },
  },
  {
    date: "2025-07-11",
    slot: "3",
    coords: { lat: 40.2033, lon: -8.4103 },
  },
];
