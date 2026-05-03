import type {
  Product,
  Category,
  CartType,
  OrderType,
  ReviewType,
} from '@/lib/types';

// ─── Search Suggestions ──────────────────────────────────────────────────────

export interface SearchSuggestion {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export async function fetchSearchSuggestions(query: string): Promise<SearchSuggestion[]> {
  if (query.length < 2) return [];
  const res = await fetch(`/api/products/search-suggestions?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Failed to fetch suggestions');
  const data = await res.json();
  return data.suggestions;
}

// ─── Products ────────────────────────────────────────────────────────────────

export async function fetchProducts(params?: {
  search?: string;
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<{ products: Product[]; total: number; page: number; totalPages: number }> {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.set('search', params.search);
  if (params?.category) searchParams.set('category', params.category);
  if (params?.sort) searchParams.set('sort', params.sort);
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));

  const res = await fetch(`/api/products?${searchParams.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchProduct(id: string): Promise<Product> {
  const res = await fetch(`/api/products/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  const data = await res.json();
  return data.product;
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch('/api/categories');
  if (!res.ok) throw new Error('Failed to fetch categories');
  const data = await res.json();
  return data.categories;
}

// ─── Cart ────────────────────────────────────────────────────────────────────

export async function fetchCart(sessionId: string): Promise<CartType | null> {
  const res = await fetch(`/api/cart?sessionId=${encodeURIComponent(sessionId)}`);
  if (!res.ok) throw new Error('Failed to fetch cart');
  const data = await res.json();
  return data.cart;
}

export async function addToCart(
  sessionId: string,
  productId: string,
  quantity: number = 1
): Promise<CartType> {
  const res = await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, productId, quantity }),
  });
  if (!res.ok) throw new Error('Failed to add to cart');
  const data = await res.json();
  return data.cart;
}

export async function updateCartItem(
  sessionId: string,
  productId: string,
  quantity: number
): Promise<CartType> {
  const res = await fetch('/api/cart', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, productId, quantity }),
  });
  if (!res.ok) throw new Error('Failed to update cart item');
  const data = await res.json();
  return data.cart;
}

export async function removeFromCart(
  sessionId: string,
  productId: string
): Promise<CartType> {
  const res = await fetch('/api/cart', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, productId }),
  });
  if (!res.ok) throw new Error('Failed to remove cart item');
  const data = await res.json();
  return data.cart;
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export async function fetchOrders(sessionId: string): Promise<OrderType[]> {
  const res = await fetch(`/api/orders?sessionId=${encodeURIComponent(sessionId)}`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  const data = await res.json();
  return data.orders;
}

export async function fetchOrder(orderId: string): Promise<OrderType> {
  const res = await fetch(`/api/orders/${orderId}`);
  if (!res.ok) throw new Error('Failed to fetch order');
  const data = await res.json();
  return data.order;
}

export async function createOrder(data: {
  sessionId: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  paymentId?: string;
}): Promise<OrderType> {
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Failed to create order' }));
    // Handle out-of-stock errors from the server
    if (errorData.outOfStockItems) {
      const items = errorData.outOfStockItems
        .map((item: { productName: string; requested: number; available: number }) =>
          `${item.productName} (requested: ${item.requested}, available: ${item.available})`
        )
        .join(', ');
      throw new Error(`Some items are out of stock: ${items}`);
    }
    throw new Error(errorData.error || 'Failed to create order');
  }
  const result = await res.json();
  return result.order;
}

// ─── Products by IDs ────────────────────────────────────────────────────────

export async function fetchProductsByIds(ids: string[]): Promise<Product[]> {
  const res = await fetch(`/api/products/by-ids?ids=${ids.join(',')}`);
  if (!res.ok) throw new Error('Failed to fetch products by IDs');
  const data = await res.json();
  return data.products;
}

// ─── Reviews ────────────────────────────────────────────────────────────────

export async function fetchReviews(productId: string): Promise<ReviewType[]> {
  const res = await fetch(`/api/reviews?productId=${encodeURIComponent(productId)}`);
  if (!res.ok) throw new Error('Failed to fetch reviews');
  const data = await res.json();
  return data.reviews;
}

export async function createReview(data: {
  productId: string;
  rating: number;
  title: string;
  comment: string;
  authorName: string;
}): Promise<ReviewType> {
  const res = await fetch('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create review');
  const result = await res.json();
  return result.review;
}
