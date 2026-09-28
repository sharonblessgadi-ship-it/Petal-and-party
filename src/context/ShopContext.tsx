import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CategoryItem,
  User,
  Order,
  CartItem,
  ProductDesign,
  CustomizationData,
  Coupon,
  CategoryId,
  ActivePage,
  PaymentMethod,
} from '../types';
import { db } from '../services/db';

interface ShopContextType {
  // Navigation & Page state
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  selectedProductId: string | null;
  selectedDesignId: string | null;
  openProductDetails: (productId: string, designId?: string) => void;
  selectedCategoryFilter: CategoryId | 'all';
  setSelectedCategoryFilter: (cat: CategoryId | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Products
  products: Product[];
  categories: CategoryItem[];
  refreshProducts: () => void;

  // User & Auth
  user: User | null;
  login: (identifier: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: {
    fullName: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    address: { street: string; city: string; state: string; pincode: string; country: string };
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup' | 'forgot';
  setAuthModalMode: (mode: 'login' | 'signup' | 'forgot') => void;

  // Cart
  cart: CartItem[];
  addToCart: (
    product: Product,
    design: ProductDesign,
    quantity?: number,
    customization?: CustomizationData
  ) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartTotals: {
    subtotal: number;
    delivery: number;
    discount: number;
    tax: number;
    grandTotal: number;
    count: number;
  };
  appliedCoupon: Coupon | null;
  applyCouponCode: (code: string) => { success: boolean; message: string };
  removeCouponCode: () => void;

  // Buy Now Flow
  buyNowItem: CartItem | null;
  startBuyNow: (
    product: Product,
    design: ProductDesign,
    quantity?: number,
    customization?: CustomizationData
  ) => void;
  clearBuyNow: () => void;

  // Wishlist
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Orders
  orders: Order[];
  refreshOrders: () => void;
  placeOrder: (orderPayload: {
    shippingAddress: {
      fullName: string;
      phone: string;
      email: string;
      street: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
    };
    paymentMethod: PaymentMethod;
  }) => Order;
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (order: Order | null) => void;

  // Notifications
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>('prod-rose-bouquet');
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<CategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Products & Categories
  const [products, setProducts] = useState<Product[]>(() => db.getProducts());
  const [categories] = useState<CategoryItem[]>(() => db.getCategories());

  const refreshProducts = () => {
    setProducts(db.getProducts());
  };

  // Auth & User
  const [user, setUser] = useState<User | null>(() => db.getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'forgot'>('login');

  // Cart & Buy Now
  const [cart, setCart] = useState<CartItem[]>(() => db.getCart());
  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Wishlist
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => db.getWishlist());

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => db.getOrders());
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 3200);
  };

  // Sync cart to db
  useEffect(() => {
    db.setCart(cart);
  }, [cart]);

  // Auth operations
  const login = async (identifier: string, pass: string) => {
    const res = await db.loginUser(identifier, pass);
    if (res.success && res.user) {
      setUser(res.user);
      setIsAuthModalOpen(false);
      showToast(`Welcome back, ${res.user.fullName.split(' ')[0]}!`);
      // User requested: "After successful login, redirect the user to the product shopping page"
      setActivePage('products');
      return { success: true };
    }
    return { success: false, error: res.error || 'Login failed' };
  };

  const signup = async (userData: {
    fullName: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    address: { street: string; city: string; state: string; pincode: string; country: string };
  }) => {
    const res = await db.registerUser(userData);
    if (res.success && res.user) {
      db.setCurrentUser(res.user);
      setUser(res.user);
      setIsAuthModalOpen(false);
      showToast(`Account created! Welcome to Petal & Print, ${res.user.fullName.split(' ')[0]}.`);
      // Redirect to product shopping page
      setActivePage('products');
      return { success: true };
    }
    return { success: false, error: res.error || 'Registration failed' };
  };

  const logout = () => {
    db.setCurrentUser(null);
    setUser(null);
    showToast('You have been logged out.');
    setActivePage('home');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    const updated = db.updateUserProfile(user.id, updates);
    if (updated) {
      setUser(updated);
      showToast('Profile information updated successfully.');
    }
  };

  // Product Navigation
  const openProductDetails = (productId: string, designId?: string) => {
    setSelectedProductId(productId);
    setSelectedDesignId(designId || null);
    setActivePage('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    const nextList = db.toggleWishlist(productId);
    setWishlistIds(nextList);
    const isNow = nextList.includes(productId);
    const prod = products.find((p) => p.id === productId);
    showToast(
      isNow
        ? `Added "${prod?.name || 'Item'}" to your Wishlist`
        : `Removed "${prod?.name || 'Item'}" from Wishlist`
    );
  };

  const isWishlisted = (productId: string) => wishlistIds.includes(productId);

  // Cart Operations
  const addToCart = (
    product: Product,
    design: ProductDesign,
    quantity = 1,
    customization?: CustomizationData
  ) => {
    const unitPrice = product.basePrice + (design.priceDelta || 0);
    // Composite ID
    const cartItemId = `${product.id}_${design.id}_${customization?.recipientName || 'default'}`;

    setCart((prev) => {
      const idx = prev.findIndex((item) => item.id === cartItemId);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          quantity: next[idx].quantity + quantity,
          unitPrice,
        };
        return next;
      }
      return [
        ...prev,
        {
          id: cartItemId,
          product,
          selectedDesign: design,
          customization,
          quantity,
          unitPrice,
        },
      ];
    });

    showToast(`Added "${product.name} (${design.name.split(':')[0]})" to cart.`);
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    showToast('Item removed from cart.');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Buy Now Flow
  const startBuyNow = (
    product: Product,
    design: ProductDesign,
    quantity = 1,
    customization?: CustomizationData
  ) => {
    const unitPrice = product.basePrice + (design.priceDelta || 0);
    const cartItemId = `buynow_${product.id}_${design.id}_${Date.now()}`;
    const item: CartItem = {
      id: cartItemId,
      product,
      selectedDesign: design,
      customization,
      quantity,
      unitPrice,
    };
    setBuyNowItem(item);
    setActivePage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearBuyNow = () => {
    setBuyNowItem(null);
  };

  // Coupon handling
  const applyCouponCode = (code: string) => {
    const activeItems = buyNowItem ? [buyNowItem] : cart;
    const subtotal = activeItems.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);
    const res = db.applyCoupon(code, subtotal);
    if (res.valid) {
      const coupons = db.getCoupons();
      const matched = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
      if (matched) {
        setAppliedCoupon(matched);
      }
      showToast(res.message);
      return { success: true, message: res.message };
    } else {
      showToast(res.message);
      return { success: false, message: res.message };
    }
  };

  const removeCouponCode = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed.');
  };

  // Totals calculations
  const activeItems = buyNowItem ? [buyNowItem] : cart;
  const count = activeItems.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = activeItems.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.discountAmount) {
      discount = appliedCoupon.discountAmount;
    }
  }

  // Free delivery above ₹799
  const delivery = subtotal >= 799 || activeItems.length === 0 ? 0 : 60;
  const discountedSubtotal = Math.max(0, subtotal - discount);
  const tax = Math.round(discountedSubtotal * 0.05 * 100) / 100;
  const grandTotal = Math.round((discountedSubtotal + delivery + tax) * 100) / 100;

  const cartTotals = {
    subtotal,
    delivery,
    discount,
    tax,
    grandTotal,
    count,
  };

  // Orders
  const refreshOrders = () => {
    setOrders(db.getOrders());
  };

  const placeOrder = (orderPayload: {
    shippingAddress: {
      fullName: string;
      phone: string;
      email: string;
      street: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
    };
    paymentMethod: PaymentMethod;
  }): Order => {
    const items = buyNowItem ? [buyNowItem] : [...cart];
    const estimatedDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString(
      'en-US',
      {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }
    );

    const newOrder = db.createOrder({
      userId: user?.id || 'guest-' + Date.now(),
      userEmail: orderPayload.shippingAddress.email,
      userName: orderPayload.shippingAddress.fullName,
      userPhone: orderPayload.shippingAddress.phone,
      shippingAddress: orderPayload.shippingAddress,
      items,
      subtotal: cartTotals.subtotal,
      deliveryCharge: cartTotals.delivery,
      discount: cartTotals.discount,
      couponCode: appliedCoupon?.code,
      tax: cartTotals.tax,
      grandTotal: cartTotals.grandTotal,
      paymentMethod: orderPayload.paymentMethod,
      paymentStatus: orderPayload.paymentMethod === 'cod' ? 'Pending' : 'Paid',
      orderStatus: 'Order Placed',
      estimatedDeliveryDate: estimatedDate,
    });

    if (buyNowItem) {
      setBuyNowItem(null);
    } else {
      clearCart();
    }

    refreshOrders();
    setLastPlacedOrder(newOrder);
    setActivePage('order-confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Order #${newOrder.orderNumber} placed successfully!`);
    return newOrder;
  };

  return (
    <ShopContext.Provider
      value={{
        activePage,
        setActivePage,
        selectedProductId,
        selectedDesignId,
        openProductDetails,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        searchQuery,
        setSearchQuery,
        products,
        categories,
        refreshProducts,
        user,
        login,
        signup,
        logout,
        updateProfile,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotals,
        appliedCoupon,
        applyCouponCode,
        removeCouponCode,
        buyNowItem,
        startBuyNow,
        clearBuyNow,
        wishlistIds,
        toggleWishlist,
        isWishlisted,
        orders,
        refreshOrders,
        placeOrder,
        lastPlacedOrder,
        setLastPlacedOrder,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
