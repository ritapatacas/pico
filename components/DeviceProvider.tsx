"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { DeviceInfo, useClientDeviceDetection } from '@/lib/device-detection';

interface DeviceContextType {
  deviceInfo: DeviceInfo;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLoading: boolean;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export function DeviceProvider({ children, initialDeviceInfo }: { 
  children: ReactNode;
  initialDeviceInfo?: DeviceInfo;
}) {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(
    initialDeviceInfo || {
      isMobile: true, // Default mobile-first
      isTablet: false,
      isDesktop: false,
      userAgent: ''
    }
  );
  const [isLoading, setIsLoading] = useState(true);

  // Use client-side detection as fallback
  const clientDeviceInfo = useClientDeviceDetection();

  useEffect(() => {
    // If we have initial server info, use it
    if (initialDeviceInfo) {
      setDeviceInfo(initialDeviceInfo);
      setIsLoading(false);
    } else {
      // Otherwise, use client detection
      if (clientDeviceInfo.userAgent) {
        setDeviceInfo(clientDeviceInfo);
        setIsLoading(false);
      }
    }
  }, [initialDeviceInfo, clientDeviceInfo.userAgent]);

  const value = {
    deviceInfo,
    isMobile: deviceInfo.isMobile,
    isTablet: deviceInfo.isTablet,
    isDesktop: deviceInfo.isDesktop,
    isLoading
  };

  return (
    <DeviceContext.Provider value={value}>
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevice() {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
} 