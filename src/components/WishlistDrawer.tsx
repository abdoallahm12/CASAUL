'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Heart, X, ShoppingBag, ShoppingCart } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { fetchProductsByIds, addToCart } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function WishlistDrawer() {
  const { wishlist, wishlistOpen, setWishlistOpen, toggleWishlist, sessionId } =
    useAppStore();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Efficiently fetch only wishlisted products by their IDs
  const { data: products, isLoading } = useQuery({
    queryKey: ['wishlist-products', wishlist.join(',')],
    queryFn: () => fetchProductsByIds(wishlist),
    enabled: wishlistOpen && wishlist.length > 0,
  });

  const addToCartMutation = useMutation({
    mutationFn: (productId: string) => addToCart(sessionId, productId, 1),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', sessionId] });
      toast({
        title: 'Added to cart!',
        description: 'Item has been added to your cart.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart.',
        variant: 'destructive',
      });
    },
  });

  return (
    <Sheet open={wishlistOpen} onOpenChange={setWishlistOpen}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Heart className="size-5 text-red-500" />
            Wishlist
            {wishlist.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({wishlist.length} item{wishlist.length !== 1 ? 's' : ''})
              </span>
            )}
          </SheetTitle>
          <SheetDescription>
            {wishlist.length === 0
              ? 'Your wishlist is empty'
              : 'Products you\'ve saved for later'}
          </SheetDescription>
        </SheetHeader>

        {wishlist.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 py-10">
            <Heart className="size-16 text-muted-foreground/30" />
            <p className="text-muted-foreground">Your wishlist is empty</p>
            <p className="text-sm text-muted-foreground/70">
              Click the heart icon on products to save them here
            </p>
            <Button
              variant="outline"
              onClick={() => setWishlistOpen(false)}
              className="gap-2"
            >
              Browse Products
            </Button>
          </div>
        ) : isLoading ? (
          <div className="flex-1 overflow-y-auto py-2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3 rounded-lg border p-3">
                <Skeleton className="size-20 shrink-0 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Wishlist Items */}
            <div className="scrollbar-thin flex-1 overflow-y-auto -mx-6 px-6">
              <div className="space-y-4 py-2">
                {products?.map((product) => {
                  const imageUrl = product.images?.[0] || '';
                  return (
                    <div
                      key={product.id}
                      className="flex gap-3 rounded-lg border p-3"
                    >
                      {/* Thumbnail */}
                      <div
                        className="size-20 shrink-0 overflow-hidden rounded-md bg-zinc-100 cursor-pointer"
                        onClick={() => {
                          setWishlistOpen(false);
                          useAppStore
                            .getState()
                            .setSelectedProductId(product.id);
                        }}
                      >
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="size-full object-cover"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center text-zinc-300">
                            <ShoppingBag className="size-8" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex flex-1 flex-col justify-between min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4
                            className="text-sm font-medium line-clamp-2 leading-tight cursor-pointer hover:text-amber-600 transition-colors"
                            onClick={() => {
                              setWishlistOpen(false);
                              useAppStore
                                .getState()
                                .setSelectedProductId(product.id);
                            }}
                          >
                            {product.name}
                          </h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-6 shrink-0 text-muted-foreground hover:text-red-500"
                            onClick={() => {
                              toggleWishlist(product.id);
                              toast({
                                title: 'Removed from Wishlist',
                                description: `${product.name} has been removed.`,
                              });
                            }}
                          >
                            <X className="size-3.5" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm font-semibold">
                            ${product.price.toFixed(2)}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 gap-1 text-xs"
                            onClick={() => addToCartMutation.mutate(product.id)}
                            disabled={addToCartMutation.isPending}
                          >
                            <ShoppingCart className="size-3" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            <SheetFooter className="gap-2 sm:flex-col">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setWishlistOpen(false)}
              >
                Continue Shopping
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
