"use client";

import { useEffect } from "react"
import { createPortal } from "react-dom"


// In your modal component
const handleGoogleSignIn = () => {
  const width = 500;
  const height = 600;
  const left = window.screen.width / 2 - width / 2;
  const top = window.screen.height / 2 - height / 2;

  const popup = window.open(
    '/api/auth/signin/google',
    'GoogleSignIn',
    `width=${width},height=${height},top=${top},left=${left}`
  );

  // Optionally, poll or listen for sign-in completion
  const timer = setInterval(() => {
    if (popup && popup.closed) {
      clearInterval(timer);
      // Optionally, refresh session or UI here
      window.location.reload(); // or use next-auth's getSession()
    }
  }, 500);
};

export default function Modal({ open, onClose, children }: { open: boolean, onClose: () => void, children: React.ReactNode }) {
  console.log('Modal component - open:', open);
  
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) {
    console.log('Modal not rendering - open is false');
    return null;
  }
  
  console.log('Modal rendering with children');
  


  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm" 
      onClick={onClose}
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        className="bg-white rounded-xl shadow-2xl mx-4 relative max-w-2xl w-full max-h-[90vh] overflow-y-auto border"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{ 
          position: 'relative', 
          zIndex: 10000,
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e5e7eb'
        }}
      >
        <button
          className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-black z-10"
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </button>
        <div className="p-6">{children}        </div>
      </div>
    </div>
  );

  // Use createPortal to render modal outside the normal DOM hierarchy
  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  
  
  return modalContent;
} 