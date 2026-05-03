'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { fetchOrders } from '@/lib/api';
import type { OrderType } from '@/lib/types';

const statusConfig: Record<
  string,
  { icon: React.ElementType; className: string }
> = {
  pending: { icon: Clock, className: 'bg-yellow-100 text-yellow-800' },
  processing: { icon: Package, className: 'bg-blue-100 text-blue-800' },
  shipped: { icon: Truck, className: 'bg-purple-100 text-purple-800' },
  delivered: { icon: CheckCircle2, className: 'bg-green-100 text-green-800' },
  cancelled: { icon: XCircle, className: 'bg-red-100 text-red-800' },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function OrdersView() {
  const { sessionId, setView, setSelectedOrderId } = useAppStore();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', sessionId],
    queryFn: () => fetchOrders(sessionId),
    enabled: !!sessionId,
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <Button
        variant="ghost"
        className="mb-4 gap-2"
        onClick={() => setView('home')}
      >
        <ArrowLeft className="size-4" />
        Back to Shopping
      </Button>

      <h1 className="mb-6 text-2xl font-bold">Order History</h1>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg border p-4">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="mt-2 h-4 w-24" />
              <div className="mt-3 flex gap-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package className="mb-4 size-16 text-muted-foreground/30" />
          <h3 className="text-lg font-semibold text-muted-foreground">
            No orders yet
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Start shopping to see your orders here.
          </p>
          <Button
            className="mt-4 bg-amber-500 text-white hover:bg-amber-600"
            onClick={() => setView('home')}
          >
            Start Shopping
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: OrderType) => {
            const config = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = config.icon;
            return (
              <button
                key={order.id}
                className="w-full rounded-lg border p-4 text-left transition-colors hover:bg-accent/50"
                onClick={() => {
                  setSelectedOrderId(order.id);
                  setView('order-detail');
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`gap-1 ${config.className}`}
                  >
                    {order.status === 'pending' ? (
                      <motion.span
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      >
                        <StatusIcon className="size-3" />
                      </motion.span>
                    ) : (
                      <StatusIcon className="size-3" />
                    )}
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </Badge>
                </div>
                <Separator className="my-3" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </span>
                  <span className="font-semibold">${order.total.toFixed(2)}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
