/* ──────────────────────────────────────────────────────
 *  MM Sri Lanka – Shared TypeScript types & interfaces
 * ────────────────────────────────────────────────────── */

// ─── Address ────────────────────────────────────────────
export interface Address {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  district: string;
  postalCode: string;
}

// ─── Product Ratings ────────────────────────────────────
export interface ProductRatings {
  average: number;
  count: number;
}

// ─── Product ────────────────────────────────────────────
export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice: number;
  category: string;
  subcategory?: string;
  brand: string;
  images: string[];
  specifications: Record<string, string>;
  stock: number;
  sku: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  ratings: ProductRatings;
  reviews?: any[];
  tags?: string[];
  warranty?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Product (form / creation – no _id or timestamps) ──
export type ProductInput = Omit<Product, "_id" | "createdAt" | "updatedAt">;

// ─── Category ───────────────────────────────────────────
export interface Category {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  description: string;
  productCount: number;
}

// ─── User ───────────────────────────────────────────────
export type UserRole = "user" | "admin";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  addresses: Address[];
  wishlist: string[];
  createdAt: string;
}

// ─── Cart Item ──────────────────────────────────────────
export interface CartItem {
  product: Product;
  quantity: number;
}

// ─── Order Item ─────────────────────────────────────────
export interface OrderItem {
  product: string | Product;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

// ─── Order ──────────────────────────────────────────────
export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod =
  | "cod"
  | "bank_transfer"
  | "card";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

export interface Order {
  _id: string;
  user: string | User;
  items: OrderItem[];
  shippingAddress: Address;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  trackingNumber: string;
  createdAt: string;
}

// ─── Review ─────────────────────────────────────────────
export interface Review {
  _id: string;
  user: string | User;
  product: string | Product;
  rating: number;
  comment: string;
  createdAt: string;
}

// ─── API Response Wrappers ──────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ─── Filter / Sort helpers for product listing ──────────
export interface ProductFilters {
  category?: string;
  subcategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  search?: string;
}

export type SortOption =
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc"
  | "newest"
  | "rating";

// ─── Stock Status (returned by getStockStatus util) ─────
export interface StockStatus {
  label: string;
  color: string;
}

// ─── FilterState (for catalog filters) ───────────────────
export interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: { min: number; max: number };
  minRating: number;
  inStockOnly: boolean;
}
