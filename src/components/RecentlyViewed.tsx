'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';
import { fetchProductsByIds } from '@/lib/api';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

export default function RecentlyViewed() {
  const { recentlyViewed, setSelectedProductId } = useAppStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Efficiently fetch only recently viewed products by their IDs
  const { data: products } = useQuery({
    queryKey: ['recently-viewed-products', recentlyViewed.join(',')],
    queryFn: () => fetchProductsByIds(recentlyViewed),
    enabled: recentlyViewed.length > 0,
  });

  if (!products || products.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -220 : 220;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recently Viewed</h2>
        <div className="flex gap-1">
          <button
            onClick={() => scroll('left')}
            className="size-8 flex items-center justify-center rounded-full border hover:bg-muted transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="size-8 flex items-center justify-center rounded-full border hover:bg-muted transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="scrollbar-thin flex gap-4 overflow-x-auto pb-2"
      >
        {products.map((product) => (
          <Card
            key={product.id}
            className="shrink-0 w-44 cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-md py-0 gap-0"
            onClick={() => setSelectedProductId(product.id)}
          >
            <div className="aspect-square overflow-hidden bg-zinc-100">
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="size-full object-cover transition-transform duration-200 hover:scale-105"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-zinc-300">
                  <Star className="size-8" />
                </div>
              )}
            </div>
            <CardContent className="p-2.5">
              <h4 className="text-xs font-medium line-clamp-2 leading-tight min-h-[2rem]">
                {product.name}
              </h4>
              <p className="text-sm font-bold mt-1">
                ${product.price.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
