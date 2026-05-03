'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  ArrowLeft,
  Check,
  CreditCard,
  MapPin,
  ClipboardList,
  Loader2,
  ShoppingCart,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { fetchCart, createOrder } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const shippingSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'ZIP code is required'),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().optional(),
});

const paymentSchema = z.object({
  cardNumber: z
    .string()
    .min(16, 'Please enter a valid card number')
    .max(19, 'Please enter a valid card number'),
});

type ShippingForm = z.infer<typeof shippingSchema>;
type PaymentForm = z.infer<typeof paymentSchema>;

const STEPS = [
  { id: 1, label: 'Shipping', icon: MapPin },
  { id: 2, label: 'Payment', icon: CreditCard },
  { id: 3, label: 'Review', icon: ClipboardList },
];

// Confetti colors for celebration animation
const CONFETTI_COLORS = ['#f59e0b', '#f97316', '#ef4444', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];

export default function CheckoutView() {
  const [step, setStep] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const { sessionId, setView, setSelectedOrderId } = useAppStore();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: cart } = useQuery({
    queryKey: ['cart', sessionId],
    queryFn: () => fetchCart(sessionId),
    enabled: !!sessionId,
  });

  const items = cart?.items ?? [];

  // Redirect to home if cart is empty
  useEffect(() => {
    if (cart !== undefined && cart !== null && items.length === 0) {
      setView('home');
      toast({
        title: 'Cart is empty',
        description: 'Add items to your cart before checking out.',
      });
    }
  }, [cart, items.length, setView, toast]);
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08;
  const shipping = subtotal >= 50 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  const shippingForm = useForm<ShippingForm>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
      phone: '',
    },
  });

  const paymentForm = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: '',
    },
  });

  const handleOrderSuccess = useCallback((order: { id: string }) => {
    queryClient.invalidateQueries({ queryKey: ['cart', sessionId] });
    queryClient.invalidateQueries({ queryKey: ['orders', sessionId] });
    queryClient.invalidateQueries({ queryKey: ['products'] });

    // Show confetti celebration
    setShowConfetti(true);

    // Redirect after a short celebration delay
    setTimeout(() => {
      setSelectedOrderId(order.id);
      setView('order-detail');
      toast({
        title: 'Order placed!',
        description: `Your order #${order.id.slice(-8).toUpperCase()} has been placed successfully.`,
      });
    }, 1500);
  }, [queryClient, sessionId, setSelectedOrderId, setView, toast]);

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: handleOrderSuccess,
    onError: (error: Error) => {
      toast({
        title: 'Order Failed',
        description: error.message || 'Failed to place order. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const onShippingSubmit = (data: ShippingForm) => {
    void data;
    setStep(2);
  };

  const onPaymentSubmit = (data: PaymentForm) => {
    void data;
    setStep(3);
  };

  const onPlaceOrder = () => {
    const shippingData = shippingForm.getValues();
    createOrderMutation.mutate({
      sessionId,
      email: shippingData.email,
      firstName: shippingData.firstName,
      lastName: shippingData.lastName,
      address: shippingData.address,
      city: shippingData.city,
      state: shippingData.state,
      zipCode: shippingData.zipCode,
      country: shippingData.country,
      phone: shippingData.phone || '',
      paymentId: `sim_${Date.now()}`,
    });
  };

  const shippingValues = shippingForm.getValues();

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6">
      {/* Confetti celebration overlay */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
          >
            {/* Confetti pieces */}
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="confetti-piece"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-5%',
                  backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                  animationDuration: `${1.5 + Math.random() * 2}s`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  width: `${6 + Math.random() * 6}px`,
                  height: `${6 + Math.random() * 6}px`,
                  borderRadius: Math.random() > 0.5 ? '50%' : '1px',
                }}
              />
            ))}
            {/* Success checkmark */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="relative z-10"
            >
              <div className="size-24 rounded-full bg-green-500 flex items-center justify-center shadow-2xl shadow-green-500/30">
                <Check className="size-12 text-white success-check" strokeWidth={3} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back button */}
      <Button
        variant="ghost"
        className="mb-4 gap-2"
        onClick={() => setView('home')}
      >
        <ArrowLeft className="size-4" />
        Back to Shopping
      </Button>

      {/* Progress Steps */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {STEPS.map((s, i) => {
          const isCompleted = step > s.id;
          const isActive = step === s.id;
          const StepIcon = isCompleted ? Check : s.icon;
          return (
            <div key={s.id} className="flex items-center gap-2">
              <motion.div
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isCompleted
                    ? 'bg-green-500 text-white shadow-sm shadow-green-500/20'
                    : isActive
                    ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/20'
                    : 'bg-muted text-muted-foreground'
                }`}
                animate={{
                  scale: isActive ? 1.05 : 1,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 20,
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isCompleted ? 'check' : s.id}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{
                      scale: isCompleted ? [1, 1.3, 1] : 1,
                      opacity: 1,
                    }}
                    transition={{
                      scale: {
                        duration: 0.4,
                        ease: 'easeInOut',
                      },
                      opacity: { duration: 0.2 },
                    }}
                  >
                    <StepIcon className="size-4" />
                  </motion.div>
                </AnimatePresence>
                <span className="hidden sm:inline">{s.label}</span>
              </motion.div>
              {i < STEPS.length - 1 && (
                <motion.div
                  className="h-0.5 w-8 sm:w-16 rounded-full overflow-hidden bg-muted"
                  initial={{ opacity: 1 }}
                >
                  <motion.div
                    className={`h-full ${step > s.id ? 'bg-green-500' : 'bg-amber-500'}`}
                    initial={{ width: '0%' }}
                    animate={{
                      width: step > s.id ? '100%' : '0%',
                    }}
                    transition={{
                      duration: 0.5,
                      ease: 'easeInOut',
                    }}
                  />
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form area */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <Form {...shippingForm}>
              <form
                onSubmit={shippingForm.handleSubmit(onShippingSubmit)}
                className="space-y-4"
              >
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <MapPin className="size-5 text-amber-500" />
                  Shipping Information
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={shippingForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={shippingForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={shippingForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={shippingForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={shippingForm.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="New York" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={shippingForm.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="NY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={shippingForm.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP Code</FormLabel>
                        <FormControl>
                          <Input placeholder="10001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={shippingForm.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="US" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={shippingForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Phone (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-amber-500 text-white hover:bg-amber-600"
                  size="lg"
                >
                  Continue to Payment
                </Button>
              </form>
            </Form>
          )}

          {step === 2 && (
            <Form {...paymentForm}>
              <form
                onSubmit={paymentForm.handleSubmit(onPaymentSubmit)}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <CreditCard className="size-5 text-amber-500" />
                    Payment Information
                  </h2>
                  {/* Secure badge */}
                  <div className="flex items-center gap-1.5 rounded-full bg-green-50 dark:bg-green-950/30 px-3 py-1.5 text-xs font-medium text-green-700 dark:text-green-400">
                    <Lock className="size-3" />
                    Secure Checkout
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  This is a demo - no real payment will be processed.
                </p>
                <FormField
                  control={paymentForm.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="4242 4242 4242 4242"
                          maxLength={19}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="bg-amber-500 text-white hover:bg-amber-600"
                  >
                    Review Order
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <ClipboardList className="size-5 text-amber-500" />
                Review Your Order
              </h2>

              {/* Shipping summary card */}
              <div className="rounded-lg border p-4 transition-shadow hover:shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <MapPin className="size-4 text-amber-500" />
                    Shipping Address
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                    onClick={() => setStep(1)}
                  >
                    Edit
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {shippingValues.firstName} {shippingValues.lastName}
                  <br />
                  {shippingValues.address}
                  <br />
                  {shippingValues.city}, {shippingValues.state}{' '}
                  {shippingValues.zipCode}
                  <br />
                  {shippingValues.country}
                  <br />
                  {shippingValues.email}
                </p>
              </div>

              {/* Payment summary card */}
              <div className="rounded-lg border p-4 transition-shadow hover:shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <CreditCard className="size-4 text-amber-500" />
                    Payment Method
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                    onClick={() => setStep(2)}
                  >
                    Edit
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-full bg-green-50 dark:bg-green-950/30 px-2.5 py-1 text-xs font-medium text-green-700 dark:text-green-400">
                    <ShieldCheck className="size-3" />
                    Secured
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Card ending in{' '}
                    {paymentForm.getValues('cardNumber').slice(-4)}
                  </p>
                </div>
              </div>

              {/* Items - Card-style layout */}
              <div className="rounded-lg border p-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <ShoppingCart className="size-4 text-amber-500" />
                  Items ({items.length})
                </h3>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-lg bg-muted/30 p-3 transition-shadow hover:shadow-sm"
                    >
                      <div className="size-14 shrink-0 rounded-md bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                        {item.product.images?.[0] && (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="size-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.product.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                          {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                            <Badge variant="secondary" className="text-[10px] bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400 px-1.5 py-0">
                              Sale
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        {item.quantity > 1 && (
                          <p className="text-[10px] text-muted-foreground">
                            ${item.product.price.toFixed(2)} each
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button
                  className="bg-amber-500 text-white hover:bg-amber-600 shine"
                  size="lg"
                  disabled={createOrderMutation.isPending}
                  onClick={onPlaceOrder}
                >
                  {createOrderMutation.isPending ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <Lock className="size-4 mr-2" />
                      Place Order - ${total.toFixed(2)}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-lg border p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <ShoppingCart className="size-4 text-amber-500" />
              Order Summary
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})
                </span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400"
                    >
                      FREE
                    </Badge>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-base">
                <span>Total</span>
                <span className="text-amber-600">${total.toFixed(2)}</span>
              </div>
            </div>
            {/* Security badge */}
            <div className="mt-4 flex items-center justify-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5 text-green-600" />
              <span>256-bit SSL encrypted checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
