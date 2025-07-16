"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import FreshFruitAddPopup, { Product } from "@/components/fresh-fruit-add-popup";
import productsData from "@/products.json" // importa aqui


export default function Products({ productsData }: { productsData: Product[] }) {
  const [search, setSearch] = useState("")
  const [products, setProducts] = useState(productsData)
  const [displayed, setDisplayed] = useState(8)
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalProduct, setModalProduct] = useState<Product | null>(null)

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
        displayed < products.length &&
        !loading
      ) {
        setLoading(true)
        setTimeout(() => {
          setDisplayed((prev) => Math.min(prev + 8, products.length))
          setLoading(false)
        }, 500)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [displayed, products.length, loading])

  // Search filter
  const filtered = products.filter((p) => {
    const q = search.toLowerCase()
    return (
      p.name.toLowerCase().includes(q) ||
      p.key.toLowerCase().includes(q) ||
      (p.detailsContent && Object.values(p.detailsContent).join(" ").toLowerCase().includes(q))
    )
  })

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <input
        className="w-full mb-4 p-2 border rounded text-sm"
        placeholder="Pesquisar produtos..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.slice(0, displayed).map(product => (
          <div key={product.key} className="bg-white rounded shadow p-2 flex flex-col">
            <Link href={`/products/${product.key}`} className="flex-1">
              <Image
                src={product.mainImage}
                alt={product.name}
                width={400}
                height={300}
                className="rounded w-full h-40 object-cover mb-2"
              />
              <div className="font-semibold text-lg mb-1">{product.name}</div>
            </Link>
            <div className="flex items-center justify-between mt-2">
              <span className="text-black font-bold text-base">
                {product.embaladoOptions && product.embaladoOptions[0] ? `desde ${product.embaladoOptions[0].price.toFixed(2).replace('.', ',')}€` : ""}
              </span>
              <Button
                className="textbutton font-burford m-1 bg-black text-white hover:bg-gray-900 pb-1"
                size="sm"
                onClick={() => { setModalProduct(product); setModalOpen(true); }}
              >
                Adicionar
              </Button>
            </div>
          </div>
        ))}
      </div>
      {loading && <div className="text-center opacity-40">Carregando...</div>}
      <FreshFruitAddPopup open={modalOpen} onClose={() => setModalOpen(false)} product={modalProduct} />
    </div>
  )
}