"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import FreshFruitAddPopup, { Product } from "@/components/fresh-fruit-add-popup"
import productsData from "@/products.json"
import TagFilterCloud from "@/components/TagFilterCloud"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ChevronDownIcon } from "lucide-react"

export default function Products() {
  const [search, setSearch] = useState("")
  const [activeFruits, setActiveFruits] = useState<string[]>([])
  const [activeTypes, setActiveTypes] = useState<string[]>([])
  const [displayed, setDisplayed] = useState(8)
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalProduct, setModalProduct] = useState<Product | null>(null)

  // Extrair todas as frutas e tipos únicos
  const allFruits = Array.from(
    new Set(productsData.flatMap(p => p.tagsFruits ?? []))
  ).sort()

  const allTypes = Array.from(
    new Set(productsData.flatMap(p => p.tagsTypes ?? []))
  ).sort()

  // Aplica os filtros combinados: texto, frutas e tipos
  const filtered = productsData.filter(p => {
    const q = search.toLowerCase()

    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      p.key.toLowerCase().includes(q) ||
      Object.values(p.detailsContent || {}).join(" ").toLowerCase().includes(q)

    const matchesFruits =
      activeFruits.length === 0 || activeFruits.every(tag => p.tagsFruits?.includes(tag))

    const matchesTypes =
      activeTypes.length === 0 || activeTypes.every(tag => p.tagsTypes?.includes(tag))

    return matchesSearch && matchesFruits && matchesTypes
  })

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
        displayed < filtered.length &&
        !loading
      ) {
        setLoading(true)
        setTimeout(() => {
          setDisplayed(prev => Math.min(prev + 8, filtered.length))
          setLoading(false)
        }, 500)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [displayed, filtered.length, loading])

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-rotunda-regular text-center mt-10 mb-1">Encomendar</h1>

      {/* divider border */}
      <div className="border-t border-gray-300 mb-4 mx-4" />

      { /* SEARCH BAR */}
      { /*
        <input
          className="w-full mb-4 p-2 border rounded text-sm bg-white text-black"
          placeholder="Pesquisar produtos..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      */}


      { /* FILTERS */}
      <Accordion type="single" collapsible defaultValue="filters" className="">
        <AccordionItem value="filters">
          <AccordionTrigger className="title-rotunda-light text-xs pb-1 gap-2">
            <ChevronDownIcon className="h-3 w-3 shrink-0 transition-transform duration-200 " />
            <span>Filtros</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-row items-center justify-between mx-3 ml-5">

              {/* Filtro por fruta */}
              <div className="mb-4">
                <TagFilterCloud
                  allTags={allFruits}
                  activeTags={activeFruits}
                  onAdd={tag => setActiveFruits([...activeFruits, tag])}
                />
              </div>

              {/* Filtro por tipo */}
              <div className="mb-4">
                <TagFilterCloud
                  allTags={allTypes}
                  activeTags={activeTypes}
                  onAdd={tag => setActiveTypes([...activeTypes, tag])}
                />
              </div>
            </div>

            {/* Chips de filtros ativos */}
            {(activeFruits.length > 0 || activeTypes.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {[...activeFruits.map(tag => ({ tag, type: "fruit" })), ...activeTypes.map(tag => ({ tag, type: "type" }))].map(({ tag, type }) => (
                  <div
                    key={tag}
                    className="flex items-center px-3 py-1.5 rounded-full bg-black text-white text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => {
                        if (type === "fruit") setActiveFruits(activeFruits.filter(t => t !== tag));
                        else setActiveTypes(activeTypes.filter(t => t !== tag));
                      }}
                      className="ml-2 text-white hover:text-gray-300"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Resultados */}
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
                {product.embaladoOptions?.[0]
                  ? `desde ${product.embaladoOptions[0].price.toFixed(2).replace(".", ",")}€`
                  : ""}
              </span>
              <Button
                className="font-burford font-medium m-1 bg-black text-white hover:bg-gray-900 pb-1 px-2"
                size="sm"
                onClick={() => {
                  setModalProduct(product)
                  setModalOpen(true)
                }}
              >
                Adicionar
              </Button>
            </div>
          </div>
        ))}
      </div>

      {loading && <div className="text-center opacity-40">Carregando...</div>}

      {modalProduct && (
        <FreshFruitAddPopup
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          product={modalProduct}
        />
      )}
    </div>
  )
}
