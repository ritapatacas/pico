import { Suspense } from "react"
import ProductClient from "@/components/ProductClient"

export default function ProductPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p>Carregando produto...</p>
        </div>
      </div>
    }>
      <ProductClient />
    </Suspense>
  )
}
