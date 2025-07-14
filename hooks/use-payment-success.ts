import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/contexts/cart-context';

export function usePaymentSuccess() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  useEffect(() => {
    const success = searchParams.get('success');
    const sessionId = searchParams.get('session_id');

    if (success === 'true' && sessionId) {
      console.log('Payment success detected, clearing cart...');
      
      // Clear cart after successful payment
      clearCart();
      
      // Clear shipping data
      try {
        localStorage.removeItem('shipping');
      } catch (error) {
        console.error('Error clearing shipping data:', error);
      }
    }
  }, [searchParams, clearCart]);
} 