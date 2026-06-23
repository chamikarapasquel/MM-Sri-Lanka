/* ──────────────────────────────────────────────────────
 *  MM Sri Lanka – Utility functions
 * ────────────────────────────────────────────────────── */

import type { StockStatus } from "@/types";

// ─── Class Name Merge (lightweight clsx + twMerge) ──────
/**
 * Merge class names, filtering out falsy values.
 * Works as a lightweight replacement for clsx.
 *
 * @example cn("base", isActive && "active", undefined, "always")
 */
export function cn(
  ...classes: (string | boolean | undefined | null)[]
): string {
  return classes.filter(Boolean).join(" ");
}

// ─── Price Formatting ───────────────────────────────────
/**
 * Format a number as Sri Lankan Rupees.
 *
 * @example formatPrice(125999.5)  → "Rs. 125,999.50"
 * @example formatPrice(0)         → "Rs. 0.00"
 */
export function formatPrice(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// ─── Slug Generation ────────────────────────────────────
/**
 * Generate a URL-safe slug from a product / category name.
 *
 * @example generateSlug("ASUS ROG Strix RTX 4090")
 *          → "asus-rog-strix-rtx-4090"
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")   // remove non-word chars (except spaces & hyphens)
    .replace(/[\s_]+/g, "-")    // spaces / underscores → hyphen
    .replace(/-+/g, "-")        // collapse consecutive hyphens
    .replace(/^-+|-+$/g, "");   // trim leading/trailing hyphens
}

// ─── Discount Calculation ───────────────────────────────
/**
 * Return the discount percentage between original and current price.
 * Returns 0 when the original is not greater than the current price.
 *
 * @example calculateDiscount(50000, 42500) → 15
 */
export function calculateDiscount(
  originalPrice: number,
  currentPrice: number
): number {
  if (originalPrice <= 0 || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

// ─── Text Truncation ────────────────────────────────────
/**
 * Truncate text to a given length, appending "…" if truncated.
 *
 * @example truncateText("Hello world", 5) → "Hello…"
 */
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + "…";
}

// ─── Stock Status Helper ────────────────────────────────
/**
 * Returns a human-readable label and a Tailwind-friendly color
 * string based on the current stock level.
 */
export function getStockStatus(stock: number): StockStatus {
  if (stock <= 0) {
    return { label: "Out of Stock", color: "text-red-500" };
  }
  if (stock <= 5) {
    return { label: `Only ${stock} left`, color: "text-amber-400" };
  }
  if (stock <= 20) {
    return { label: "Low Stock", color: "text-yellow-400" };
  }
  return { label: "In Stock", color: "text-neon-green" };
}

// ─── Debounce ───────────────────────────────────────────
/**
 * Returns a debounced version of the provided function.
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

// ─── Capitalise First Letter ────────────────────────────
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ─── Generate Random ID ────────────────────────────────
export function generateId(length = 12): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ─── Date Formatting ────────────────────────────────────
/**
 * Format an ISO date string into a human-readable format.
 *
 * @example formatDate("2024-06-15T10:30:00Z") → "Jun 15, 2024"
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format an ISO date string with time.
 *
 * @example formatDateTime("2024-06-15T10:30:00Z") → "Jun 15, 2024, 10:30 AM"
 */
export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
