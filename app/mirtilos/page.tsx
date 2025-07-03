"use client"

import { useState, useEffect, useRef } from "react"
import { useCart } from "@/contexts/cart-context"
import { Heart, Minus, Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { loadStripe } from '@stripe/stripe-js';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { useLanguageSettings } from "@/hooks/use-settings-store"
import ProductPageLayout from "@/components/ProductPageLayout";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function PayPalButton({ amount }: { amount: number }) {
  const paypalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).paypal && paypalRef.current) {
      (window as any).paypal.Buttons({
        createOrder: (data: any, actions: any) => actions.order.create({
          purchase_units: [{ amount: { value: amount.toFixed(2) } }],
        }),
        onApprove: (data: any, actions: any) => actions.order.capture().then((details: any) => {
          alert('Pagamento concluído por ' + details.payer.name.given_name);
        }),
      }).render(paypalRef.current);
    }
  }, [amount]);

  return <div ref={paypalRef}></div>;
}

export default function MirtilosPage() {
  const { addToCart } = useCart()
  const router = useRouter();
  const { t, language } = useLanguageSettings()

  const [selectedSize, setSelectedSize] = useState("250g")
  const [isFavorite, setIsFavorite] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [packagingType, setPackagingType] = useState("embalado")
  const [kiloQuantity, setKiloQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState("/imgs/mirtilo_embalagem.webp")
  const [tab, setTab] = useState("detalhes")
  const [showSuccess, setShowSuccess] = useState(false)

  const embaladoOptions = [
    { size: "125g", price: 1.25, kgPrice: 10 },
    { size: "250g", price: 2.0, kgPrice: 8 },
    { size: "500g", price: 3.5, kgPrice: 7 },
    { size: "700g", price: 4.2, kgPrice: 6 },
  ];
  const precoGranelPorKg = 6;

  function getSelectedEmbaladoOption(selectedSize: string) {
    return embaladoOptions.find(opt => opt.size === selectedSize) || embaladoOptions[0];
  }
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
  }

  const handleAddToCart = () => {
    if (packagingType === 'embalado') {
      const selectedOption = getSelectedEmbaladoOption(selectedSize);
      addToCart({
        name: `${t("product.blueberries")} (${selectedOption.size})`,
        price: selectedOption.price,
        quantity: quantity,
        image: '/imgs/mirtilo_embalagem.webp',
        size: selectedOption.size,
      });
    } else { // granel
      addToCart({
        name: `${t("product.blueberries")} ${t("product.bulk")}`,
        price: precoGranelPorKg,
        quantity: kiloQuantity,
        image: '/imgs/mirtilo_granel.webp',
      });
    }
    
    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  useEffect(() => {
    if (packagingType === "embalado" && selectedImage === "/imgs/mirtilo_granel.webp") {
      setSelectedImage("/imgs/mirtilo_embalagem.webp")
    } else if (packagingType === "granel" && selectedImage === "/imgs/mirtilo_embalagem.webp") {
      setSelectedImage("/imgs/mirtilo_granel.webp")
    }
  }, [packagingType])

  return (
    <ProductPageLayout
      productKey="blueberries"
      mainImage="/imgs/mirtilo.webp"
      backgroundImage="/imgs/mirtilo.webp"
      embaladoOptions={embaladoOptions}
      precoGranelPorKg={precoGranelPorKg}
      packagedImage="/imgs/mirtilo_embalagem.webp"
      bulkImage="/imgs/mirtilo_granel.webp"
      detailsContent={
        <>
          <p><b>{t("product.packagedAndBulk")}</b></p>
          <p className="mt-2">
            <span>
              {t("product.varieties")}: {t("product.dukeAndEmerald")}
              <br />
              {t("product.location")}: {t("product.pedrogaoGrande")}
              <br />
              {t("product.productionMode")}: {t("product.integratedAgriculture")}
              <br />
              {t("product.harvestSeason")}: {t("product.mayToSeptember")}
            </span>
          </p>
        </>
      }
      pricesContent={
        <>
          <h3 className="text-lg font-semibold mb-2">{t("product.priceTable")}</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>
              <span className="font-medium">{t("product.packaged")}:</span>{" "}
              {embaladoOptions.map(opt => (
                <span key={opt.size} className="ml-2">
                  {opt.size}g - {opt.price.toFixed(2).replace(".", ",")}€
                </span>
              ))}
            </li>
            <li>
              <span className="font-medium">{t("product.bulk")}:</span>{" "}
              {precoGranelPorKg.toFixed(2).replace(".", ",")}€/kg
            </li>
          </ul>
        </>
      }
    />
  );
}
