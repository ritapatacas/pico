"use client";
import { useState } from "react";
import CartStep from "./CartStep";
import CheckoutStep from "./CheckoutStep";
import PaymentStep from "./PaymentStep";

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [step, setStep] = useState<'cart' | 'checkout' | 'payment'>('cart');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 bg-black-200 z-50 transition-opacity" onClick={onClose}>
      <aside
        className={`fixed right-0 top-0 h-full bg-white shadow-lg flex flex-col transition-[width] duration-200 ease-in-out ${isOpen ? 'w-[420px]' : 'w-20'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-2xl font-bold capitalize">
            {step === 'cart' ? 'Carrinho' : step === 'checkout' ? 'Checkout' : 'Pagamento'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">×</button>
        </div>
        <div className="flex-1 overflow-y-auto pl-8 pr-2 py-2">
          {step === 'cart' && <CartStep onNext={() => setStep('checkout')} />}
          {step === 'checkout' && <CheckoutStep onNext={() => setStep('payment')} onBack={() => setStep('cart')} />}
          {step === 'payment' && <PaymentStep onBack={() => setStep('checkout')} />}
        </div>
      </aside>
    </div>
  );
} 