import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/cart-context";

interface BottomNavBarProps {
  onCartClick: () => void;
}

export function BottomNavBar({ onCartClick }: BottomNavBarProps) {
  const pathname = usePathname();
  const { cartCount } = useCart();

  // Only show on mobile
  // Use fixed bottom bar, visible on all pages
  return (
    <nav className="fixed bottom-0 left-0 w-full h-16 bg-background border-t flex justify-around items-center z-50 md:hidden">
      <Link href="/" className="flex flex-col items-center justify-center flex-1">
        <Home className={`h-6 w-6 ${pathname === "/" ? "text-primary" : "text-muted-foreground"}`} />
        <span className="text-xs">Home</span>
      </Link>
      <Link href="/products" className="flex flex-col items-center justify-center flex-1">
        <Store className={`h-6 w-6 ${pathname.startsWith("/products") ? "text-primary" : "text-muted-foreground"}`} />
        <span className="text-xs">Products</span>
      </Link>
      <button
        onClick={onCartClick}
        className="relative flex flex-col items-center justify-center flex-1 focus:outline-none"
        style={{ minWidth: 44, minHeight: 44 }}
        aria-label="Open cart"
      >
        <ShoppingCart className="h-6 w-6 text-muted-foreground" />
        {cartCount > 0 && (
          <span className="absolute top-1 right-6 bg-primary text-primary-foreground rounded-full px-1.5 text-xs font-bold">
            {cartCount}
          </span>
        )}
        <span className="text-xs">Cart</span>
      </button>
    </nav>
  );
} 