export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  description: string;
  category: string;
  brand: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  stockQuantity?: number;
  lowStockThreshold?: number;
  featured?: boolean;
  warranty?: string;
  condition?: 'new' | 'refurbished' | 'open-box';
  releaseYear?: number;
  weight?: string;
  dimensions?: string;
  colors?: string[];
  certifications?: string[];
  specs?: {
    processor?: string;
    processorGeneration?: string;
    ram?: string;
    maxRam?: string;
    storage?: string;
    storageType?: 'SSD' | 'HDD' | 'Hybrid';
    gpu?: string;
    gpuMemory?: string;
    display?: string;
    displayType?: 'IPS' | 'OLED' | 'TN' | 'VA';
    refreshRate?: string;
    battery?: string;
    batteryLife?: string;
    screenSize?: string;
    resolution?: string;
    os?: string;
    ports?: string[];
    connectivity?: string[];
    webcam?: string;
    audio?: string;
    keyboard?: string;
    touchpad?: string;
    coolingSystem?: string;
  };
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export const categories = [
  { id: "gaming", name: "Gaming Laptops", icon: "Gamepad2", description: "High-performance laptops for gaming and creative work" },
  { id: "ultrabook", name: "Ultrabooks", icon: "Laptop", description: "Thin, light, and portable for professionals on the go" },
  { id: "macbook", name: "MacBooks", icon: "Apple", description: "Premium Apple laptops for creative professionals" },
  { id: "business", name: "Business Laptops", icon: "Briefcase", description: "Reliable workhorses for office productivity" },
  { id: "workstation", name: "Workstations", icon: "Monitor", description: "Professional-grade laptops for intensive tasks" },
  { id: "2-in-1", name: "2-in-1 Convertible", icon: "Tablet", description: "Versatile laptops that transform into tablets" },
  { id: "budget", name: "Budget Friendly", icon: "DollarSign", description: "Affordable laptops without compromising quality" },
  { id: "chromebook", name: "Chromebooks", icon: "Chrome", description: "Simple, secure, and fast laptops for everyday use" },
];

export const brands = [
  "Apple", "ASUS", "Dell", "HP", "Lenovo", "Acer", "MSI", "Razer",
  "Microsoft", "Samsung", "LG", "Alienware", "Framework", "System76"
];

export const priceRanges = [
  { id: "budget", label: "Under ₦500K", min: 0, max: 500000 },
  { id: "mid-range", label: "₦500K - ₦1M", min: 500000, max: 1000000 },
  { id: "premium", label: "₦1M - ₦2M", min: 1000000, max: 2000000 },
  { id: "high-end", label: "₦2M - ₦3M", min: 2000000, max: 3000000 },
  { id: "luxury", label: "Above ₦3M", min: 3000000, max: Infinity },
];

export const products: Product[] = [
  {
    id: "1",
    name: "ASUS ROG Strix G15 Gaming Laptop",
    price: 1850000,
    originalPrice: 2100000,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=500&fit=crop",
    ],
    description: "Powerful gaming laptop with RTX 4060 graphics, 16GB RAM, and a stunning 165Hz display for the ultimate gaming experience.",
    category: "gaming",
    brand: "ASUS",
    rating: 4.8,
    reviews: 245,
    inStock: true,
    featured: true,
    warranty: "2 Year Manufacturer Warranty",
    certifications: ["Energy Star", "NVIDIA GeForce Certified"],
    specs: {
      processor: "AMD Ryzen 7 6800H",
      ram: "16GB DDR5",
      storage: "512GB NVMe SSD",
      gpu: "NVIDIA RTX 4060 6GB",
      display: "15.6\" FHD 165Hz",
      battery: "90Wh",
      screenSize: "15.6",
    },
  },
  {
    id: "2",
    name: "Dell XPS 13 Ultrabook",
    price: 1650000,
    originalPrice: 1900000,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop",
    ],
    description: "Premium ultrabook with stunning InfinityEdge display, incredible performance in a compact design.",
    category: "ultrabook",
    brand: "Dell",
    rating: 4.7,
    reviews: 189,
    inStock: true,
    featured: true,
    warranty: "1 Year Manufacturer Warranty",
    certifications: ["Intel Evo", "Energy Star"],
    specs: {
      processor: "Intel Core i7-1360P",
      ram: "16GB LPDDR5",
      storage: "512GB NVMe SSD",
      gpu: "Intel Iris Xe",
      display: "13.4\" FHD+",
      battery: "51Wh",
      screenSize: "13.4",
    },
  },
  {
    id: "3",
    name: "MacBook Pro 14\" M3",
    price: 2400000,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&h=500&fit=crop",
    ],
    description: "Revolutionary MacBook Pro with Apple M3 chip, incredible performance, and stunning Liquid Retina XDR display.",
    category: "macbook",
    brand: "Apple",
    rating: 4.9,
    reviews: 312,
    inStock: true,
    featured: true,
    warranty: "1 Year Apple Warranty",
    certifications: ["Apple Certified", "Energy Star"],
    specs: {
      processor: "Apple M3 Chip",
      ram: "16GB Unified Memory",
      storage: "512GB SSD",
      gpu: "10-Core GPU",
      display: "14.2\" Liquid Retina XDR",
      battery: "70Wh",
      screenSize: "14.2",
    },
  },
  {
    id: "4",
    name: "HP Pavilion 15 Business Laptop",
    price: 950000,
    originalPrice: 1150000,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=500&fit=crop",
    ],
    description: "Reliable business laptop with excellent battery life and professional features for productivity.",
    category: "business",
    brand: "HP",
    rating: 4.4,
    reviews: 156,
    inStock: true,
    warranty: "1 Year Manufacturer Warranty",
    certifications: ["Energy Star"],
    specs: {
      processor: "Intel Core i5-1235U",
      ram: "8GB DDR4",
      storage: "512GB SSD",
      gpu: "Intel UHD Graphics",
      display: "15.6\" FHD",
      battery: "41Wh",
      screenSize: "15.6",
    },
  },
  {
    id: "5",
    name: "Lenovo Legion 5 Pro Gaming",
    price: 2100000,
    originalPrice: 2400000,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop",
    ],
    description: "High-performance gaming laptop with RTX 4070 graphics and a gorgeous 165Hz QHD display.",
    category: "gaming",
    brand: "Lenovo",
    rating: 4.8,
    reviews: 203,
    inStock: true,
    specs: {
      processor: "AMD Ryzen 7 7745HX",
      ram: "32GB DDR5",
      storage: "1TB NVMe SSD",
      gpu: "NVIDIA RTX 4070 8GB",
      display: "16\" QHD 165Hz",
      battery: "80Wh",
      screenSize: "16",
    },
  },
  {
    id: "6",
    name: "Microsoft Surface Laptop 5",
    price: 1750000,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop",
    ],
    description: "Elegant ultrabook with exceptional build quality, vibrant PixelSense display, and all-day battery.",
    category: "ultrabook",
    brand: "Microsoft",
    rating: 4.6,
    reviews: 134,
    inStock: true,
    specs: {
      processor: "Intel Core i7-1255U",
      ram: "16GB LPDDR5",
      storage: "512GB SSD",
      gpu: "Intel Iris Xe",
      display: "13.5\" PixelSense",
      battery: "47.4Wh",
      screenSize: "13.5",
    },
  },
  {
    id: "7",
    name: "MacBook Air M2 13\"",
    price: 1850000,
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop",
    ],
    description: "Ultra-thin and lightweight MacBook Air powered by M2 chip with incredible battery life.",
    category: "macbook",
    brand: "Apple",
    rating: 4.8,
    reviews: 287,
    inStock: true,
    specs: {
      processor: "Apple M2 Chip",
      ram: "8GB Unified Memory",
      storage: "256GB SSD",
      gpu: "8-Core GPU",
      display: "13.6\" Liquid Retina",
      battery: "52.6Wh",
      screenSize: "13.6",
    },
  },
  {
    id: "8",
    name: "Acer Swift 3 Business",
    price: 780000,
    originalPrice: 920000,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop",
    ],
    description: "Affordable and reliable business laptop with solid performance and long battery life.",
    category: "business",
    brand: "Acer",
    rating: 4.3,
    reviews: 98,
    inStock: true,
    specs: {
      processor: "Intel Core i5-1240P",
      ram: "8GB DDR4",
      storage: "512GB SSD",
      gpu: "Intel Iris Xe",
      display: "14\" FHD",
      battery: "56Wh",
      screenSize: "14",
    },
  },
  {
    id: "9",
    name: "MSI Stealth 15M Gaming",
    price: 1650000,
    originalPrice: 1850000,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=500&fit=crop",
    ],
    description: "Sleek gaming laptop with RTX 4050 graphics, perfect for gamers on the go.",
    category: "gaming",
    brand: "MSI",
    rating: 4.6,
    reviews: 167,
    inStock: true,
    specs: {
      processor: "Intel Core i7-13620H",
      ram: "16GB DDR5",
      storage: "512GB NVMe SSD",
      gpu: "NVIDIA RTX 4050 6GB",
      display: "15.6\" FHD 144Hz",
      battery: "53.5Wh",
      screenSize: "15.6",
    },
  },
  {
    id: "10",
    name: "ASUS ZenBook 14 OLED",
    price: 1450000,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop",
    ],
    description: "Premium ultrabook with stunning OLED display and exceptional portability.",
    category: "ultrabook",
    brand: "ASUS",
    rating: 4.7,
    reviews: 142,
    inStock: true,
    specs: {
      processor: "Intel Core i7-1360P",
      ram: "16GB LPDDR5",
      storage: "512GB SSD",
      gpu: "Intel Iris Xe",
      display: "14\" 2.8K OLED",
      battery: "75Wh",
      screenSize: "14",
    },
  },
  {
    id: "11",
    name: "MacBook Pro 16\" M3 Max",
    price: 3500000,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&h=500&fit=crop",
    ],
    description: "The ultimate MacBook Pro with M3 Max chip, perfect for creative professionals.",
    category: "macbook",
    brand: "Apple",
    rating: 5.0,
    reviews: 178,
    inStock: true,
    specs: {
      processor: "Apple M3 Max Chip",
      ram: "36GB Unified Memory",
      storage: "1TB SSD",
      gpu: "40-Core GPU",
      display: "16.2\" Liquid Retina XDR",
      battery: "100Wh",
      screenSize: "16.2",
    },
  },
  {
    id: "12",
    name: "ThinkPad X1 Carbon Gen 11",
    price: 1950000,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=500&fit=crop",
    ],
    description: "Premium business laptop with legendary ThinkPad durability and performance.",
    category: "business",
    brand: "Lenovo",
    rating: 4.8,
    reviews: 221,
    inStock: true,
    specs: {
      processor: "Intel Core i7-1365U",
      ram: "16GB LPDDR5",
      storage: "1TB SSD",
      gpu: "Intel Iris Xe",
      display: "14\" WUXGA",
      battery: "57Wh",
      screenSize: "14",
    },
  },
  {
    id: "13",
    name: "Razer Blade 15 Gaming",
    price: 2650000,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop",
    ],
    description: "Premium gaming laptop with sleek design, RTX 4080 graphics, and RGB everything.",
    category: "gaming",
    brand: "Razer",
    rating: 4.7,
    reviews: 156,
    inStock: true,
    specs: {
      processor: "Intel Core i9-13950HX",
      ram: "32GB DDR5",
      storage: "1TB NVMe SSD",
      gpu: "NVIDIA RTX 4080 12GB",
      display: "15.6\" QHD 240Hz",
      battery: "80Wh",
      screenSize: "15.6",
    },
  },
  {
    id: "14",
    name: "LG Gram 17 Ultrabook",
    price: 1850000,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=500&fit=crop",
    ],
    description: "Ultra-lightweight 17-inch laptop with incredible battery life and large display.",
    category: "ultrabook",
    brand: "LG",
    rating: 4.6,
    reviews: 89,
    inStock: true,
    specs: {
      processor: "Intel Core i7-1360P",
      ram: "16GB LPDDR5",
      storage: "1TB SSD",
      gpu: "Intel Iris Xe",
      display: "17\" WQXGA",
      battery: "80Wh",
      screenSize: "17",
    },
  },
  {
    id: "15",
    name: "HP EliteBook 840 G10",
    price: 1350000,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop",
    ],
    description: "Enterprise-grade business laptop with advanced security features and durability.",
    category: "business",
    brand: "HP",
    rating: 4.7,
    reviews: 112,
    inStock: true,
    specs: {
      processor: "Intel Core i7-1355U",
      ram: "16GB DDR5",
      storage: "512GB SSD",
      gpu: "Intel Iris Xe",
      display: "14\" FHD",
      battery: "51Wh",
      screenSize: "14",
    },
  },
];

export const productReviews: Review[] = [
  {
    id: "r1",
    productId: "1",
    userName: "John Doe",
    rating: 5,
    comment: "Amazing gaming laptop! Graphics are incredible and runs all games smoothly at high settings.",
    date: "2025-10-15",
  },
  {
    id: "r2",
    productId: "1",
    userName: "Sarah Smith",
    rating: 4,
    comment: "Great performance but gets a bit hot during intense gaming sessions.",
    date: "2025-10-20",
  },
  {
    id: "r3",
    productId: "3",
    userName: "Mike Johnson",
    rating: 5,
    comment: "Best laptop I've ever owned! M3 chip is blazing fast and battery lasts all day.",
    date: "2025-10-18",
  },
];