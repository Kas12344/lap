
export const WHATSAPP_NUMBER = "+923090009022";
export const WHATSAPP_LINK_BASE = "https://wa.me/";
export const EMAIL_ADDRESS = "aasim4260@gmail.com";
export const PHYSICAL_ADDRESS = "Hafeez Centre, Lahore";

export const POPULAR_BRANDS = ["Dell", "HP", "Lenovo", "Apple", "Asus"];

export const RAM_OPTIONS = ["4GB", "8GB", "12GB", "16GB", "32GB", "64GB"];
export const PROCESSOR_OPTIONS = [
  "Intel Core i3",
  "Intel Core i5",
  "Intel Core i7",
  "Intel Core i9",
  "AMD Ryzen 3",
  "AMD Ryzen 5",
  "AMD Ryzen 7",
  "AMD Ryzen 9",
  "Apple M1",
  "Apple M2",
  "Apple M3",
];
export const CONDITION_OPTIONS: ReadonlyArray<LaptopCondition> = ["New", "Used", "Refurbished"];

export type LaptopCondition = "New" | "Used" | "Refurbished";

// Admin Authentication (Prototype - Insecure)
export const ADMIN_USERNAME = "admin";
export const ADMIN_PASSWORD = "password"; // IMPORTANT: For prototype only. Use hashed passwords in production.
export const AUTH_COOKIE_NAME = "lapzen-admin-auth";
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
