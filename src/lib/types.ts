export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number | null;
  images: string[];
  categoryId: string;
  category: { id: string; name: string; slug: string };
  stock: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  productCount?: number;
  _count?: { products: number };
}

export interface CartItemType {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface CartType {
  id: string;
  sessionId: string;
  items: CartItemType[];
}

export interface OrderType {
  id: string;
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
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  status: string;
  paymentId: string | null;
  items: OrderItemType[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemType {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface ReviewType {
  id: string;
  productId: string;
  rating: number;
  title: string;
  comment: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export type AppView = 'home' | 'checkout' | 'orders' | 'order-detail';
