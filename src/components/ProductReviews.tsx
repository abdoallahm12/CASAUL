'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Star, MessageSquarePlus, User } from 'lucide-react';
import { fetchReviews, createReview } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface ProductReviewsProps {
  productId: string;
  productRating: number;
  productReviewCount: number;
}

export default function ProductReviews({ productId, productRating, productReviewCount }: ProductReviewsProps) {
  const [showForm, setShowForm] = useState(false);
  const [formRating, setFormRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [formTitle, setFormTitle] = useState('');
  const [formComment, setFormComment] = useState('');
  const [formAuthorName, setFormAuthorName] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => fetchReviews(productId),
  });

  const createReviewMutation = useMutation({
    mutationFn: () =>
      createReview({
        productId,
        rating: formRating,
        title: formTitle,
        comment: formComment,
        authorName: formAuthorName || 'Anonymous',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      toast({ title: 'Review submitted!', description: 'Thank you for your feedback.' });
      setShowForm(false);
      setFormRating(0);
      setFormTitle('');
      setFormComment('');
      setFormAuthorName('');
      setFormErrors({});
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to submit review.', variant: 'destructive' });
    },
  });

  // Calculate rating distribution
  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const percent = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
    return { star, count, percent };
  });

  // Average from fetched reviews (more accurate)
  const avgRating = reviews.length > 0
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
    : productRating;

  const displayRating = reviews.length > 0 ? avgRating : productRating;
  const displayCount = reviews.length > 0 ? reviews.length : productReviewCount;

  const handleSubmit = () => {
    const errors: Record<string, string> = {};
    if (formRating === 0) errors.rating = 'Please select a rating';
    if (formComment.trim().length < 10) errors.comment = 'Comment must be at least 10 characters';
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;
    createReviewMutation.mutate();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="mt-6">
      <Separator className="mb-6" />

      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Reviews</h3>
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
            {displayCount}
          </Badge>
        </div>
        <Button
          size="sm"
          className="bg-amber-500 text-white hover:bg-amber-600 gap-1.5"
          onClick={() => setShowForm(!showForm)}
        >
          <MessageSquarePlus className="size-4" />
          Write a Review
        </Button>
      </div>

      {/* Rating summary */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Average rating display */}
            <div className="flex flex-col items-center justify-center min-w-[100px]">
              <span className="text-4xl font-bold">{displayRating.toFixed(1)}</span>
              <div className="flex items-center gap-0.5 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-4 ${
                      i < Math.round(displayRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-zinc-200 text-zinc-200 dark:fill-zinc-700 dark:text-zinc-700'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground mt-1">
                {displayCount} review{displayCount !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Distribution bars */}
            <div className="flex-1 space-y-1.5">
              {distribution.map(({ star, count, percent }) => (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="w-3 text-right text-muted-foreground">{star}</span>
                  <Star className="size-3 fill-amber-400 text-amber-400" />
                  <div className="flex-1 h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-amber-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                  <span className="w-8 text-xs text-muted-foreground">{percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Write a Review form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Card className="mb-4 border-amber-200 dark:border-amber-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Write a Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Star rating selector */}
                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    Rating <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        className="p-0.5 hover:scale-110 transition-transform"
                        onClick={() => setFormRating(i + 1)}
                        onMouseEnter={() => setHoverRating(i + 1)}
                        onMouseLeave={() => setHoverRating(0)}
                      >
                        <Star
                          className={`size-7 transition-colors ${
                            i < (hoverRating || formRating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-zinc-200 text-zinc-200 dark:fill-zinc-700 dark:text-zinc-700'
                          }`}
                        />
                      </button>
                    ))}
                    {formRating > 0 && (
                      <span className="text-sm text-muted-foreground ml-2">
                        {formRating} of 5
                      </span>
                    )}
                  </div>
                  {formErrors.rating && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.rating}</p>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Title</label>
                  <Input
                    placeholder="Summarize your experience"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    maxLength={100}
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    Comment <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    placeholder="Share your thoughts about this product (min 10 characters)"
                    value={formComment}
                    onChange={(e) => setFormComment(e.target.value)}
                    rows={3}
                    maxLength={1000}
                  />
                  <div className="flex justify-between mt-1">
                    {formErrors.comment ? (
                      <p className="text-xs text-red-500">{formErrors.comment}</p>
                    ) : (
                      <span />
                    )}
                    <span className="text-xs text-muted-foreground">
                      {formComment.length}/1000
                    </span>
                  </div>
                </div>

                {/* Author name */}
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Your Name</label>
                  <Input
                    placeholder="Anonymous"
                    value={formAuthorName}
                    onChange={(e) => setFormAuthorName(e.target.value)}
                    maxLength={50}
                  />
                </div>

                {/* Submit */}
                <div className="flex gap-2">
                  <Button
                    className="bg-amber-500 text-white hover:bg-amber-600"
                    onClick={handleSubmit}
                    disabled={createReviewMutation.isPending}
                  >
                    {createReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setFormErrors({});
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews list */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg border p-4 space-y-2">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-3 w-full rounded bg-muted" />
              <div className="h-3 w-3/4 rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquarePlus className="size-10 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No reviews yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                          <User className="size-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{review.authorName}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`size-3.5 ${
                              i < review.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-zinc-200 text-zinc-200 dark:fill-zinc-700 dark:text-zinc-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.title && (
                      <p className="text-sm font-semibold mt-2">{review.title}</p>
                    )}
                    {review.comment && (
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {review.comment}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
