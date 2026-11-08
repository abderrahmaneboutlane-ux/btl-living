"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import type { CartLine } from "@/lib/cart";
import { cartCount, cartSubtotal } from "@/lib/cart";

type AddInput = { slug: string; name: string; price: number; priceFrom?: boolean };

type Action =
  | { type: "add"; item: AddInput; qty: number }
  | { type: "setQty"; slug: string; qty: number }
  | { type: "remove"; slug: string }
  | { type: "clear" }
  | { type: "hydrate"; lines: CartLine[] };

function reducer(state: CartLine[], action: Action): CartLine[] {
  switch (action.type) {
    case "hydrate":
      return action.lines;
    case "add": {
      const found = state.find((l) => l.slug === action.item.slug);
      if (found) {
        return state.map((l) =>
          l.slug === action.item.slug ? { ...l, qty: l.qty + action.qty } : l,
        );
      }
      return [...state, { ...action.item, qty: action.qty }];
    }
    case "setQty":
      return state
        .map((l) => (l.slug === action.slug ? { ...l, qty: action.qty } : l))
        .filter((l) => l.qty > 0);
    case "remove":
      return state.filter((l) => l.slug !== action.slug);
    case "clear":
      return [];
    default:
      return state;
  }
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (item: AddInput, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "btl-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, dispatch] = useReducer(reducer, []);

  // hydrate from localStorage once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        if (Array.isArray(parsed)) dispatch({ type: "hydrate", lines: parsed });
      }
    } catch {
      /* ignore */
    }
  }, []);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count: cartCount(lines),
      subtotal: cartSubtotal(lines),
      add: (item, qty = 1) => dispatch({ type: "add", item, qty }),
      setQty: (slug, qty) => dispatch({ type: "setQty", slug, qty }),
      remove: (slug) => dispatch({ type: "remove", slug }),
      clear: () => dispatch({ type: "clear" }),
    }),
    [lines],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}