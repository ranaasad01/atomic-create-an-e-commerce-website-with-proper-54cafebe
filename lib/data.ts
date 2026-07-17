export const APP_NAME = "MarketHub";
export const APP_TAGLINE = "Shop Everything, Delivered Fast";
export const APP_CURRENCY = "USD";
export const APP_CURRENCY_SYMBOL = "$";

export interface NavLink {
  label: string;
  href: string;
  type: "route" | "anchor";
}

export const navLinks: NavLink[] = [
  { label: "Home", href: "/", type: "route" },
  { label: "Electronics", href: "/category/electronics", type: "route" },
  { label: "Fashion", href: "/category/fashion", type: "route" },
  { label: "Home & Kitchen", href: "/category/home-kitchen", type: "route" },
  { label: "Books", href: "/category/books", type: "route" },
  { label: "Sports", href: "/category/sports", type: "route" },
];

export const accountLinks: NavLink[] = [
  { label: "My Account", href: "/account", type: "route" },
  { label: "Orders", href: "/account/orders", type: "route" },
  { label: "Sign In", href: "/auth", type: "route" },
];

export const footerLinks = {
  shop: [
    { label: "Electronics", href: "/category/electronics" },
    { label: "Fashion", href: "/category/fashion" },
    { label: "Home & Kitchen", href: "/category/home-kitchen" },
    { label: "Books", href: "/category/books" },
    { label: "Sports", href: "/category/sports" },
  ],
  account: [
    { label: "My Account", href: "/account" },
    { label: "Order History", href: "/account/orders" },
    { label: "Sign In", href: "/auth" },
    { label: "Cart", href: "/cart" },
  ],
  help: [
    { label: "FAQ", href: "#faq" },
    { label: "Shipping Policy", href: "#shipping" },
    { label: "Returns", href: "#returns" },
    { label: "Contact Us", href: "#contact" },
  ],
};

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  categorySlug: string;
  rating: number;
  reviewCount: number;
  badge?: string;
  description: string;
  inStock: boolean;
  specs?: Record<string, string>;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verified: boolean;
}

export interface Order {
  id: string;
  date: string;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  items: CartItem[];
  total: number;
  shippingAddress: ShippingAddress;
  trackingNumber?: string;
}

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export const CATEGORIES = [
  { name: "Electronics", slug: "electronics", icon: "💻", description: "Gadgets, devices, and tech accessories" },
  { name: "Fashion", slug: "fashion", icon: "👗", description: "Clothing, shoes, and accessories" },
  { name: "Home & Kitchen", slug: "home-kitchen", icon: "🏠", description: "Furniture, appliances, and decor" },
  { name: "Books", slug: "books", icon: "📚", description: "Bestsellers, textbooks, and more" },
  { name: "Sports", slug: "sports", icon: "⚽", description: "Equipment, apparel, and outdoor gear" },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Sony WH-1000XM5 Wireless Noise-Cancelling Headphones",
    price: 279.99,
    originalPrice: 349.99,
    image: "https://graphics.secondipity.com/B2C/5409336_1.jpg",
    images: [
      "https://graphics.secondipity.com/B2C/5409336_1.jpg",
      "/images/sony-headphones-side-view.jpg",
      "/images/sony-headphones-folded.jpg",
    ],
    category: "Electronics",
    categorySlug: "electronics",
    rating: 4.8,
    reviewCount: 2341,
    badge: "Best Seller",
    description:
      "Industry-leading noise cancellation with the WH-1000XM5. Features 30-hour battery life, multipoint connection, and crystal-clear hands-free calling.",
    inStock: true,
    specs: {
      "Driver Size": "30mm",
      "Frequency Response": "4Hz–40,000Hz",
      "Battery Life": "30 hours",
      "Charging Time": "3.5 hours",
      Weight: "250g",
      Connectivity: "Bluetooth 5.2",
    },
  },
  {
    id: "p2",
    name: "Apple iPad Pro 12.9-inch (M2 Chip)",
    price: 1099.00,
    originalPrice: 1199.00,
    image: "/images/apple-ipad-pro-m2.jpg",
    category: "Electronics",
    categorySlug: "electronics",
    rating: 4.9,
    reviewCount: 1876,
    badge: "Top Rated",
    description:
      "The ultimate iPad experience with the M2 chip, Liquid Retina XDR display, and ProMotion technology for buttery-smooth performance.",
    inStock: true,
    specs: {
      Display: "12.9-inch Liquid Retina XDR",
      Chip: "Apple M2",
      Storage: "128GB",
      Camera: "12MP Wide + 10MP Ultra Wide",
      Battery: "Up to 10 hours",
      Connectivity: "Wi-Fi 6E, Bluetooth 5.3",
    },
  },
  {
    id: "p3",
    name: "Levi's 501 Original Fit Jeans",
    price: 59.99,
    originalPrice: 79.99,
    image: "https://static.wikia.nocookie.net/shingekinokyojin/images/b/b1/Levi_Ackermann_%28Anime%29_character_image.png/revision/latest?cb=20231105181307",
    category: "Fashion",
    categorySlug: "fashion",
    rating: 4.5,
    reviewCount: 5432,
    badge: "Deal",
    description:
      "The original blue jean since 1873. Straight fit with a button fly, made from 100% cotton denim for lasting comfort and style.",
    inStock: true,
    specs: {
      Material: "100% Cotton",
      Fit: "Straight",
      Closure: "Button Fly",
      Rise: "Mid Rise",
      Care: "Machine Wash Cold",
    },
  },
  {
    id: "p4",
    name: "KitchenAid Artisan Stand Mixer 5-Quart",
    price: 349.99,
    originalPrice: 449.99,
    image: "/images/kitchenaid-artisan-stand-mixer.jpg",
    category: "Home & Kitchen",
    categorySlug: "home-kitchen",
    rating: 4.7,
    reviewCount: 8921,
    badge: "Best Seller",
    description:
      "The iconic KitchenAid Stand Mixer with 10 speeds, a 5-quart stainless steel bowl, and a tilt-head design for easy access.",
    inStock: true,
    specs: {
      Capacity: "5 Quart",
      Speeds: "10",
      Motor: "325 Watts",
      Attachments: "Flat Beater, Dough Hook, Wire Whip",
      Weight: "22 lbs",
      Colors: "Available in 20+ colors",
    },
  },
  {
    id: "p5",
    name: "Atomic Habits by James Clear",
    price: 14.99,
    originalPrice: 27.00,
    image: "https://m.media-amazon.com/images/I/81kg51XRc1L._AC_UF1000,1000_QL80_.jpg",
    category: "Books",
    categorySlug: "books",
    rating: 4.9,
    reviewCount: 124500,
    badge: "Bestseller",
    description:
      "The #1 New York Times bestseller. Tiny changes, remarkable results. Learn how to build good habits and break bad ones.",
    inStock: true,
    specs: {
      Author: "James Clear",
      Publisher: "Avery",
      Pages: "320",
      Language: "English",
      Format: "Hardcover",
      ISBN: "978-0735211292",
    },
  },
  {
    id: "p6",
    name: "Nike Air Zoom Pegasus 40 Running Shoes",
    price: 129.99,
    originalPrice: 150.00,
    image: "/images/nike-air-zoom-pegasus-40.jpg",
    category: "Sports",
    categorySlug: "sports",
    rating: 4.6,
    reviewCount: 3210,
    badge: "New Arrival",
    description:
      "The Pegasus 40 delivers a smooth, responsive ride with React foam cushioning and a breathable mesh upper for everyday training.",
    inStock: true,
    specs: {
      Upper: "Engineered Mesh",
      Midsole: "React Foam",
      Outsole: "Rubber",
      Drop: "10mm",
      Weight: "10.2 oz (M10)",
      "Best For": "Road Running",
    },
  },
  {
    id: "p7",
    name: "Samsung 65-inch QLED 4K Smart TV",
    price: 799.99,
    originalPrice: 1099.99,
    image: "https://bjs.scene7.com/is/image/bjs/345905?$bjs-Zoom$",
    category: "Electronics",
    categorySlug: "electronics",
    rating: 4.6,
    reviewCount: 4120,
    badge: "Deal",
    description:
      "Quantum Dot technology delivers brilliant color and contrast. Smart TV with Tizen OS, built-in Alexa, and 4K upscaling.",
    inStock: true,
    specs: {
      "Screen Size": "65 inches",
      Resolution: "4K UHD (3840x2160)",
      "HDR Support": "HDR10+, HLG",
      "Refresh Rate": "120Hz",
      "Smart Platform": "Tizen OS",
      Ports: "4x HDMI, 2x USB",
    },
  },
  {
    id: "p8",
    name: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
    price: 79.99,
    originalPrice: 99.99,
    image: "/images/instant-pot-duo-7in1-pressure-cooker.jpg",
    category: "Home & Kitchen",
    categorySlug: "home-kitchen",
    rating: 4.7,
    reviewCount: 67800,
    badge: "Best Seller",
    description:
      "7-in-1 multi-use programmable pressure cooker, slow cooker, rice cooker, steamer, saute pan, yogurt maker, and warmer.",
    inStock: true,
    specs: {
      Capacity: "6 Quart",
      Functions: "7-in-1",
      Programs: "14 Smart Programs",
      Material: "Stainless Steel",
      Wattage: "1000W",
      Safety: "10 Safety Mechanisms",
    },
  },
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: "r1",
    author: "Sarah M.",
    rating: 5,
    date: "2024-01-15",
    title: "Absolutely love this product!",
    body: "Exceeded all my expectations. The quality is outstanding and delivery was super fast. Would definitely recommend to anyone looking for a reliable option.",
    verified: true,
  },
  {
    id: "r2",
    author: "James T.",
    rating: 4,
    date: "2024-01-10",
    title: "Great value for the price",
    body: "Really solid product overall. Setup was straightforward and it works exactly as described. Took off one star only because the packaging could be better.",
    verified: true,
  },
  {
    id: "r3",
    author: "Emily R.",
    rating: 5,
    date: "2024-01-08",
    title: "Best purchase I've made this year",
    body: "I was skeptical at first but this completely won me over. The build quality is premium and performance is top-notch. Fast shipping too!",
    verified: false,
  },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: "MH-2024-001",
    date: "2024-01-20",
    status: "delivered",
    items: [
      { product: MOCK_PRODUCTS[0], quantity: 1 },
      { product: MOCK_PRODUCTS[4], quantity: 2 },
    ],
    total: 309.97,
    shippingAddress: {
      fullName: "Alex Johnson",
      street: "123 Main Street",
      city: "San Francisco",
      state: "CA",
      zip: "94102",
      country: "United States",
    },
    trackingNumber: "1Z999AA10123456784",
  },
  {
    id: "MH-2024-002",
    date: "2024-01-25",
    status: "shipped",
    items: [{ product: MOCK_PRODUCTS[5], quantity: 1 }],
    total: 129.99,
    shippingAddress: {
      fullName: "Alex Johnson",
      street: "123 Main Street",
      city: "San Francisco",
      state: "CA",
      zip: "94102",
      country: "United States",
    },
    trackingNumber: "1Z999AA10123456785",
  },
];