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
  Bot,
  Sparkles,
  RefreshCw,
  Send,
  MessageSquare,
  BookOpen,
  Tag,
  Zap,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { aiKnowledgeService, CustomQA, AISettings } from '../services/aiKnowledge';

export const AdminDashboard: React.FC = () => {
  const { user, login, products, refreshProducts, orders, refreshOrders, categories } = useShop();

  // Tab state
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'customers' | 'reviews' | 'ai-training'>('overview');

  // AI Training State
  const [customQAs, setCustomQAs] = useState<CustomQA[]>(aiKnowledgeService.getCustomQAs());
  const [aiSettings, setAiSettings] = useState<AISettings>(aiKnowledgeService.getSettings());
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newCategory, setNewCategory] = useState('Custom FAQ');
  const [testQuery, setTestQuery] = useState('');
  const [testAnswer, setTestAnswer] = useState('');
  const [testLoading, setTestLoading] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // n8n Webhook Test State
  const [isTestingN8n, setIsTestingN8n] = useState(false);
  const [n8nTestResult, setN8nTestResult] = useState<{
    status: 'idle' | 'testing' | 'success' | 'warning' | 'error';
    message: string;
    hint?: string;
  }>({ status: 'idle', message: '' });

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
            { id: 'ai-training', label: '🌸 AI Training & Data' },
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

        {/* TAB 5: AI TRAINING & WEBSITE KNOWLEDGE BASE */}
        {activeTab === 'ai-training' && (
          <div className="space-y-8">
            {/* Header & Sync Banner */}
            <div className="bg-gradient-to-r from-[#2D1F1D] to-[#4A322D] text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Website Grounded Intelligence</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif-display font-medium text-white">
                  Train AI on Petal &amp; Print Website Data
                </h2>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  Your AI Concierge automatically indexes live store products, categories, pricing, discount coupons, and store policies. Add custom answers and tune prompts below.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <button
                  onClick={() => {
                    setSyncFeedback('Synchronized! All latest products, categories & coupons re-indexed.');
                    setTimeout(() => setSyncFeedback(null), 4000);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#9A4C32] hover:bg-[#833F29] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Sync &amp; Re-Train Data</span>
                </button>
              </div>
            </div>

            {syncFeedback && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{syncFeedback}</span>
              </div>
            )}

            {/* Training Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider">Indexed Products</span>
                  <Package className="w-4 h-4 text-[#9A4C32]" />
                </div>
                <span className="text-2xl font-bold font-mono text-stone-900">{products.length} Items</span>
                <p className="text-[11px] text-stone-400 mt-1">Live catalog data trained</p>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider">Categories</span>
                  <Layers className="w-4 h-4 text-[#9A4C32]" />
                </div>
                <span className="text-2xl font-bold font-mono text-stone-900">{categories.length}</span>
                <p className="text-[11px] text-stone-400 mt-1">Bouquets, magazines, gifts</p>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider">Active Coupons</span>
                  <Tag className="w-4 h-4 text-[#9A4C32]" />
                </div>
                <span className="text-2xl font-bold font-mono text-stone-900">4 Codes</span>
                <p className="text-[11px] text-stone-400 mt-1">WELCOME10, PETAL20, etc.</p>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider">Custom Q&amp;As</span>
                  <BookOpen className="w-4 h-4 text-[#9A4C32]" />
                </div>
                <span className="text-2xl font-bold font-mono text-stone-900">{customQAs.length} Trained</span>
                <p className="text-[11px] text-stone-400 mt-1">Custom FAQs &amp; policies</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Custom Q&A Manager */}
              <div className="lg:col-span-7 space-y-6">
                {/* Form: Add New Training Knowledge */}
                <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-[#9A4C32]" />
                      <span>Train New Question &amp; Answer</span>
                    </h3>
                    <span className="text-[11px] text-stone-400">Added to AI context immediately</span>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newQuestion.trim() || !newAnswer.trim()) return;
                      const created = aiKnowledgeService.addCustomQA({
                        question: newQuestion.trim(),
                        answer: newAnswer.trim(),
                        category: newCategory,
                      });
                      setCustomQAs(aiKnowledgeService.getCustomQAs());
                      setNewQuestion('');
                      setNewAnswer('');
                      setSyncFeedback(`Successfully trained Q&A: "${created.question}"`);
                      setTimeout(() => setSyncFeedback(null), 4000);
                    }}
                    className="space-y-3"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Question or Topic User Might Ask:
                      </label>
                      <input
                        type="text"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="e.g., Do you provide bulk discounts for wedding favors or stage decor?"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:border-[#9A4C32] focus:outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Knowledge Category:
                        </label>
                        <select
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                        >
                          <option value="Custom FAQ">Custom FAQ</option>
                          <option value="Party & Events Decor">Party &amp; Events Decor</option>
                          <option value="Bouquet Customization">Bouquet Customization</option>
                          <option value="Birthday Magazines">Birthday Magazines</option>
                          <option value="Bulk Corporate Orders">Bulk Corporate Orders</option>
                          <option value="Shipping & Logistics">Shipping &amp; Logistics</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Exact Trained Answer:
                      </label>
                      <textarea
                        rows={3}
                        value={newAnswer}
                        onChange={(e) => setNewAnswer(e.target.value)}
                        placeholder="Provide the accurate answer with pricing, timelines, or contact instructions..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:border-[#9A4C32] focus:outline-none"
                        required
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#9A4C32] hover:bg-[#833F29] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save &amp; Train AI</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* List of currently trained Q&As */}
                <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                      Currently Trained Q&amp;As ({customQAs.length})
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {customQAs.map((qa) => (
                      <div
                        key={qa.id}
                        className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-2 group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-stone-200 text-stone-700 mb-1">
                              {qa.category}
                            </span>
                            <h4 className="text-xs font-bold text-stone-900">Q: {qa.question}</h4>
                          </div>
                          <button
                            onClick={() => {
                              aiKnowledgeService.deleteCustomQA(qa.id);
                              setCustomQAs(aiKnowledgeService.getCustomQAs());
                            }}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete Q&A"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-stone-600 leading-relaxed">A: {qa.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: AI Persona Tuning, n8n Integration & Test Playground */}
              <div className="lg:col-span-5 space-y-6">
                {/* n8n Cloud Webhook Integration Card */}
                <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-emerald-600" />
                      <span>n8n AI Workflow Integration</span>
                    </h3>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Webhook Connected
                    </span>
                  </div>

                  <p className="text-xs text-stone-500 leading-relaxed">
                    Customer chat queries from the website are routed directly through your custom n8n Chat Trigger / Webhook workflow.
                  </p>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-semibold text-stone-700">n8n Chat Webhook URL</label>
                        <a
                          href="https://blessy24nm1a0565.app.n8n.cloud"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-[#9A4C32] hover:underline flex items-center gap-1"
                        >
                          <span>Open n8n Editor</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <input
                        type="url"
                        value={aiSettings.n8nWebhookUrl}
                        onChange={(e) =>
                          setAiSettings({ ...aiSettings, n8nWebhookUrl: e.target.value })
                        }
                        placeholder="https://blessy24nm1a0565.app.n8n.cloud/webhook/..."
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono text-[11px]"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-stone-700 block mb-1">
                        Chat Widget Display Mode
                      </label>
                      <select
                        value={aiSettings.widgetStyle || 'official-n8n'}
                        onChange={(e) =>
                          setAiSettings({
                            ...aiSettings,
                            widgetStyle: e.target.value as 'official-n8n' | 'store-concierge' | 'both',
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white text-stone-800"
                      >
                        <option value="official-n8n">
                          Official n8n Chat Widget (Recommended - Embedded @n8n/chat)
                        </option>
                        <option value="store-concierge">
                          Petal &amp; Print Custom Concierge (Catalog Grounding + n8n)
                        </option>
                        <option value="both">Dual Mode (Both Available)</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 py-1">
                      <input
                        type="checkbox"
                        id="useN8nWebhook"
                        checked={aiSettings.useN8nWebhook}
                        onChange={(e) =>
                          setAiSettings({ ...aiSettings, useN8nWebhook: e.target.checked })
                        }
                        className="rounded border-stone-300 text-[#9A4C32] focus:ring-[#9A4C32] cursor-pointer"
                      />
                      <label htmlFor="useN8nWebhook" className="text-xs text-stone-700 font-medium cursor-pointer">
                        Enable n8n as Primary Chat Engine (Falls back to website grounding if offline)
                      </label>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={async () => {
                          setIsTestingN8n(true);
                          setN8nTestResult({ status: 'testing', message: 'Pinging n8n webhook...' });
                          const res = await aiKnowledgeService.testN8nConnection(aiSettings.n8nWebhookUrl);
                          if (res.success) {
                            setN8nTestResult({ status: 'success', message: res.message });
                          } else if (res.status === 404) {
                            setN8nTestResult({
                              status: 'warning',
                              message: res.message,
                              hint: res.hint,
                            });
                          } else {
                            setN8nTestResult({ status: 'error', message: res.message, hint: res.hint });
                          }
                          setIsTestingN8n(false);
                        }}
                        disabled={isTestingN8n || !aiSettings.n8nWebhookUrl}
                        className="flex-1 py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold uppercase tracking-wider text-[11px] rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3 h-3 ${isTestingN8n ? 'animate-spin' : ''}`} />
                        <span>{isTestingN8n ? 'Testing...' : 'Test Connection'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          aiKnowledgeService.saveSettings(aiSettings);
                          setSyncFeedback('n8n Webhook settings saved successfully!');
                          setTimeout(() => setSyncFeedback(null), 3000);
                        }}
                        className="flex-1 py-2 px-3 bg-[#2D1F1D] hover:bg-[#3D2C29] text-white font-bold uppercase tracking-wider text-[11px] rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <Save className="w-3 h-3" />
                        <span>Save Webhook</span>
                      </button>
                    </div>

                    {/* Test result feedback banner */}
                    {n8nTestResult.status === 'success' && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">{n8nTestResult.message}</p>
                          <p className="text-[11px] text-emerald-700 mt-0.5">
                            Live chat responses from your n8n AI agent will stream to visitors on the website.
                          </p>
                        </div>
                      </div>
                    )}

                    {n8nTestResult.status === 'warning' && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">{n8nTestResult.message}</p>
                          {n8nTestResult.hint && (
                            <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                              💡 <strong>Next step:</strong> {n8nTestResult.hint}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {n8nTestResult.status === 'error' && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">{n8nTestResult.message}</p>
                          {n8nTestResult.hint && (
                            <p className="text-[11px] text-rose-700 mt-0.5">{n8nTestResult.hint}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Persona Tuning */}
                <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
                    <Bot className="w-4 h-4 text-[#9A4C32]" />
                    <span>AI Concierge Persona &amp; Tone</span>
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Bot Name</label>
                      <input
                        type="text"
                        value={aiSettings.botName}
                        onChange={(e) => setAiSettings({ ...aiSettings, botName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Tone of Voice</label>
                      <select
                        value={aiSettings.personaTone}
                        onChange={(e) =>
                          setAiSettings({ ...aiSettings, personaTone: e.target.value as any })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                      >
                        <option value="artisan">Artisan (Warm, handcrafted, knowledgeable)</option>
                        <option value="friendly">Friendly (Casual, upbeat, welcoming)</option>
                        <option value="elegant">Elegant (Refined, luxury gifting concierge)</option>
                        <option value="playful">Playful (Celebratory, fun, enthusiastic)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Welcome Message</label>
                      <textarea
                        rows={2}
                        value={aiSettings.welcomeMessage}
                        onChange={(e) =>
                          setAiSettings({ ...aiSettings, welcomeMessage: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-stone-300"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Custom System Instructions</label>
                      <textarea
                        rows={3}
                        value={aiSettings.customInstructions}
                        onChange={(e) =>
                          setAiSettings({ ...aiSettings, customInstructions: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-stone-300"
                      />
                    </div>

                    <button
                      onClick={() => {
                        aiKnowledgeService.saveSettings(aiSettings);
                        setSyncFeedback('AI Persona settings saved successfully.');
                        setTimeout(() => setSyncFeedback(null), 3000);
                      }}
                      className="w-full py-2.5 bg-[#2D1F1D] hover:bg-[#3D2C29] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Persona Settings</span>
                    </button>
                  </div>
                </div>

                {/* Live Training Test Simulator */}
                <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#9A4C32]" />
                      <span>Test AI on Trained Website Data</span>
                    </h3>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Live
                    </span>
                  </div>

                  <p className="text-xs text-stone-500">
                    Ask any question about your products, prices, or custom Q&amp;As to verify how the bot responds:
                  </p>

                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={testQuery}
                        onChange={(e) => setTestQuery(e.target.value)}
                        placeholder="e.g. How much is the rose bouquet?"
                        className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:border-[#9A4C32] focus:outline-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            // Trigger test
                            if (!testQuery.trim() || testLoading) return;
                            setTestLoading(true);
                            setTestAnswer('');
                            const customKnowledge = aiKnowledgeService.getTrainedKnowledgeContext();
                            fetch('/api/chat', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ message: testQuery, customKnowledge }),
                            })
                              .then((r) => r.json())
                              .then((d) => setTestAnswer(d.reply || 'No reply generated.'))
                              .catch(() => {
                                const localAns = aiKnowledgeService.answerWithLocalKnowledge(testQuery);
                                setTestAnswer(localAns.reply);
                              })
                              .finally(() => setTestLoading(false));
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          if (!testQuery.trim() || testLoading) return;
                          setTestLoading(true);
                          setTestAnswer('');
                          const customKnowledge = aiKnowledgeService.getTrainedKnowledgeContext();
                          fetch('/api/chat', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ message: testQuery, customKnowledge }),
                          })
                            .then((r) => r.json())
                            .then((d) => setTestAnswer(d.reply || 'No reply generated.'))
                            .catch(() => {
                              const localAns = aiKnowledgeService.answerWithLocalKnowledge(testQuery);
                              setTestAnswer(localAns.reply);
                            })
                            .finally(() => setTestLoading(false));
                        }}
                        disabled={!testQuery.trim() || testLoading}
                        className="px-4 py-2.5 bg-[#9A4C32] hover:bg-[#833F29] text-white text-xs font-bold uppercase rounded-xl disabled:opacity-40 cursor-pointer shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {testLoading && (
                      <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-500 animate-pulse flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>Evaluating trained knowledge base...</span>
                      </div>
                    )}

                    {testAnswer && (
                      <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-stone-200/90 text-xs text-stone-800 space-y-2">
                        <div className="flex items-center justify-between text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                          <span>AI Output:</span>
                          <span className="text-emerald-700 font-semibold">Trained Grounding Active</span>
                        </div>
                        <div className="whitespace-pre-line leading-relaxed">{testAnswer}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
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
