'use client';

import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppStore } from '@/lib/store';
import { fetchCategories } from '@/lib/api';
import { Category } from '@/lib/types';
import {
  Monitor,
  Shirt,
  Home,
  BookOpen,
  Dumbbell,
  Sparkles,
  Gamepad2,
  Car,
  LayoutGrid,
} from 'lucide-react';
import { type LucideIcon } from 'lucide-react';

const categoryIcons: Record<string, LucideIcon> = {
  electronics: Monitor,
  fashion: Shirt,
  'home-kitchen': Home,
  books: BookOpen,
  'sports-outdoors': Dumbbell,
  'beauty-personal-care': Sparkles,
  'toys-games': Gamepad2,
  automotive: Car,
};

export default function CategoryBar() {
  const { selectedCategory, setSelectedCategory, setSearchQuery } =
    useAppStore();

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const handleCategoryClick = (slug: string) => {
    setSelectedCategory(slug);
    setSearchQuery('');
  };

  return (
    <div className="border-b bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="scrollbar-thin flex items-center gap-2 overflow-x-auto py-3">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-28 shrink-0 rounded-full" />
            ))
          ) : (
            <>
              <Button
                variant={selectedCategory === '' ? 'default' : 'outline'}
                size="sm"
                className={
                  selectedCategory === ''
                    ? 'rounded-full bg-amber-500 text-white hover:bg-amber-600 shrink-0 ring-2 ring-amber-500/30 shadow-sm transition-all duration-200'
                    : 'rounded-full shrink-0 hover:scale-105 transition-all duration-200'
                }
                onClick={() => handleCategoryClick('')}
              >
                <LayoutGrid className="size-3.5 mr-1.5" />
                All
              </Button>
              {categories?.map((cat: Category) => {
                const Icon = categoryIcons[cat.slug] || Sparkles;
                const isActive = selectedCategory === cat.slug;
                return (
                  <Button
                    key={cat.id}
                    variant={isActive ? 'default' : 'outline'}
                    size="sm"
                    className={
                      isActive
                        ? 'rounded-full bg-amber-500 text-white hover:bg-amber-600 shrink-0 ring-2 ring-amber-500/30 shadow-sm transition-all duration-200'
                        : 'rounded-full shrink-0 hover:scale-105 transition-all duration-200'
                    }
                    onClick={() => handleCategoryClick(cat.slug)}
                  >
                    <Icon className="size-3.5 mr-1.5" />
                    {cat.name}
                  </Button>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
