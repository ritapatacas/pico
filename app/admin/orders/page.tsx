"use client";

import { useState, useEffect } from "react";
import { OrderManager, Order } from "@/lib/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Package, Mail, Calendar } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    setLoading(true);
    const allOrders = OrderManager.getAllOrders();
    // Sort by creation date (newest first)
    const sortedOrders = allOrders.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setOrders(sortedOrders);
    setLoading(false);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('pt-BR');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Pedidos</h1>
            <p className="text-gray-600 mt-2">
              {orders.length} pedido{orders.length !== 1 ? 's' : ''} encontrado{orders.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button onClick={loadOrders} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum pedido encontrado
              </h3>
              <p className="text-gray-600">
                Os pedidos aparecerão aqui após serem processados.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Pedido #{order.id.slice(-8)}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(order.createdAt)}
                        </div>
                        {order.customerEmail && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {order.customerEmail}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <span className="text-lg font-bold">
                        {order.amount.toFixed(2)}€
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {order.customerName && (
                      <p><strong>Cliente:</strong> {order.customerName}</p>
                    )}
                    <div>
                      <strong>Itens:</strong>
                      <ul className="mt-1 space-y-1">
                        {order.items.map((item, index) => (
                          <li key={index} className="text-sm text-gray-600">
                            {item.quantity}x {item.name} - {item.price.toFixed(2)}€
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => OrderManager.updateOrderStatus(order.sessionId, 'shipped')}
                        disabled={order.status === 'shipped' || order.status === 'delivered'}
                      >
                        Marcar como Enviado
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => OrderManager.updateOrderStatus(order.sessionId, 'delivered')}
                        disabled={order.status === 'delivered'}
                      >
                        Marcar como Entregue
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 