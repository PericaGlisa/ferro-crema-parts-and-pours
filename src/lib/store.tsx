import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type CartLine = { productId: string; qty: number };
type Store = {
  cart: CartLine[];
  wishlist: string[];
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clearCart: () => void;
  toggleWish: (id: string) => void;
};

const Ctx = createContext<Store | null>(null);
const KEY = "ferro-crema-store";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) ?? "{}");
      if (Array.isArray(s.cart)) setCart(s.cart);
      if (Array.isArray(s.wishlist)) setWishlist(s.wishlist);
    } catch {
      // ignore corrupted or unavailable localStorage
    }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify({ cart, wishlist }));
  }, [cart, wishlist, loaded]);

  const value: Store = {
    cart,
    wishlist,
    cartOpen,
    setCartOpen,
    add: (id, qty = 1) => {
      setCart((c) => {
        const ex = c.find((l) => l.productId === id);
        return ex
          ? c.map((l) => (l.productId === id ? { ...l, qty: l.qty + qty } : l))
          : [...c, { productId: id, qty }];
      });
      setCartOpen(true);
    },
    setQty: (id, qty) =>
      setCart((c) =>
        qty <= 0
          ? c.filter((l) => l.productId !== id)
          : c.map((l) => (l.productId === id ? { ...l, qty } : l)),
      ),
    remove: (id) => setCart((c) => c.filter((l) => l.productId !== id)),
    clearCart: () => setCart([]),
    toggleWish: (id) =>
      setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id])),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore outside provider");
  return s;
}

const fmt = new Intl.NumberFormat("sr-RS", { maximumFractionDigits: 0 });
export const rsd = (n: number) => `${fmt.format(n)} RSD`;
