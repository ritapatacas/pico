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

export default function Home() {
  const { addToCart } = useCart()
  const router = useRouter();

  const [selectedSize, setSelectedSize] = useState("250g")
  const [isFavorite, setIsFavorite] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [packagingType, setPackagingType] = useState("embalado")
  const [kiloQuantity, setKiloQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState("/mirtilo_embalagem.jpeg")
  const [tab, setTab] = useState("detalhes")

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
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">



        <section className="relative h-[900px] md:h-[700px] overflow-hidden h-full">
          <Image
            src="/mirtilo.png"
            alt="Mirtilo background"
            width={1920}
            height={700}
            className="absolute inset-0 object-cover w-full h-full"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />

          <div className="container relative z-10 flex flex-col items-start justify-center h-full mt-10 px-10 mx-auto space-y-6 text-white">

            {/* Product Info */}
            <div className="bigcard flex flex-col md:flex-row justify-center items-center gap-8 w-full p-4 md:p-20">

              <div id="desc" className="w-full lg:w-3/4 xl:w-2/3 pl-0 md:pl-20 mb-6 md:mb-0">

                <div className="lg:w-1/2">
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                    Mirtilos
                  </h1>
                  <span className="text-l text-gray-200 font-semibold">
                    desde 1,25€
                  </span>
                </div>

                <div className="text text-lg mt-4">
                  <p><b>Mirtilos embalados e a granel</b></p>
                  <p className="mt-2">
                    <span>
                      Variedades: Duke e Emerald
                      <br />
                      Localização: Pedrógão Grande
                      <br />
                      Modo de Produção: Agricultura Integrada
                      <br />
                      Época de colheita: maio a setembro
                    </span>
                  </p>
                </div>

              </div>




              <div id="product-form" className="pb-10">


                <Card className="bg-gray-200 opacity-80 text-black overflow-hidden transition-all hover:shadow-lg w-[70vw] h-auto min-h-[360px] flex flex-col justify-between md:mr-40">

                  <CardContent className="flex flex-col flex-grow ">

                    {/* Conteúdo principal com separação interna */}
                    <div className="flex flex-col justify-between h-full">

                      {/* Tipo de embalagem */}
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Formato</h3>
                        <div className="flex flex-wrap gap-2">
                          {/* Embalado */}
                          <label className={`cursor-pointer px-3 py-1 rounded flex items-center justify-center border-2 text-sm font-semibold transition-all ${packagingType === "embalado" ? "border-black bg-black text-white" : "border-gray-200 hover:border-gray-300"}`}>
                            <input type="radio" name="packagingType" value="embalado" checked={packagingType === "embalado"} onChange={(e) => setPackagingType(e.target.value)} className="sr-only" />
                            embalado
                          </label>

                          {/* Granel */}
                          <label className={`cursor-pointer px-3 py-1 rounded flex items-center justify-center border-2 text-sm font-semibold transition-all ${packagingType === "granel" ? "border-black bg-black text-white" : "border-gray-200 hover:border-gray-300"}`}>
                            <input type="radio" name="packagingType" value="granel" checked={packagingType === "granel"} onChange={(e) => setPackagingType(e.target.value)} className="sr-only" />
                            granel
                          </label>
                        </div>
                      </div>

                      {/* Embalado */}
                      {packagingType === "embalado" && (
                        <div className="flex flex-col justify-between h-full mt-4">
                          <div>
                            <h2 className="text-md font-semibold mb-2">Tamanho</h2>
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
                            embalagem de {getSelectedEmbaladoOption(selectedSize).size} - {getSelectedEmbaladoOption(selectedSize).price.toFixed(2).replace(".", ",")}€ ({getSelectedEmbaladoOption(selectedSize).kgPrice.toFixed(2).replace(".", ",")}€/kg)
                          </div>
                        </div>
                      )}

                      {/* Granel */}
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
                                className="w-full h-2 cursor-pointer appearance-none rounded-lg bg-black accent-black"
                              />

                              <span className="text-sm font-semibold">{kiloQuantity.toFixed(1)}kg</span>
                            </div>
                          </div>

                          <div className="text-sm font-semibold mt-4">
                            Preço total: {(kiloQuantity * precoGranelPorKg).toFixed(2).replace(".", ",")}€
                          </div>
                        </div>
                      )}

                    </div>
                  </CardContent>
                  <div className="mx-6 border-t border border-gray-300" />
                  {/* Secção fixa no fundo */}
                  <div className="px-6 flex items-center gap-2">

                    {/* Quantity */}
                    <div className="flex items-center border rounded-md">
                      <Button variant="ghost" size="icon" onClick={decrementQuantity} className="h-4 w-4">
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-6 text-center text-sm font-medium">{quantity}</span>
                      <Button variant="ghost" size="icon" onClick={incrementQuantity} className="h-4 w-4">
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>

                    {/* Add to Cart */}
                    <Button className="flex-grow bg-black text-white hover:bg-gray-900 py-2 text-sm font-medium" onClick={handleAddToCart}>
                      {packagingType === "embalado"
                        ? `Adicionar (${(getSelectedEmbaladoOption(selectedSize).price * quantity).toFixed(2).replace(".", ",")}€)`
                        : `Adicionar (${(kiloQuantity * precoGranelPorKg).toFixed(2).replace(".", ",")}€)`}
                    </Button>

                  </div>
                </Card>


              </div>
            </div>
          </div>

        </section >
        {/* Tabs for "Detalhes" and "Preços" */}
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
              Detalhes
            </button>
            <button
              className={`ml-4 px-4 py-2 text-sm font-medium focus:outline-none ${tab === "precos"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 hover:text-primary"
                }`}
              onClick={() => setTab("precos")}
              type="button"
            >
              Preços
            </button>
          </div>
          <div className="mt-4 px-4 pt-6 pb-30">
            {tab === "detalhes" && (
              <div>
                {/* Conteúdo de detalhes do produto */}
                <h3 className="text-lg font-semibold mb-2">Sobre os Mirtilos</h3>
                <p className="text-sm text-muted-foreground">
                  Os nossos mirtilos são colhidos à mão, frescos e de produção local. Perfeitos para consumo direto, sobremesas ou compotas.
                </p>
              </div>
            )}
            {tab === "precos" && (
              <div>
                {/* Conteúdo de preços */}
                <h3 className="text-lg font-semibold mb-2">Tabela de Preços</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>
                    <span className="font-medium">Embalado:</span>{" "}
                    {embaladoOptions.map(opt => (
                      <span key={opt.size} className="ml-2">
                        {opt.size}g - {opt.price.toFixed(2).replace(".", ",")}€
                      </span>
                    ))}
                  </li>
                  <li>
                    <span className="font-medium">Granel:</span>{" "}
                    {precoGranelPorKg.toFixed(2).replace(".", ",")}€/kg
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        {/*
        <FeaturedDestinations />
        <PopularPackages />
        <Testimonials />
        <Newsletter />
 */}
      </main >
    </div >
  )
}
