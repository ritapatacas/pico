"use client";

import { useEffect } from "react"

export default function Modal({ open, onClose, children }: { open: boolean, onClose: () => void, children: React.ReactNode }) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-gray-300/40 rounded-xl shadow-lg mx-2 relative animate-fadeIn inline-block align-middle"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          className="absolute top-2 right-2 text-2xl text-gray-400 hover:text-black"
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </button>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
} 