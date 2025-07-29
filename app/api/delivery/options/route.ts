// app/api/delivery/options/route.ts

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: "Missing coordinates" }, { status: 400 });
  }

  // Simulate delivery options (devs adjust here according to real logic)
  const slots = [
    { date: "2025-07-12", slot: 1, price: 0, available: true },
    { date: "2025-07-13", slot: 2, price: 1.5, available: true },
    { date: "2025-07-14", slot: 3, price: 2.5, available: false },
    { date: "2025-07-15", slot: 4, price: 3.0, available: true }
  ];

  return NextResponse.json(slots);
}
