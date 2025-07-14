"use client"

import { useState, useEffect, useRef, ReactNode } from "react"
import { useCart } from "@/contexts/cart-context"
import { Heart, Minus, Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRouter } from 'next/navigation';
import { useLanguageSettings } from "@/hooks/use-settings-store"

export interface EmbaladoOption {
  size: string;
  price: number;
  kgPrice: number;
  product_key?: string;
}

export interface ProductPageLayoutProps {
  productKey: string; // e.g. "blueberries"
  mainImage: string;
  backgroundImage: string;
  embaladoOptions: EmbaladoOption[];
  precoGranelPorKg: number;
  packagedImage: string;
  bulkImage: string;
  detailsContent?: ReactNode;
  pricesContent?: ReactNode;
}

export default function ProductPageLayout({
  productKey,
  mainImage,
  backgroundImage,
  embaladoOptions,
  precoGranelPorKg,
  packagedImage,
  bulkImage,
  detailsContent,
  pricesContent,
}: ProductPageLayoutProps) {
  const { addToCart } = useCart()
  const router = useRouter();
  const { t, language } = useLanguageSettings()

  const [selectedSize, setSelectedSize] = useState(embaladoOptions[0]?.size || "")
  const [isFavorite, setIsFavorite] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [packagingType, setPackagingType] = useState("embalado")
  const [kiloQuantity, setKiloQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(packagedImage)
  const [tab, setTab] = useState("detalhes")
  const [showSuccess, setShowSuccess] = useState(false)

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
        name: `${t(`product.${productKey}`)} (${selectedOption.size})`,
        price: selectedOption.price,
        quantity: quantity,
        image: packagedImage,
        size: selectedOption.size,
        product_key: selectedOption.product_key,
      });
    } else { // granel
      addToCart({
        name: `${t(`product.${productKey}`)} ${t("product.bulk")}`,
        price: precoGranelPorKg,
        quantity: kiloQuantity,
        image: bulkImage,
        product_key: productKey === 'blueberries' ? 'BLU_1000' : 'RASP_1000',
      });
    }
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  useEffect(() => {
    if (packagingType === "embalado" && selectedImage === bulkImage) {
      setSelectedImage(packagedImage)
    } else if (packagingType === "granel" && selectedImage === packagedImage) {
      setSelectedImage(bulkImage)
    }
  }, [packagingType, packagedImage, bulkImage, selectedImage])

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="relative h-[900px] md:h-[700px] overflow-hidden h-full">
          <Image
            src={backgroundImage}
            alt={`${t(`product.${productKey}`)} background`}
            width={1920}
            height={700}
            className="absolute inset-0 object-cover w-full h-full"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
          <div className="container relative z-10 flex flex-col items-start justify-center h-full mt-10 px-10 mx-auto space-y-6 text-white">
            <div className="bigcard flex flex-col md:flex-row justify-center items-center gap-8 w-full p-4 md:p-20">
              <div id="desc" className="w-full lg:w-3/4 xl:w-2/3 pl-0 md:pl-20 mb-6 md:mb-0">
                <div className="lg:w-1/2">
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                    {t(`product.${productKey}`)}
                  </h1>
                  <span className="text-l text-gray-200 font-semibold">
                    {t("product.fromPrice")} {embaladoOptions[0]?.price.toFixed(2).replace(".", ",")}€
                  </span>
                </div>
                <div className="text text-lg mt-4">
                  {detailsContent}
                </div>
              </div>
              <div id="product-form" className="pb-10">
                <Card className="bg-gray-200 opacity-80 text-black overflow-hidden transition-all hover:shadow-lg w-[70vw] h-auto min-h-[360px] flex flex-col justify-between md:mr-40">
                  <CardContent className="flex flex-col flex-grow ">
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{t("product.format")}</h3>
                        <div className="flex flex-wrap gap-2">
                          <label className={`cursor-pointer px-3 py-1 rounded flex items-center justify-center border-2 text-sm font-semibold transition-all ${packagingType === "embalado" ? "border-black bg-black text-white" : "border-gray-200 hover:border-gray-300"}`}>
                            <input type="radio" name="packagingType" value="embalado" checked={packagingType === "embalado"} onChange={(e) => setPackagingType(e.target.value)} className="sr-only" />
                            {t("product.packaged")}
                          </label>
                          <label className={`cursor-pointer px-3 py-1 rounded flex items-center justify-center border-2 text-sm font-semibold transition-all ${packagingType === "granel" ? "border-black bg-black text-white" : "border-gray-200 hover:border-gray-300"}`}>
                            <input type="radio" name="packagingType" value="granel" checked={packagingType === "granel"} onChange={(e) => setPackagingType(e.target.value)} className="sr-only" />
                            {t("product.bulk")}
                          </label>
                        </div>
                      </div>
                      {packagingType === "embalado" && (
                        <div className="flex flex-col justify-between h-full mt-4">
                          <div>
                            <h2 className="text-md font-semibold mb-2">{t("product.size")}</h2>
                            <select
                              value={selectedSize}
                              onChange={e => setSelectedSize(e.target.value)}
                              className="px-3 py-2 rounded border-2 border-gray-200 text-sm font-semibold focus:outline-none focus:border-black transition-all bg-white text-black"
                            >
                              {embaladoOptions.map(opt => (
                                <option key={opt.size} value={opt.size}>
                                  {opt.size}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="text-sm font-semibold mt-4">
                            {t("product.package")} {getSelectedEmbaladoOption(selectedSize).size} - {getSelectedEmbaladoOption(selectedSize).price.toFixed(2).replace(".", ",")}€ ({getSelectedEmbaladoOption(selectedSize).kgPrice.toFixed(2).replace(".", ",")}€/kg)
                          </div>
                        </div>
                      )}
                      {packagingType === "granel" && (
                        <div className="flex flex-col justify-between h-full mt-4">
                          <div>
                            <h2 className="text-md font-semibold mb-2">{t("product.weight")} (kg)</h2>
                            <div className="flex items-center gap-2">
                              <input
                                type="range"
                                min="1"
                                max="5"
                                step="0.5"
                                value={kiloQuantity}
                                onChange={(e) => setKiloQuantity(Number(e.target.value))}
                                className="w-full h-2 cursor-pointer appearance-none rounded-lg bg-black accent-black"
                              />
                              <span className="text-sm font-semibold">{kiloQuantity.toFixed(1)}kg</span>
                            </div>
                          </div>
                          <div className="text-sm font-semibold mt-4">
                            {t("product.totalPrice")}: {(kiloQuantity * precoGranelPorKg).toFixed(2).replace(".", ",")}€
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <div className="mx-6 border-t border border-gray-300" />
                  <div className="px-6 flex items-center gap-2">
                    <div className="flex items-center border rounded-md">
                      <Button variant="ghost" size="icon" onClick={decrementQuantity} className="h-4 w-4">
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-6 text-center text-sm font-medium">{quantity}</span>
                      <Button variant="ghost" size="icon" onClick={incrementQuantity} className="h-4 w-4">
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <Button className="flex-grow bg-black text-white hover:bg-gray-900 py-2 text-sm font-medium" onClick={handleAddToCart}>
                      {showSuccess ? t("product.added") : (packagingType === "embalado"
                        ? `${t("product.addToCart")} (${(getSelectedEmbaladoOption(selectedSize).price * quantity).toFixed(2).replace(".", ",")}€)`
                        : `${t("product.addToCart")} (${(kiloQuantity * precoGranelPorKg).toFixed(2).replace(".", ",")}€)`)}
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
        <div className="w-full my-4">
          <div className="flex justify-center md:justify-start border-b border-gray-200">
            <button
              className={`px-4 py-2 text-sm font-medium focus:outline-none ${tab === "detalhes"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 hover:text-primary"
                }`}
              onClick={() => setTab("detalhes")}
              type="button"
            >
              {t("product.details")}
            </button>
            <button
              className={`ml-4 px-4 py-2 text-sm font-medium focus:outline-none ${tab === "precos"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 hover:text-primary"
                }`}
              onClick={() => setTab("precos")}
              type="button"
            >
              {t("product.prices")}
            </button>
          </div>
          <div className="mt-4 px-4 pt-6 pb-30">
            {tab === "detalhes" && (
              <div>
                {detailsContent}
              </div>
            )}
            {tab === "precos" && (
              <div>
                {pricesContent}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
} 