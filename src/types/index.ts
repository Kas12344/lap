
export type LaptopCondition = "New" | "Used" | "Refurbished";

export interface Laptop {
  id: string;
  name: string;
  brand: string;
  ram: string;
  processor: string;
  storage: string;
  graphics: string;
  display: string;
  price: number; // in PKR
  condition: LaptopCondition;
  imageUrl: string; // Main image URL
  images?: string[]; // Optional: for additional images/gallery
  specs: string; // Detailed raw specifications for AI summary
  description?: string; // Human-readable summary, potentially AI-generated
  featured?: boolean;
  newArrival?: boolean;
  stock: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  dataAiHint?: string; // For image generation hints for the main image
}

export interface CartItem {
  laptop: Laptop;
  quantity: number;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
}

export interface Brand {
  id: string;
  name: string;
  logoUrl?: string;
}

// For ProductForm, ensure all optional fields in Laptop are handled
export type ProductFormData = Omit<Laptop, 'id' | 'createdAt' | 'updatedAt'> & {
  // if any field needs specific handling for forms not directly in Laptop type
};
