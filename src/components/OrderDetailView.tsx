'use client';

import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  XCircle,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { fetchOrder } from '@/lib/api';

const statusSteps = [
  { key: 'pending', label: 'Pending', icon: Clock },
  { key: 'processing', label: 'Processing', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

const statusOrder = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function OrderDetailView() {
  const { selectedOrderId, setView } = useAppStore();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', selectedOrderId],
    queryFn: () => fetchOrder(selectedOrderId!),
    enabled: !!selectedOrderId,
  });

  const currentStatusIndex = order
    ? statusOrder.indexOf(order.status)
    : -1;
  const isCancelled = order?.status === 'cancelled';

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <Button
        variant="ghost"
        className="mb-4 gap-2"
        onClick={() => setView('orders')}
      >
        <ArrowLeft className="size-4" />
        Back to Orders
      </Button>

      {isLoading || !order ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-60 w-full" />
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">
                Order #{order.id.slice(-8).toUpperCase()}
              </h1>
              <p className="text-sm text-muted-foreground">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <Badge
              variant="secondary"
              className={`gap-1 w-fit ${
                isCancelled
                  ? 'bg-red-100 text-red-800'
                  : order.status === 'delivered'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {isCancelled ? (
                <XCircle className="size-3" />
              ) : order.status === 'delivered' ? (
                <CheckCircle2 className="size-3" />
              ) : (
                <Clock className="size-3" />
              )}
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>

          {/* Status Timeline */}
          {!isCancelled && (
            <div className="mb-8 rounded-lg border p-4">
              <h3 className="font-semibold mb-4">Order Status</h3>
              <div className="flex items-center justify-between">
                {statusSteps.map((step, i) => {
                  const stepIndex = statusOrder.indexOf(step.key);
                  const isActive = currentStatusIndex >= stepIndex;
                  const StepIcon = step.icon;
                  return (
                    <div key={step.key} className="flex items-center">
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className={`flex size-10 items-center justify-center rounded-full ${
                            isActive
                              ? 'bg-amber-500 text-white'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          <StepIcon className="size-5" />
                        </div>
                        <span
                          className={`text-xs ${
                            isActive
                              ? 'font-medium text-foreground'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                      {i < statusSteps.length - 1 && (
                        <div
                          className={`mx-2 h-0.5 w-8 sm:w-16 ${
                            currentStatusIndex > stepIndex
                              ? 'bg-amber-500'
                              : 'bg-muted'
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold mb-3">
                  Items ({order.items.length})
                </h3>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="size-14 shrink-0 rounded-md bg-zinc-100 overflow-hidden">
                        {item.productImage && (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="size-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.productName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity} &times; ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <span className="text-sm font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold mb-3">Order Total</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>
                      {order.shipping === 0 ? (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800"
                        >
                          FREE
                        </Badge>
                      ) : (
                        `$${order.shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-base">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="size-4" />
                  Shipping Address
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {order.firstName} {order.lastName}
                  <br />
                  {order.address}
                  <br />
                  {order.city}, {order.state} {order.zipCode}
                  <br />
                  {order.country}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Mail className="size-4" />
                  Contact Info
                </h3>
                <p className="text-sm text-muted-foreground">
                  <span>{order.email}</span>
                  {order.phone && (
                    <>
                      <br />
                      <span className="flex items-center gap-1 mt-1">
                        <Phone className="size-3" />
                        {order.phone}
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
