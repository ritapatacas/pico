"use client";
import { useCart } from "@/contexts/cart-context";
import { Button } from "./ui/button";
import Image from "next/image";
import { Plus, Minus } from "lucide-react";

export default function CartStep({ onNext }: { onNext: () => void }) {
  const { cartItems, removeFromCart, updateItemQuantity, cartTotal } = useCart();

  if (!cartItems.length) {
    return <div className="flex-grow flex items-center justify-center"><p className="text-gray-500">O seu carrinho está vazio.</p></div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto pr-2">
        {cartItems.map(item => (
          <div key={item.id} className="flex items-center gap-4 py-4 border-b">
            <Image src={item.image} alt={item.name} width={64} height={64} className="rounded-md object-cover" />
            <div className="flex-grow">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500">{item.price.toFixed(2).replace('.',',')}€ {item.size ? "" : "/ kg"}</p>
              <div className="flex items-center gap-2 mt-2">
                <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateItemQuantity(item.id, item.quantity - (item.size ? 1 : 0.5))} disabled={item.quantity <= (item.size ? 1 : 0.5)}>
                  <Minus className="h-4 w-4"/>
                </Button>
                <span className="w-10 text-center">{item.quantity}{item.size ? '' : 'kg'}</span>
                <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateItemQuantity(item.id, item.quantity + (item.size ? 1 : 0.5))}>
                  <Plus className="h-4 w-4"/>
                </Button>
              </div>
            </div>
            <div className="text-right flex flex-col items-end justify-between self-stretch">
              <p className="font-semibold">{(item.price * item.quantity).toFixed(2).replace('.',',')}€</p>
              <Button variant="link" className="text-red-500 hover:text-red-600 text-xs p-0 h-auto" onClick={() => removeFromCart(item.id)}>Remover</Button>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between font-bold text-lg mb-4">
          <span>Total</span>
          <span>{cartTotal.toFixed(2).replace('.',',')}€</span>
        </div>
        <Button type="button" className="w-full bg-black text-white hover:bg-gray-800 py-3" onClick={onNext}>
          Finalizar Compra
        </Button>
      </div>
    </div>
  );
} 