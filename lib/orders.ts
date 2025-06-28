export interface Order {
  id: string;
  sessionId: string;
  customerEmail?: string;
  customerName?: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  createdAt: Date;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
}

// Simple order storage using localStorage
// In production, this would be replaced with a database
export class OrderManager {
  private static STORAGE_KEY = 'picodarosa_orders';

  static saveOrder(order: Order): void {
    if (typeof window === 'undefined') return;
    
    const orders = this.getAllOrders();
    orders.push(order);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
  }

  static getOrder(sessionId: string): Order | null {
    if (typeof window === 'undefined') return null;
    
    const orders = this.getAllOrders();
    return orders.find(order => order.sessionId === sessionId) || null;
  }

  static getAllOrders(): Order[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading orders:', error);
      return [];
    }
  }

  static updateOrderStatus(sessionId: string, status: Order['status']): void {
    if (typeof window === 'undefined') return;
    
    const orders = this.getAllOrders();
    const orderIndex = orders.findIndex(order => order.sessionId === sessionId);
    
    if (orderIndex !== -1) {
      orders[orderIndex].status = status;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
    }
  }

  static getOrdersByEmail(email: string): Order[] {
    if (typeof window === 'undefined') return [];
    
    const orders = this.getAllOrders();
    return orders.filter(order => order.customerEmail === email);
  }

  static clearOrders(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(this.STORAGE_KEY);
  }
} 