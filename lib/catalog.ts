/**
 * Catalogue data access. Prefers Supabase; falls back to the bundled arrays in
 * lib/products.ts whenever Supabase is not configured or a query fails, so the
 * site always builds and renders.
 *
 * Server-only usage (pages / route handlers / sitemap). Pages that call these
 * should set `export const revalidate = <seconds>` to re-pull on a schedule.
 */
import "server-only";

import { supabasePublic, supabaseEnabled } from "./supabase";
import {
  CATEGORIES as FALLBACK_CATEGORIES,
  PRODUCTS as FALLBACK_PRODUCTS,
  type Category,
  type Product,
} from "./products";

interface ProductRow {
  slug: string;
  name: string;
  category_key: string;
  price: number;
  price_from: boolean;
  tagline: string;
  description: string;
  matiere: string;
  finition: string;
  dimensions: string;
  delai: string;
  badge: string | null;
  image_url: string | null;
}

function rowToProduct(r: ProductRow): Product {
  return {
    slug: r.slug,
    name: r.name,
    category: r.category_key,
    price: r.price,
    priceFrom: r.price_from,
    tagline: r.tagline,
    description: r.description,
    matiere: r.matiere,
    finition: r.finition,
    dimensions: r.dimensions,
    delai: r.delai,
    badge: r.badge ?? undefined,
    image_url: r.image_url,
  };
}

export async function getCategories(): Promise<Category[]> {
  const sb = supabasePublic();
  if (!sb) return FALLBACK_CATEGORIES;
  const { data, error } = await sb
    .from("categories")
    .select("key,label,blurb")
    .order("sort_order", { ascending: true });
  if (error || !data?.length) return FALLBACK_CATEGORIES;
  return data as Category[];
}

export async function getAllProducts(): Promise<Product[]> {
  const sb = supabasePublic();
  if (!sb) return FALLBACK_PRODUCTS;
  const { data, error } = await sb
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error || !data?.length) return FALLBACK_PRODUCTS;
  return (data as ProductRow[]).map(rowToProduct);
}

export async function getProductsByCategory(key: string): Promise<Product[]> {
  return (await getAllProducts()).filter((p) => p.category === key);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return (await getAllProducts()).find((p) => p.slug === slug) ?? null;
}

export async function getRelated(p: Product, n = 3): Promise<Product[]> {
  return (await getAllProducts())
    .filter((x) => x.category === p.category && x.slug !== p.slug)
    .slice(0, n);
}

export async function getCategory(key: string): Promise<Category | null> {
  return (await getCategories()).find((c) => c.key === key) ?? null;
}

export interface Testimonial {
  quote: string;
  prenom: string;
  ville: string;
  rating: number;
}

/** Published testimonials, or [] when none/unconfigured (section shows its
 *  editable placeholders instead). */
export async function getTestimonials(): Promise<Testimonial[]> {
  const sb = supabasePublic();
  if (!sb) return [];
  const { data, error } = await sb
    .from("testimonials")
    .select("quote,prenom,ville,rating")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  return data as Testimonial[];
}

export { supabaseEnabled };