"use client";
import { usePathname } from "next/navigation";
import { Header } from "@/components/header";

export default function HeaderWithPathname() {
  const pathname = usePathname();
  return <Header isHomePage={pathname === "/"} />;
} 