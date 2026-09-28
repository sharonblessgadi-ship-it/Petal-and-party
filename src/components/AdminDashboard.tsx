import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Product, Order, OrderStatus, ProductDesign, CategoryId } from '../types';
import { db } from '../services/db';
import {
  Package,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  Filter,
  Layers,
  Star,
  ShieldCheck,
  Lock,
  ChevronRight,
  Save,
  X,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, login, products, refreshProducts, orders, refreshOrders, categories } = useShop();

  // Tab state
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'customers' | 'reviews'>('overview');

  // Product edit/add modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // New/Edit product form state
  const [formName, setFormName] = useState('');
  const [formTagline, setFormTagline] = useState('');
  const [formCategory, setFormCategory] = useState<CategoryId>('pipe-cleaner-flowers');
  const [formBasePrice, setFormBasePrice] = useState(499);
  const [formOriginalPrice, setFormOriginalPrice] = useState(699);
  const [formStock, setFormStock] = useState(20);
  const [formDescription, setFormDescription] = useState('');
  const [formMaterials, setFormMaterials] = useState('');
  const [formDimensions, setFormDimensions] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formDesigns, setFormDesigns] = useState<ProductDesign[]>([]);

  // Search in admin tables
  const [adminSearch, setAdminSearch] = useState('');

  // Admin access gate: if user is not admin, provide convenient login form
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-[80vh] bg-[#FAF8F5] py-16 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 bg-white rounded-3xl border border-stone-200 p-8 shadow-md text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-serif-display font-medium text-stone-900">
            Secure Admin Studio Panel
          </h2>
          <p className="text-xs text-stone-500">
            Please log in with the administrator credentials to manage products, update order statuses,
            and view sales metrics.
          </p>

          <button
            onClick={() => login('admin@petalandprint.com', 'admin123')}
            className="w-full py-3 bg-[#2D1F1D] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#3D2C29] transition-all cursor-pointer"
          >
            Log In as Studio Admin (One-Click)
          </button>
        </div>
      </div>
    );
  }

  // Dashboard Stats Calculations
  const totalRevenue = orders.reduce((acc, o) => acc + o.grandTotal, 0);
  const totalOrders = orders.length;
  const allUsers = db.getUsers();
  const totalCustomers = allUsers.filter((u) => u.role === 'customer').length;
  const totalProducts = products.length;
  const pendingOrders = orders.filter((o) => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length;
  const completedOrders = orders.filter((o) => o.orderStatus === 'Delivered').length;

  // Actions
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormName('');
    setFormTagline('');
    setFormCategory('pipe-cleaner-flowers');
    setFormBasePrice(499);
    setFormOriginalPrice(699);
    setFormStock(20);
    setFormDescription('Handcrafted with premium materials in our creative gifting studio.');
    setFormMaterials('Plush chenille wire, satin ribbon, kraft wrap');
    setFormDimensions('14" Height x 8" Width');
    setFormImage('/src/assets/images/pipe_cleaner_flowers_1790577963650.jpg');
    setFormDesigns([
      {
        id: 'des-new-1',
        name: 'Design 1: Standard Colorway',
        code: 'DS-NEW-01',
        colorName: 'Pastel Blush',
        colorHexList: ['#F8BBD0', '#FFFFFF'],
        image: '/src/assets/images/pipe_cleaner_flowers_1790577963650.jpg',
        priceDelta: 0,
        inStock: true,
        stockCount: 15,
      },
    ]);
    setIsAddingProduct(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormTagline(p.tagline);
    setFormCategory(p.category);
    setFormBasePrice(p.basePrice);
    setFormOriginalPrice(p.originalPrice);
    setFormStock(p.stock);
    setFormDescription(p.description);
    setFormMaterials(p.materials);
    setFormDimensions(p.dimensions);
    setFormImage(p.images[0] || '');
    setFormDesigns(p.designs);
    setIsAddingProduct(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      db.deleteProduct(id);
      refreshProducts();
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const discount = Math.round(((formOriginalPrice - formBasePrice) / formOriginalPrice) * 100);

    if (editingProduct) {
      db.updateProduct(editingProduct.id, {
        name: formName,
        tagline: formTagline,
        category: formCategory,
        basePrice: formBasePrice,
        originalPrice: formOriginalPrice,
        discountPercent: Math.max(0, discount),
        stock: formStock,
        inStock: formStock > 0,
        description: formDescription,
        materials: formMaterials,
        dimensions: formDimensions,
        images: [formImage, ...editingProduct.images.slice(1)],
        designs: formDesigns,
      });
    } else {
      db.addProduct({
        name: formName,
        slug: formName.toLowerCase().replace(/\s+/g, '-'),
        tagline: formTagline,
        category: formCategory,
        categories: [formCategory],
        basePrice: formBasePrice,
        originalPrice: formOriginalPrice,
        discountPercent: Math.max(0, discount),
        rating: 5.0,
        reviewCount: 1,
        stock: formStock,
        inStock: formStock > 0,
        isNewArrival: true,
        isBestSeller: false,
        featured: false,
        images: [formImage],
        description: formDescription,
        materials: formMaterials,
        dimensions: formDimensions,
        careInstructions: 'Keep dry and handle with care',
        dispatchTime: 'Handmade in 24 hours',
        allowCustomization: true,
        designs: formDesigns,
      });
    }

    refreshProducts();
    setIsAddingProduct(false);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    db.updateOrderStatus(orderId, newStatus);
    refreshOrders();
  };

  return (
    <div className="bg-[#FAF8F5] py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#9A4C32]">
                Studio Command Center
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                Admin Mode
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif-display font-medium text-stone-900">
              Petal &amp; Print Business Management
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#9A4C32] hover:bg-[#833F29] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-stone-200 overflow-x-auto pb-1">
          {[
            { id: 'overview', label: 'Sales & Analytics' },
            { id: 'products', label: `Products (${products.length})` },
            { id: 'orders', label: `Customer Orders (${orders.length})` },
            { id: 'customers', label: `Customers (${totalCustomers})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                activeTab === t.id
                  ? 'border-[#9A4C32] text-[#9A4C32]'
                  : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW & STATS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Dashboard metrics required: Total Orders, Total Customers, Total Products, Total Revenue, Pending Orders, Completed Orders */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="p-4 bg-white rounded-2xl border border-stone-200/90 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                  Total Revenue
                </span>
                <span className="text-xl font-bold font-mono text-emerald-800 block mt-1">
                  ₹{totalRevenue.toLocaleString()}
                </span>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-stone-200/90 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                  Total Orders
                </span>
                <span className="text-xl font-bold font-mono text-stone-900 block mt-1">
                  {totalOrders}
                </span>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-stone-200/90 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                  Total Customers
                </span>
                <span className="text-xl font-bold font-mono text-stone-900 block mt-1">
                  {totalCustomers}
                </span>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-stone-200/90 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                  Total Products
                </span>
                <span className="text-xl font-bold font-mono text-stone-900 block mt-1">
                  {totalProducts}
                </span>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-stone-200/90 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                  Pending Orders
                </span>
                <span className="text-xl font-bold font-mono text-amber-700 block mt-1">
                  {pendingOrders}
                </span>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-stone-200/90 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                  Completed Orders
                </span>
                <span className="text-xl font-bold font-mono text-emerald-700 block mt-1">
                  {completedOrders}
                </span>
              </div>
            </div>

            {/* Sales Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Category Sales Distribution Bar */}
              <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#9A4C32]" />
                  <span>Category Revenue Share</span>
                </h3>

                <div className="space-y-3 pt-2 text-xs">
                  {[
                    { name: 'Pipe Cleaner Flowers & Bouquets', amount: '₹14,500', share: 45, color: '#9A4C32' },
                    { name: 'Personalized Birthday Magazines', amount: '₹9,800', share: 30, color: '#D47A60' },
                    { name: 'Customized Gift Boxes & Hampers', amount: '₹5,200', share: 16, color: '#E8A598' },
                    { name: 'Botanical Resin Keepsakes', amount: '₹2,900', share: 9, color: '#F0C2BA' },
                  ].map((cat) => (
                    <div key={cat.name} className="space-y-1">
                      <div className="flex justify-between text-stone-700">
                        <span className="font-medium">{cat.name}</span>
                        <span className="font-mono font-bold text-stone-900">{cat.amount} ({cat.share}%)</span>
                      </div>
                      <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${cat.share}%`, backgroundColor: cat.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Trend Mock Graph */}
              <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  Monthly Growth Trend
                </h3>
                <div className="flex items-end justify-between h-40 pt-4 px-2">
                  {[
                    { month: 'Oct', val: 35 },
                    { month: 'Nov', val: 52 },
                    { month: 'Dec', val: 80 },
                    { month: 'Jan', val: 65 },
                    { month: 'Feb', val: 88 },
                    { month: 'Mar', val: 100 },
                  ].map((m) => (
                    <div key={m.month} className="flex flex-col items-center gap-1.5 flex-1">
                      <div
                        className="w-7 bg-[#2D1F1D] rounded-t-lg transition-all"
                        style={{ height: `${m.val}%` }}
                      />
                      <span className="text-[10px] text-stone-500">{m.month}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-stone-500 text-center pt-2">
                  Peak demand on Valentine&apos;s and Spring Birthday season (+42% YoY)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                All Products Catalog ({products.length})
              </h3>
              <button
                onClick={handleOpenAdd}
                className="px-3 py-1.5 bg-[#2D1F1D] text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer w-fit"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] text-stone-600 uppercase text-[10px] tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price / Discount</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Designs</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-800">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50/70">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-stone-100 border border-stone-200"
                          />
                          <div>
                            <span className="font-semibold text-stone-900 block truncate max-w-[200px]">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-stone-400 font-mono">
                              ★ {p.rating} ({p.reviewCount})
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 capitalize">{p.category.replace(/-/g, ' ')}</td>
                      <td className="py-3 px-4 font-mono">
                        <span className="font-bold text-stone-900">₹{p.basePrice}</span>
                        <span className="text-stone-400 line-through ml-1.5">₹{p.originalPrice}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            p.stock > 5 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {p.stock} units
                        </span>
                      </td>
                      <td className="py-3 px-4">{p.designs.length} Variations</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-stone-600 hover:text-[#9A4C32] rounded-lg hover:bg-stone-100"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-stone-100"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOMER ORDERS */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs overflow-hidden space-y-4">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                Customer Orders History &amp; Dispatch Status ({orders.length})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] text-stone-600 uppercase text-[10px] tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Current Status</th>
                    <th className="py-3 px-4">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-800">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-stone-50/70">
                      <td className="py-3 px-4 font-mono font-bold text-stone-900">
                        {o.orderNumber}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold block">{o.userName}</span>
                        <span className="text-[11px] text-stone-400">{o.shippingAddress.city}, {o.shippingAddress.state}</span>
                      </td>
                      <td className="py-3 px-4">
                        {o.items.map((it, idx) => (
                          <div key={idx} className="text-[11px]">
                            {it.quantity}x {it.product.name} ({it.selectedDesign.name})
                          </div>
                        ))}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-stone-900">
                        ₹{o.grandTotal}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900">
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={o.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                          className="px-2.5 py-1 text-xs rounded-lg border border-stone-300 bg-white"
                        >
                          <option value="Order Placed">Order Placed</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CUSTOMERS DIRECTORY */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-stone-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                Registered Customer Directory ({allUsers.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] text-stone-600 uppercase text-[10px] tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Address</th>
                    <th className="py-3 px-4">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {allUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-stone-50/70">
                      <td className="py-3 px-4 font-semibold text-stone-900">{u.fullName}</td>
                      <td className="py-3 px-4 text-stone-600">{u.email}</td>
                      <td className="py-3 px-4 text-stone-600">{u.phone}</td>
                      <td className="py-3 px-4 text-stone-600">{u.address.street}, {u.address.city}</td>
                      <td className="py-3 px-4 uppercase text-[10px] font-bold text-stone-500">{u.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ADD / EDIT PRODUCT MODAL */}
        {isAddingProduct && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
              <div className="bg-[#2D1F1D] text-white p-5 flex items-center justify-between shrink-0">
                <h3 className="font-serif-display text-lg font-medium">
                  {editingProduct ? 'Edit Creative Product' : 'Add New Handcrafted Product'}
                </h3>
                <button
                  onClick={() => setIsAddingProduct(false)}
                  className="p-1 text-stone-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold uppercase text-stone-700 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase text-stone-700 mb-1">
                    Short Tagline *
                  </label>
                  <input
                    type="text"
                    value={formTagline}
                    onChange={(e) => setFormTagline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold uppercase text-stone-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as CategoryId)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold uppercase text-stone-700 mb-1">
                      Sale Price (₹) *
                    </label>
                    <input
                      type="number"
                      value={formBasePrice}
                      onChange={(e) => setFormBasePrice(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase text-stone-700 mb-1">
                      List Price (₹) *
                    </label>
                    <input
                      type="number"
                      value={formOriginalPrice}
                      onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold uppercase text-stone-700 mb-1">
                      Stock Count *
                    </label>
                    <input
                      type="number"
                      value={formStock}
                      onChange={(e) => setFormStock(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold uppercase text-stone-700 mb-1">
                      Main Image Path *
                    </label>
                    <input
                      type="text"
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold uppercase text-stone-700 mb-1">
                    Full Description *
                  </label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                    required
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingProduct(false)}
                    className="px-4 py-2 border border-stone-300 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#2D1F1D] text-white rounded-xl font-bold uppercase tracking-wider hover:bg-[#3D2C29]"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
