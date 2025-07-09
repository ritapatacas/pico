import productsData from "@/products.json";
import { Products } from "@/components/Products";

export default function ProductsPage() {
  return <Products productsData={productsData} />;
} 