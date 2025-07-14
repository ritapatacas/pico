"use client";

import { usePaymentSuccess } from '@/hooks/use-payment-success';

export function PaymentSuccessHandler() {
  usePaymentSuccess();
  return null; // This component doesn't render anything
} 