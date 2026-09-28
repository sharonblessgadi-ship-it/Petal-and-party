export type CategoryId =
  | 'pipe-cleaner-flowers'
  | 'birthday-magazines'
  | 'handmade-bouquets'
  | 'birthday-gifts'
  | 'customized-gifts'
  | 'gift-boxes'
  | 'flower-collections'
  | 'new-arrivals'
  | 'best-sellers';

export interface CategoryItem {
  id: CategoryId;
  name: string;
  tagline: string;
  image: string;
  count: number;
}

export interface ProductDesign {
  id: string;
  name: string;
  code: string;
  colorName: string;
  colorHexList: string[];
  image: string;
  priceDelta: number; // additional price over base if any (e.g., 0, +50, +100)
  inStock: boolean;
  stockCount: number;
}

export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  userEmail: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  category: CategoryId;
  categories: CategoryId[]; // product can belong to multiple categories (e.g. 'pipe-cleaner-flowers' + 'best-sellers')
  basePrice: number; // e.g. 499
  originalPrice: number; // e.g. 699
  discountPercent: number; // e.g. 28
  rating: number; // e.g. 4.8
  reviewCount: number;
  stock: number;
  inStock: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  featured: boolean;
  images: string[];
  description: string;
  materials: string;
  dimensions: string;
  careInstructions: string;
  dispatchTime: string;
  allowCustomization: boolean;
  customizationFields?: {
    recipientName?: boolean;
    birthdayDate?: boolean;
    customMessage?: boolean;
    preferredColor?: boolean;
  };
  designs: ProductDesign[];
}

export interface UserAddress {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  passwordHash: string; // SHA-256 hashed password string
  address: UserAddress;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface CustomizationData {
  recipientName?: string;
  birthdayDate?: string;
  customMessage?: string;
  preferredColor?: string;
  specialInstructions?: string;
}

export interface CartItem {
  id: string; // composite key: productId + designId + customization hash
  product: Product;
  selectedDesign: ProductDesign;
  customization?: CustomizationData;
  quantity: number;
  unitPrice: number;
}

export type OrderStatus =
  | 'Order Placed'
  | 'Confirmed'
  | 'Preparing'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod' | 'razorpay';

export interface Order {
  id: string;
  orderNumber: string; // e.g. "ORD-2026-89421"
  userId: string;
  userEmail: string;
  userName: string;
  userPhone: string;
  shippingAddress: UserAddress & { fullName: string; phone: string; email: string };
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  couponCode?: string;
  tax: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  orderStatus: OrderStatus;
  createdAt: string;
  estimatedDeliveryDate: string;
  trackingNumber: string;
}

export interface Coupon {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  minOrderValue: number;
  description: string;
}

export type ActivePage =
  | 'home'
  | 'products'
  | 'product-details'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'my-orders'
  | 'wishlist'
  | 'profile'
  | 'about'
  | 'contact'
  | 'admin';
