"use client";

import { useDevice } from "./DeviceProvider";

export function MobileFirstLoader() {
  const { isLoading, isMobile } = useDevice();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        
        { /* Loading spinner */ }
        <div className="relative">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-wine rounded-full animate-spin" />
        </div>
        
      </div>
    </div>
  );
} 