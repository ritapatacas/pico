"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"

import Image from "next/image"
import { ChevronLeft, ChevronRight, Heart, Star, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/contexts/cart-context"

const colors = [
  { name: "Matte Black", value: "black" },
  { name: "Pearl White", value: "white" },
  { name: "Brushed Silver", value: "silver" },
  { name: "Rose Gold", value: "gold" },
]

const productVariants = Array.from({ length: 11 }, (_, i) => ({
  id: i + 1,
  color: colors[i % colors.length].name,
  image: `/placeholder.svg?height=600&width=600&text=Bottle${i + 1}`,
}))

const relatedProducts = [
  { id: 1, name: "Sport Water Bottle", price: 39.99, image: "/placeholder.svg?height=300&width=300&text=Sport+Bottle" },
  { id: 2, name: "Insulated Tumbler", price: 44.99, image: "/placeholder.svg?height=300&width=300&text=Tumbler" },
  {
    id: 3,
    name: "Collapsible Water Bottle",
    price: 34.99,
    image: "/placeholder.svg?height=300&width=300&text=Collapsible",
  },
  { id: 4, name: "Glass Water Bottle", price: 29.99, image: "/placeholder.svg?height=300&width=300&text=Glass+Bottle" },
]

const embaladoOptions = [
  { size: "125g", price: 1.25, kgPrice: 10 },
  { size: "250g", price: 2.0, kgPrice: 8 },
  { size: "500g", price: 3.5, kgPrice: 7 },
  { size: "700g", price: 4.2, kgPrice: 6 },
];

// Preço por kg para granel
const precoGranelPorKg = 6;

// Função para obter o objeto da opção selecionada
function getSelectedEmbaladoOption(selectedSize: string) {
  return embaladoOptions.find(opt => opt.size === selectedSize) || embaladoOptions[0];
}

export default function ProductClient() {
  const searchParams = useSearchParams()
  const pagina = searchParams.get("p")
  const { addToCart } = useCart()

  const [selectedSize, setSelectedSize] = useState("250g")
  const [selectedColor, setSelectedColor] = useState(colors[0].value)
  const [selectedVariant, setSelectedVariant] = useState(1)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [packagingType, setPackagingType] = useState("embalado")
  const [kiloQuantity, setKiloQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState("/mirtilo_embalagem.jpeg")

  const imageOptions = [
    {
      src: "/mirtilo.png",
      alt: "Mirtilos (genérico)",
      label: "Genérico",
    },
    {
      src: "/mirtilo_embalagem.jpeg",
      alt: "Mirtilos embalados",
      label: "Embalado",
    },
    {
      src: "/mirtilo_granel.jpeg",
      alt: "Mirtilos a granel",
      label: "A granel",
    },
  ]

  // Sempre mostrar todos os thumbnails
  const selectedIndex = imageOptions.findIndex(img => img.src === selectedImage)

  const nextImage = () => {
    if (imageOptions.length === 0) return;
    setSelectedImage(imageOptions[(selectedIndex + 1) % imageOptions.length].src)
  }

  const previousImage = () => {
    if (imageOptions.length === 0) return;
    setSelectedImage(imageOptions[(selectedIndex - 1 + imageOptions.length) % imageOptions.length].src)
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
        name: `Mirtilos (${selectedOption.size})`,
        price: selectedOption.price,
        quantity: quantity,
        image: '/mirtilo_embalagem.jpeg',
        size: selectedOption.size,
      });
    } else { // granel
      addToCart({
        name: 'Mirtilos a Granel',
        price: precoGranelPorKg,
        quantity: kiloQuantity,
        image: '/milo_granel.jpeg',
      });
    }
  };

  useEffect(() => {
    if (packagingType === "embalado" && selectedImage === "/mirtilo_granel.jpeg") {
      setSelectedImage("/mirtilo_embalagem.jpeg")
    } else if (packagingType === "granel" && selectedImage === "/mirtilo_embalagem.jpeg") {
      setSelectedImage("/mirtilo_granel.jpeg")
    }
  }, [packagingType])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-grow flex flex-col justify-between py-12">
        <div className="pt-28 w-[90%] lg:w-[80%] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12 lg:gap-16">
            {/* Product Image */}
            <div className="lg:w-1/2 order-1 lg:order-1 sticky top-24">
              <div className="relative aspect-square">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/80 hover:bg-white"
                  onClick={previousImage}
                >
                  <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                </Button>

                <div className="relative w-full h-full overflow-hidden rounded-2xl group">
                  <Image
                    src={selectedImage}
                    alt={
                      imageOptions.find((img) => img.src === selectedImage)
                        ?.alt || "Mirtilos"
                    }
                    fill
                    className="object-cover transition-all duration-300 group-hover:scale-110"
                  />
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/80 hover:bg-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                </Button>
              </div>

              <div className="flex justify-center gap-3 sm:gap-4 mt-6">
                {imageOptions.map((img) => (
                  <button
                    key={img.src}
                    onClick={() => setSelectedImage(img.src)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden transition-all border-2
                      ${
                        selectedImage === img.src
                          ? "ring-2 ring-black border-black"
                          : "hover:ring-1 hover:ring-gray-200 border-gray-200"
                      }
                    `}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:w-1/2 space-y-8 order-2 lg:order-2">
              <div>
                <h1 className="text-4xl sm:text-4xl font-bold tracking-tight mb-4">
                  Mirtilos
                </h1>
                <p className="text-l text-gray-400 font-semibold">
                  desde 1,25€
                </p>
              </div>

              <div className="text-gray-700 text-lg">
                <b>Mirtilos embalados e a granel</b>
                <span className="text-gray-700">
                  <br></br>Variedades: Duke e Emerald
                  <br></br>Localização: Pedrógão Grande
                  <br></br>Modo de Produção: Agricultura Integrada
                  <br></br>Época de colheita: maio a setembro
                </span>
              </div>

              {/* formato */}
              <div className="space-y-4">
                <h2 className="text-md font-semibold">formato</h2>
                <div className="flex flex-wrap gap-3">
                  {/* embalado */}
                  <label
                    className={`cursor-pointer px-4 py-1 rounded flex items-center justify-center border-2 text-m font-semibold transition-all ${
                      packagingType === "embalado"
                        ? "border-black bg-black text-white"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="packagingType"
                      value="embalado"
                      checked={packagingType === "embalado"}
                      onChange={(e) => setPackagingType(e.target.value)}
                      className="sr-only"
                    />
                    embalado
                  </label>

                  {/* granel */}
                  <label
                    className={`cursor-pointer px-4 py-2 rounded flex items-center justify-center border-2 text-m font-semibold transition-all ${
                      packagingType === "granel"
                        ? "border-black bg-black text-white"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="packagingType"
                      value="granel"
                      checked={packagingType === "granel"}
                      onChange={(e) => setPackagingType(e.target.value)}
                      className="sr-only"
                    />
                    granel
                  </label>
                </div>
              </div>
              {packagingType === "embalado" && (
                <div className="space-y-4">
                  <h2 className="text-md font-semibold">Tamanho</h2>
                  <div className="flex flex-wrap gap-3">
                    {embaladoOptions.map((opt) => (
                      <button
                        key={opt.size}
                        onClick={() => setSelectedSize(opt.size)}
                        className={` px-3 py-2 rounded flex items-center justify-center border-2 text-m font-semibold transition-all
                        ${
                          selectedSize === opt.size
                            ? "border-black bg-black text-white"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {opt.size}
                      </button>
                    ))}
                  </div>
                  {(() => {
                    const selected = getSelectedEmbaladoOption(selectedSize);
                    return (
                      <div className="textbuttontext-sm font-semibold mt-2">
                        embalagem de {selected.size} -{" "}
                        {selected.price.toFixed(2).replace(".", ",")}€ (
                        {selected.kgPrice.toFixed(2).replace(".", ",")}€/kg)
                      </div>
                    );
                  })()}
                </div>
              )}
              {packagingType === "granel" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Peso (kg)</h2>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="0.5"
                      value={kiloQuantity}
                      onChange={(e) => setKiloQuantity(Number(e.target.value))}
                      className="w-full h-2 cursor-pointer appearance-none rounded-lg bg-gray-200 accent-black"
                    />
                    <span className="w-16 text-right font-semibold">
                      {kiloQuantity.toFixed(1)}kg
                    </span>
                    <span className="ml-4 text-m font-semibold text-black">
                      {(kiloQuantity * precoGranelPorKg)
                        .toFixed(2)
                        .replace(".", ",")}
                      €
                    </span>
                  </div>
                  <div className="text-lg font-semibold mt-2">
                    Preço total:{" "}
                    {(kiloQuantity * precoGranelPorKg)
                      .toFixed(2)
                      .replace(".", ",")}
                    €
                  </div>
                </div>
              )}

              {/* quantity - add - fav */}
              <div className="flex items-center gap-4">
                {/* quantity */}
                <div className="flex items-center border rounded-full">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={decrementQuantity}
                    className="textbutton rounded-l-full"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center text-lg">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={incrementQuantity}
                    className="rounded"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* add to cart */}
                <Button
                  className="textbutton flex-grow bg-black text-white hover:bg-gray-900 py-6 text-lg font-medium"
                  onClick={handleAddToCart}
                >
                  {packagingType === "embalado"
                    ? (() => {
                        const selected =
                          getSelectedEmbaladoOption(selectedSize);
                        return `Adicionar (${(selected.price * quantity)
                          .toFixed(2)
                          .replace(".", ",")}€)`;
                      })()
                    : `Adicionar (${(kiloQuantity * precoGranelPorKg)
                        .toFixed(2)
                        .replace(".", ",")}€)`}
                </Button>

                {/* fav */}
                <Button
                  variant="outline"
                  className="p-3"
                  onClick={toggleFavorite}
                >
                  <Heart
                    className={`w-6 h-6 ${
                      isFavorite ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                  <span className="sr-only">Add to Favorites</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="details">
              <TabsList className="w-full justify-start border-b">
                <TabsTrigger value="details" className="text-lg">
                  Product Details
                </TabsTrigger>
                <TabsTrigger value="specs" className="text-lg">
                  Specifications
                </TabsTrigger>
                <TabsTrigger value="reviews" className="text-lg">
                  Reviews
                </TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="mt-4">
                <p className="text-gray-700">
                  Our Premium Drink Bottle is designed with both style and
                  functionality in mind. The double-wall vacuum insulation keeps
                  your drinks cold for up to 24 hours or hot for up to 12 hours.
                  The sleek, modern design fits comfortably in your hand and
                  looks great on your desk or in your gym bag.
                </p>
                <ul className="list-disc pl-5 mt-4 space-y-2 text-gray-700">
                  <li>Made from high-quality, BPA-free stainless steel</li>
                  <li>Leak-proof lid with convenient carry loop</li>
                  <li>Wide mouth for easy filling and cleaning</li>
                  <li>Fits most car cup holders</li>
                  <li>Condensation-free exterior</li>
                </ul>
              </TabsContent>
              <TabsContent value="specs" className="mt-4">
                <table className="w-full text-left">
                  <tbody>
                    <tr className="border-b">
                      <th className="py-2 pr-4 font-semibold">Capacity</th>
                      <td className="py-2">500ml, 750ml, 1L</td>
                    </tr>
                    <tr className="border-b">
                      <th className="py-2 pr-4 font-semibold">Material</th>
                      <td className="py-2">18/8 Stainless Steel</td>
                    </tr>
                    <tr className="border-b">
                      <th className="py-2 pr-4 font-semibold">Insulation</th>
                      <td className="py-2">Double-wall vacuum</td>
                    </tr>
                    <tr className="border-b">
                      <th className="py-2 pr-4 font-semibold">Lid Type</th>
                      <td className="py-2">Screw-top with carry loop</td>
                    </tr>
                    <tr className="border-b">
                      <th className="py-2 pr-4 font-semibold">
                        Cold Retention
                      </th>
                      <td className="py-2">Up to 24 hours</td>
                    </tr>
                    <tr>
                      <th className="py-2 pr-4 font-semibold">Hot Retention</th>
                      <td className="py-2">Up to 12 hours</td>
                    </tr>
                  </tbody>
                </table>
              </TabsContent>
              <TabsContent value="reviews" className="mt-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-xl font-semibold text-gray-600">
                          JD
                        </span>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold">John Doe</h3>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="w-4 h-4 text-yellow-400"
                          />
                        ))}
                      </div>
                      <p className="text-gray-600 mt-1">
                        Great bottle! Keeps my drinks cold all day.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-xl font-semibold text-gray-600">
                          JS
                        </span>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold">Jane Smith</h3>
                      <div className="flex items-center">
                        {[1, 2, 3, 4].map((star) => (
                          <Star
                            key={star}
                            className="w-4 h-4 text-yellow-400"
                          />
                        ))}
                        {[5].map((star) => (
                          <Star key={star} className="w-4 h-4 text-gray-300" />
                        ))}
                      </div>
                      <p className="text-gray-600 mt-1">
                        Stylish design, but a bit heavy when full.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <div key={product.id} className="group">
                  <div className="aspect-square relative overflow-hidden rounded-lg mb-3">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-600">${product.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 