"use client"

import { useState, useEffect } from "react"
import Modal from "@/components/ui/Modal"
import productsData from "@/products.json"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

export type Product = typeof productsData[number];

export default function FreshFruitAddPopup({ open, onClose, product }: { open: boolean, onClose: () => void, product: Product }) {
  if (!product) return null;

  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState(product.embaladoOptions[0]?.size || "")
  const [quantity, setQuantity] = useState(1)
  const [packagingType, setPackagingType] = useState("embalado")
  const [kiloQuantity, setKiloQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(product.packagedImage)
  const [showSuccess, setShowSuccess] = useState(false)

  function getSelectedEmbaladoOption(selectedSize: string) {
    if(product && product.embaladoOptions.length > 0) {
      return product.embaladoOptions.find(opt => opt.size === selectedSize) || product.embaladoOptions[0];
    }
    // Fallback: return a default option if none exist
    return { size: '', price: 0, kgPrice: 0 };
  }

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  const handleAddToCart = () => {
    if (packagingType === 'embalado') {
      const selectedOption = getSelectedEmbaladoOption(selectedSize);
      addToCart({
        name: `${product.name} (${selectedOption.size})`,
        price: selectedOption.price,
        quantity: quantity,
        image: product.packagedImage,
        size: selectedOption.size,
        product_key: selectedOption.product_key,
      });
    } else {
      addToCart({
        name: `${product.name} Granel`,
        price: product.precoGranelPorKg,
        quantity: kiloQuantity,
        image: product.bulkImage,
        product_key: product.bulkProductKey,
      });
    }
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  useEffect(() => {
    if (packagingType === "embalado" && selectedImage === product.bulkImage) {
      setSelectedImage(product.packagedImage)
    } else if (packagingType === "granel" && selectedImage === product.packagedImage) {
      setSelectedImage(product.bulkImage)
    }
    // eslint-disable-next-line
  }, [packagingType, product.packagedImage, product.bulkImage, selectedImage])

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col md:flex-row items-center md:items-stretch">
        <img src={selectedImage} alt={product.name} className="w-full max-w-xs rounded-sm mb-4 hidden md:block md:mr-6" />
        <Card className="bg-gray-200 opacity-80 text-black overflow-hidden transition-all hover:shadow-lg w-full h-auto min-h-[360px] flex flex-col justify-between">
          <CardContent className="flex flex-col flex-grow ">
            <div className="flex flex-col justify-between h-full">
              <div>
                <h3 className="text-lg font-semibold mb-2">Formato</h3>
                <div className="flex flex-wrap gap-2">
                  <label className={`cursor-pointer px-3 py-1 rounded-sm flex items-center justify-center border-2 text-sm font-semibold transition-all ${packagingType === "embalado" ? "border-black bg-black text-white" : "border-gray-200 hover:border-gray-300"}`}>
                    <input type="radio" name="packagingType" value="embalado" checked={packagingType === "embalado"} onChange={(e) => setPackagingType(e.target.value)} className="sr-only" />
                    Embalado
                  </label>
                  <label className={`cursor-pointer px-3 py-1 rounded-sm flex items-center justify-center border-2 text-sm font-semibold transition-all ${packagingType === "granel" ? "border-black bg-black text-white" : "border-gray-200 hover:border-gray-300"}`}>
                    <input type="radio" name="packagingType" value="granel" checked={packagingType === "granel"} onChange={(e) => setPackagingType(e.target.value)} className="sr-only" />
                    Granel
                  </label>
                </div>
              </div>
              {packagingType === "embalado" && (
                <div className="flex flex-col justify-between h-full mt-4">
                  <div>
                    <h2 className="text-md font-semibold mb-2">Tamanho</h2>
                    <select
                      value={selectedSize}
                      onChange={e => setSelectedSize(e.target.value)}
                      className="px-3 py-2 rounded-sm border-2 border-gray-200 text-sm font-semibold focus:outline-none focus:border-black transition-all bg-white text-black"
                    >
                      {product.embaladoOptions.map(opt => (
                        <option key={opt.size} value={opt.size}>
                          {opt.size}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="text-sm font-semibold mt-4">
                    Embalagem {getSelectedEmbaladoOption(selectedSize).size} - {getSelectedEmbaladoOption(selectedSize).price.toFixed(2).replace(".", ",")}€ ({getSelectedEmbaladoOption(selectedSize).kgPrice.toFixed(2).replace(".", ",")}€/kg)
                  </div>
                </div>
              )}
              {packagingType === "granel" && (
                <div className="flex flex-col justify-between h-full mt-4">
                  <div>
                    <h2 className="text-md font-semibold mb-2">Peso (kg)</h2>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="0.5"
                        value={kiloQuantity}
                        onChange={(e) => setKiloQuantity(Number(e.target.value))}
                        className="w-full h-2 cursor-pointer appearance-none rounded-sm bg-black accent-black"
                      />
                      <span className="text-sm font-semibold">{kiloQuantity.toFixed(1)}kg</span>
                    </div>
                  </div>
                  <div className="text-sm font-semibold mt-4">
                    Total: {(kiloQuantity * product.precoGranelPorKg).toFixed(2).replace(".", ",")}€
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <div className="mx-6 border-t border border-gray-300" />
          <div className="px-6 flex items-center gap-2 mb-4">
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
              {showSuccess ? "Adicionado!" : (packagingType === "embalado"
                ? `Adicionar (${(getSelectedEmbaladoOption(selectedSize).price * quantity).toFixed(2).replace('.', ',')}€)`
                : `Adicionar (${(kiloQuantity * product.precoGranelPorKg).toFixed(2).replace('.', ',')}€)`)}
            </Button>
          </div>
        </Card>
      </div>
    </Modal>
  )
} 