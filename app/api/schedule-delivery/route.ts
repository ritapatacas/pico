// app/api/schedule-delivery/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";

const DeliverySchema = z.object({
  name: z.string().min(2),
  address: z.string().min(5),
  lat: z.number(),
  lon: z.number(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  slot: z.enum(["1", "2", "3", "4", "5"]),
});

type Delivery = z.infer<typeof DeliverySchema> & { createdAt: string };

const storedDeliveries: Delivery[] = [];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = DeliverySchema.parse(body);

    const delivery: Delivery = {
      ...data,
      createdAt: new Date().toISOString(),
    };

    storedDeliveries.push(delivery);

    console.log("📦 Entrega registada:", delivery);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Erro inesperado" }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json(storedDeliveries);
}
