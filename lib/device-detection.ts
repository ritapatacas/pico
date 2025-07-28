import { useState, useEffect } from 'react';

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  userAgent: string;
}

// Função para detecção server-side (usar apenas em Server Components)
export function detectDeviceServerSide(): DeviceInfo {
  // Esta função deve ser chamada apenas em Server Components
  // O User-Agent será obtido via headers() no layout.tsx
  return {
    isMobile: true, // Default mobile-first
    isTablet: false,
    isDesktop: false,
    userAgent: ''
  };
}

// Hook para uso no cliente (fallback)
export function useClientDeviceDetection() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: true, // Default mobile-first
    isTablet: false,
    isDesktop: false,
    userAgent: ''
  });

  useEffect(() => {
    const userAgent = navigator.userAgent;
    
    const mobilePatterns = [
      /Android/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i,
      /webOS/i,
      /Mobile/i,
      /Opera Mini/i,
      /IEMobile/i,
      /Silk/i
    ];
    
    const tabletPatterns = [
      /iPad/i,
      /Android(?!.*Mobile)/i,
      /Tablet/i
    ];
    
    const isTablet = tabletPatterns.some(pattern => pattern.test(userAgent));
    const isMobile = mobilePatterns.some(pattern => pattern.test(userAgent)) || isTablet;
    const isDesktop = !isMobile;
    
    setDeviceInfo({
      isMobile,
      isTablet,
      isDesktop,
      userAgent
    });
  }, []);

  return deviceInfo;
} 