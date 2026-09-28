import {
  Product,
  CategoryItem,
  User,
  Order,
  CartItem,
  ProductReview,
  Coupon,
  OrderStatus,
  CustomizationData,
  ProductDesign,
} from '../types';
import {
  CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_USERS,
  INITIAL_REVIEWS,
  INITIAL_COUPONS,
} from '../data/initialData';

// Storage keys
const DB_KEYS = {
  PRODUCTS: 'pp_store_products_v2',
  CATEGORIES: 'pp_store_categories_v2',
  USERS: 'pp_store_users_v2',
  ORDERS: 'pp_store_orders_v2',
  CART: 'pp_store_cart_v2',
  WISHLIST: 'pp_store_wishlist_v2',
  REVIEWS: 'pp_store_reviews_v2',
  COUPONS: 'pp_store_coupons_v2',
  CURRENT_USER: 'pp_store_current_user_v2',
};

// Helper for SHA-256 password hashing
export async function hashPassword(password: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'petal_print_secure_salt_2026');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Fallback simple deterministic hash
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      hash = (hash << 5) - hash + password.charCodeAt(i);
      hash |= 0;
    }
    return 'fallback_' + Math.abs(hash).toString(16);
  }
}

// Initializer
function getStored<T>(key: string, defaultVal: T): T {
  try {
    const data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return JSON.parse(data) as T;
  } catch {
    return defaultVal;
  }
}

function setStored<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error('Failed to write to localStorage', err);
  }
}

// Database Service Singleton
export const db = {
  // PRODUCTS
  getProducts(): Product[] {
    return getStored<Product[]>(DB_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },

  getProductById(id: string): Product | undefined {
    const products = this.getProducts();
    return products.find((p) => p.id === id || p.slug === id);
  },

  addProduct(newProd: Omit<Product, 'id'>): Product {
    const products = this.getProducts();
    const product: Product = {
      ...newProd,
      id: 'prod-' + Date.now(),
    };
    products.unshift(product);
    setStored(DB_KEYS.PRODUCTS, products);
    return product;
  },

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const products = this.getProducts();
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    products[idx] = { ...products[idx], ...updates };
    setStored(DB_KEYS.PRODUCTS, products);
    return products[idx];
  },

  deleteProduct(id: string): boolean {
    const products = this.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    if (filtered.length === products.length) return false;
    setStored(DB_KEYS.PRODUCTS, filtered);
    return true;
  },

  // CATEGORIES
  getCategories(): CategoryItem[] {
    return getStored<CategoryItem[]>(DB_KEYS.CATEGORIES, CATEGORIES);
  },

  // USERS & AUTH
  getUsers(): User[] {
    return getStored<User[]>(DB_KEYS.USERS, INITIAL_USERS);
  },

  async findUserByEmailOrUsername(identifier: string): Promise<User | undefined> {
    const users = this.getUsers();
    const lower = identifier.toLowerCase().trim();
    return users.find(
      (u) => u.email.toLowerCase() === lower || u.username.toLowerCase() === lower
    );
  },

  async registerUser(userData: {
    fullName: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    address: { street: string; city: string; state: string; pincode: string; country: string };
  }): Promise<{ success: boolean; user?: User; error?: string }> {
    const users = this.getUsers();
    const emailExists = users.some(
      (u) => u.email.toLowerCase() === userData.email.toLowerCase().trim()
    );
    if (emailExists) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const usernameExists = users.some(
      (u) => u.username.toLowerCase() === userData.username.toLowerCase().trim()
    );
    if (usernameExists) {
      return { success: false, error: 'This username is already taken. Please choose another.' };
    }

    const passwordHash = await hashPassword(userData.password);
    const newUser: User = {
      id: 'usr-' + Date.now(),
      fullName: userData.fullName.trim(),
      username: userData.username.trim().toLowerCase(),
      email: userData.email.trim().toLowerCase(),
      phone: userData.phone.trim(),
      passwordHash,
      address: userData.address,
      role: 'customer',
      createdAt: new Date().toISOString().split('T')[0],
    };

    users.push(newUser);
    setStored(DB_KEYS.USERS, users);
    return { success: true, user: newUser };
  },

  async loginUser(
    identifier: string,
    passwordAttempt: string
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    const user = await this.findUserByEmailOrUsername(identifier);
    if (!user) {
      return { success: false, error: 'No account found with this email or username.' };
    }

    const hashedAttempt = await hashPassword(passwordAttempt);
    // Support either real hash match or fallback default accounts
    const isDefaultAdmin =
      identifier === 'admin@petalandprint.com' && passwordAttempt === 'admin123';
    const isDefaultCustomer =
      identifier === 'sharonblessgadi@gmail.com' && passwordAttempt === 'customer123';

    if (user.passwordHash === hashedAttempt || isDefaultAdmin || isDefaultCustomer) {
      setStored(DB_KEYS.CURRENT_USER, user);
      return { success: true, user };
    }

    return { success: false, error: 'Incorrect password. Please verify and try again.' };
  },

  getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(DB_KEYS.CURRENT_USER);
      return data ? (JSON.parse(data) as User) : null;
    } catch {
      return null;
    }
  },

  setCurrentUser(user: User | null): void {
    if (user) {
      setStored(DB_KEYS.CURRENT_USER, user);
    } else {
      localStorage.removeItem(DB_KEYS.CURRENT_USER);
    }
  },

  updateUserProfile(userId: string, updates: Partial<User>): User | null {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...updates };
    setStored(DB_KEYS.USERS, users);
    this.setCurrentUser(users[idx]);
    return users[idx];
  },

  // ORDERS
  getOrders(): Order[] {
    return getStored<Order[]>(DB_KEYS.ORDERS, [
      {
        id: 'ord-seed-01',
        orderNumber: 'ORD-2026-89421',
        userId: 'usr-demo-01',
        userEmail: 'sharonblessgadi@gmail.com',
        userName: 'Sharon Bless Gadi',
        userPhone: '+91 98450 12345',
        shippingAddress: {
          fullName: 'Sharon Bless Gadi',
          phone: '+91 98450 12345',
          email: 'sharonblessgadi@gmail.com',
          street: '742 Lotus Boulevard, Apt 4B',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560034',
          country: 'India',
        },
        items: [
          {
            id: 'item-seed-1',
            product: INITIAL_PRODUCTS[0],
            selectedDesign: INITIAL_PRODUCTS[0].designs[0],
            customization: {
              recipientName: 'Sharon',
              birthdayDate: '2026-03-28',
              customMessage: 'Happy Birthday to our superstar!',
              preferredColor: 'Classic Red',
            },
            quantity: 1,
            unitPrice: 499,
          },
          {
            id: 'item-seed-2',
            product: INITIAL_PRODUCTS[2],
            selectedDesign: INITIAL_PRODUCTS[2].designs[0],
            customization: {
              recipientName: 'Sharon Gadi',
              birthdayDate: '2026-03-28',
              customMessage: 'Vogue Birthday Issue Edition',
            },
            quantity: 1,
            unitPrice: 799,
          },
        ],
        subtotal: 1298,
        deliveryCharge: 0,
        discount: 150,
        couponCode: 'CELEBRATE',
        tax: 57.4,
        grandTotal: 1205.4,
        paymentMethod: 'upi',
        paymentStatus: 'Paid',
        orderStatus: 'Preparing',
        createdAt: '2026-03-25T14:30:00Z',
        estimatedDeliveryDate: 'March 29, 2026',
        trackingNumber: 'DEL-IND-998241',
      },
    ]);
  },

  getOrdersByUser(userId: string): Order[] {
    const orders = this.getOrders();
    return orders.filter((o) => o.userId === userId);
  },

  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'trackingNumber'>): Order {
    const orders = this.getOrders();
    const randSuffix = Math.floor(10000 + Math.random() * 90000);
    const newOrder: Order = {
      ...orderData,
      id: 'ord-' + Date.now(),
      orderNumber: `ORD-2026-${randSuffix}`,
      createdAt: new Date().toISOString(),
      trackingNumber: `DEL-IND-${Math.floor(100000 + Math.random() * 900000)}`,
    };
    orders.unshift(newOrder);
    setStored(DB_KEYS.ORDERS, orders);
    return newOrder;
  },

  updateOrderStatus(orderId: string, status: OrderStatus): Order | null {
    const orders = this.getOrders();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx === -1) return null;
    orders[idx].orderStatus = status;
    setStored(DB_KEYS.ORDERS, orders);
    return orders[idx];
  },

  // CART
  getCart(): CartItem[] {
    return getStored<CartItem[]>(DB_KEYS.CART, []);
  },

  setCart(cart: CartItem[]): void {
    setStored(DB_KEYS.CART, cart);
  },

  // WISHLIST
  getWishlist(): string[] {
    // Array of product IDs
    return getStored<string[]>(DB_KEYS.WISHLIST, ['prod-rose-bouquet', 'prod-birthday-magazine-standard']);
  },

  toggleWishlist(productId: string): string[] {
    const list = this.getWishlist();
    const exists = list.includes(productId);
    const updated = exists ? list.filter((id) => id !== productId) : [...list, productId];
    setStored(DB_KEYS.WISHLIST, updated);
    return updated;
  },

  // REVIEWS
  getReviews(productId?: string): ProductReview[] {
    const all = getStored<ProductReview[]>(DB_KEYS.REVIEWS, INITIAL_REVIEWS);
    if (!productId) return all;
    return all.filter((r) => r.productId === productId);
  },

  addReview(reviewData: Omit<ProductReview, 'id' | 'date'>): ProductReview {
    const all = this.getReviews();
    const newRev: ProductReview = {
      ...reviewData,
      id: 'rev-' + Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    };
    all.unshift(newRev);
    setStored(DB_KEYS.REVIEWS, all);

    // Also update product rating average
    const product = this.getProductById(reviewData.productId);
    if (product) {
      const prodRevs = all.filter((r) => r.productId === reviewData.productId);
      const avg = prodRevs.reduce((acc, r) => acc + r.rating, 0) / prodRevs.length;
      this.updateProduct(product.id, {
        rating: Math.round(avg * 10) / 10,
        reviewCount: prodRevs.length,
      });
    }

    return newRev;
  },

  // COUPONS
  getCoupons(): Coupon[] {
    return getStored<Coupon[]>(DB_KEYS.COUPONS, INITIAL_COUPONS);
  },

  applyCoupon(code: string, subtotal: number): { valid: boolean; discount: number; message: string } {
    const coupons = this.getCoupons();
    const matched = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!matched) {
      return { valid: false, discount: 0, message: 'Invalid coupon code. Try WELCOME10 or CELEBRATE.' };
    }
    if (subtotal < matched.minOrderValue) {
      return {
        valid: false,
        discount: 0,
        message: `This coupon requires a minimum cart value of ₹${matched.minOrderValue}.`,
      };
    }
    let discount = 0;
    if (matched.discountPercent) {
      discount = Math.round((subtotal * matched.discountPercent) / 100);
    } else if (matched.discountAmount) {
      discount = matched.discountAmount;
    }
    return {
      valid: true,
      discount,
      message: `Coupon "${matched.code}" applied! You saved ₹${discount}.`,
    };
  },
};
