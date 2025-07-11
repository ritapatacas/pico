import { Suspense } from "react";
import CheckoutClient from "@/components/CheckoutClient";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutClient />
    </Suspense>
  );
} 