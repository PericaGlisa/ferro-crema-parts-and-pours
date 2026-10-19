import { Link, useNavigate } from "@tanstack/react-router";
import {
  Heart,
  Search,
  ShoppingBag,
  Minus,
  Plus,
  X,
  ArrowUpRight,
  ArrowRight,
  Menu,
  Truck,
  ChevronDown,
  ScanLine,
  Package,
  Wrench,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { topCategories, subcategoriesOf, FREE_SHIPPING_THRESHOLD } from "@/data/seed";
import { catalog } from "@/data/catalogService";
import { rsd, useStore } from "@/lib/store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ProductImage } from "./ProductImage";
import { MobileMenu } from "./MobileMenu";

function Wordmark({ footer = false }: { footer?: boolean }) {
  return (
    <div>
      <div className={`text-xl font-extrabold sm:text-2xl ${footer ? "text-hero-foreground" : ""}`}>
        Ferro Crema
      </div>
      <div
        className={`mt-1 max-w-48 text-[9px] leading-4 sm:max-w-none ${footer ? "text-hero-muted" : "text-muted-foreground"}`}
      >
        Delovi za espresso aparate i mlinove
      </div>
    </div>
  );
}

function SearchBox() {
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const nav = useNavigate();
  const res = q.trim().length > 1 ? catalog.search(q.trim()) : null;
  const go = () => {
    if (!q.trim()) return;
    nav({ to: "/prodavnica", search: { q: q.trim() } });
    setQ("");
    setFocused(false);
  };
  return (
    <div className="relative w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          go();
        }}
        className="flex h-11 items-center rounded border border-transparent bg-muted px-3 transition-colors focus-within:border-input focus-within:bg-card"
      >
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          aria-label="Pretraga proizvoda"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 180)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setFocused(false);
          }}
          placeholder="Naziv dela, OEM kod ili model aparata…"
          className="h-full min-w-0 w-full bg-transparent px-3 text-xs outline-none"
        />
        {q && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            aria-label="Obriši pretragu"
            onClick={() => setQ("")}
          >
            <X />
          </Button>
        )}
      </form>
      {res && focused && (
        <div className="absolute left-0 right-0 top-12 z-50 rounded-md border bg-popover p-2 shadow-lift">
          <p className="px-2 py-2 font-mono text-[9px] uppercase text-muted-foreground">
            Rezultati pretrage
          </p>
          {res.products.length === 0 && (
            <p className="p-3 text-sm text-muted-foreground">Nema rezultata za „{q}“.</p>
          )}
          {res.products.map((p) => (
            <Link
              key={p.id}
              to="/proizvod/$slug"
              params={{ slug: p.slug }}
              onClick={() => {
                setQ("");
                setFocused(false);
              }}
              className="flex items-center gap-3 rounded p-2 hover:bg-muted"
            >
              <ProductImage p={p} className="h-12 w-12 shrink-0 rounded" />
              <span className="min-w-0 flex-1 text-xs font-medium">{p.name.sr}</span>
              <span className="text-[10px] font-bold">{rsd(p.price)}</span>
            </Link>
          ))}
          {res.products.length > 0 && (
            <Button variant="ghost" onClick={go} className="mt-1 w-full justify-between text-xs">
              Prikaži sve rezultate <ArrowRight />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function CartDrawer() {
  const { cart, cartOpen, setCartOpen, setQty, remove } = useStore();
  const items = cart.flatMap((l) => {
    const p = catalog.getProductsByIds([l.productId])[0];
    return p ? [{ ...l, p }] : [];
  });
  const subtotal = items.reduce((s, l) => s + l.p.price * l.qty, 0);
  const left = FREE_SHIPPING_THRESHOLD - subtotal;
  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="flex w-full flex-col gap-5 p-6 sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">
            Vaša korpa
            <span className="ml-2 text-sm font-normal text-muted-foreground">({items.length})</span>
          </SheetTitle>
          <SheetDescription>Izabrani delovi za vaš sledeći espresso.</SheetDescription>
        </SheetHeader>
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <ShoppingBag className="h-12 w-12 stroke-1 text-muted-foreground" />
            <p className="font-semibold">Korpa čeka pravi deo.</p>
            <Button asChild onClick={() => setCartOpen(false)}>
              <Link to="/prodavnica">
                Istražite ponudu <ArrowRight />
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="rounded bg-secondary p-4 text-xs">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                {left > 0 ? (
                  <span>
                    Do besplatne dostave još <b>{rsd(left)}</b>
                  </span>
                ) : (
                  "Dostava je besplatna."
                )}
              </div>
              <Progress
                className="mt-3 h-1"
                value={Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}
              />
            </div>
            <div className="flex-1 space-y-5 overflow-y-auto">
              {items.map(({ p, qty }) => (
                <div key={p.id} className="flex gap-3 border-b pb-5">
                  <ProductImage p={p} className="h-20 w-20 shrink-0 rounded" />
                  <div className="min-w-0 flex-1">
                    <Link
                      to="/proizvod/$slug"
                      params={{ slug: p.slug }}
                      onClick={() => setCartOpen(false)}
                      className="text-xs font-bold"
                    >
                      {p.name.sr}
                    </Link>
                    <div className="mt-1 font-mono text-[9px] text-muted-foreground">{p.sku}</div>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="flex h-8 items-center rounded border">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          aria-label="Manje"
                          onClick={() => setQty(p.id, qty - 1)}
                        >
                          <Minus />
                        </Button>
                        <span className="w-6 text-center text-xs">{qty}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          aria-label="Više"
                          onClick={() => setQty(p.id, qty + 1)}
                        >
                          <Plus />
                        </Button>
                      </div>
                      <span className="text-xs font-bold">{rsd(p.price * qty)}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    aria-label="Ukloni"
                    onClick={() => remove(p.id)}
                  >
                    <X />
                  </Button>
                </div>
              ))}
            </div>
            <div className="border-t pt-5">
              <div className="flex justify-between text-lg font-bold">
                <span>Međuzbir</span>
                <span>{rsd(subtotal)}</span>
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">PDV uključen</p>
              <Button
                asChild
                className="mt-4 h-12 w-full bg-crema text-crema-foreground"
                onClick={() => setCartOpen(false)}
              >
                <Link to="/checkout">
                  Nastavi na plaćanje <ArrowRight />
                </Link>
              </Button>
              <p className="mt-2 text-center text-[10px] text-muted-foreground">
                Plaćanje pouzećem ili uplatnicom.
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export function ShopLayout({ children }: { children: ReactNode }) {
  const { cart, wishlist, setCartOpen, toggleWish, add } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [wishesOpen, setWishesOpen] = useState(false);
  const count = cart.reduce((s, l) => s + l.qty, 0);
  const wishes = catalog.getProductsByIds(wishlist);
  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-hero text-hero-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-5 py-2 text-[10px] md:justify-between md:px-8">
          <span className="hidden items-center gap-2 text-hero-muted md:flex">
            <span className="h-1 w-1 rounded-full bg-hero-accent" /> Preciznost u svakom detalju.
          </span>
          <span className="flex items-center gap-2">
            <Truck className="h-3 w-3 text-hero-accent" /> Besplatna dostava preko{" "}
            {rsd(FREE_SHIPPING_THRESHOLD)}
          </span>
          <span className="hidden text-hero-muted md:block">
            Poručeno do 14h — šaljemo isti dan
          </span>
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-md">
        <div className="mx-auto grid max-w-7xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-4 py-3 lg:flex lg:gap-8 lg:px-8 lg:py-4">
          <Button
            variant="ghost"
            size="icon"
            className="-ml-2 h-11 w-11 lg:hidden"
            aria-label="Otvori meni"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <Menu />
          </Button>
          <Link to="/" aria-label="Ferro Crema početna" className="shrink-0">
            <Wordmark />
          </Link>
          <div className="hidden max-w-xl flex-1 lg:block">
            <SearchBox />
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-0 lg:gap-4">
            <Button
              variant="ghost"
              className="relative h-10 gap-2 px-2"
              onClick={() => setWishesOpen(true)}
              aria-label="Lista želja"
            >
              <Heart className="h-5 w-5" />
              <span className="hidden text-[11px] lg:inline">Sačuvano</span>
              {wishlist.length > 0 && (
                <span className="absolute right-0 top-0 rounded-full bg-crema px-1 text-[9px] text-crema-foreground">
                  {wishlist.length}
                </span>
              )}
            </Button>
            <div className="hidden h-6 border-l md:block" />
            <Button
              variant="ghost"
              onClick={() => setCartOpen(true)}
              className="h-10 gap-2 px-2"
              aria-label="Korpa"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="hidden text-[11px] lg:inline">Korpa</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[9px] text-primary-foreground">
                {count}
              </span>
            </Button>
          </div>
        </div>
        <div className="px-4 pb-3 lg:hidden">
          <SearchBox />
        </div>
        <div className="border-t border-border/60">
          <nav
            aria-label="Glavne kategorije"
            className="mx-auto hidden max-w-7xl items-center justify-between px-8 lg:flex"
          >
            {topCategories.map((c) => (
              <div key={c.id} className="group relative">
                <Link
                  to="/prodavnica"
                  search={{ category: c.slug }}
                  className="flex items-center gap-1.5 py-3 pr-3 text-[10px] font-semibold transition-colors hover:text-steel lg:text-[11px]"
                >
                  {c.name.sr
                    .replace("Rezervni delovi – espresso aparati", "Delovi za aparate")
                    .replace("Rezervni delovi – mlinovi", "Delovi za mlinove")}
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </Link>
                <div className="invisible absolute left-0 top-full z-50 w-64 translate-y-1 rounded-b-md border bg-popover p-3 opacity-0 shadow-lift transition group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="px-2 py-2 font-mono text-[9px] uppercase text-muted-foreground">
                    {c.name.sr}
                  </p>
                  {subcategoriesOf(c.id).map((s) => (
                    <Link
                      key={s.id}
                      to="/prodavnica"
                      search={{ category: s.slug }}
                      className="flex items-center justify-between rounded px-2 py-2 text-xs hover:bg-muted"
                    >
                      {s.name.sr}
                      <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <Link
              to="/prodavnica"
              search={{ onSale: true }}
              className="flex items-center gap-1.5 py-3 text-[11px] font-bold text-alert"
            >
              <span className="h-1 w-1 rounded-full bg-alert" /> Akcije
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-hero text-hero-foreground">
        <div className="mx-auto grid max-w-7xl gap-9 px-5 py-12 sm:grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:px-8">
          <div>
            <Link to="/">
              <Wordmark footer />
            </Link>
            <p className="mt-5 max-w-xs text-xs leading-6 text-hero-muted">
              Dobar espresso počinje od detalja.
              <br />
              Delovi, alat i oprema za vaš svakodnevni ritual.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 font-mono text-[9px] text-hero-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-hero-accent" /> BEOGRAD, SRBIJA
            </span>
          </div>
          <div>
            <h3 className="text-xs font-bold">Istražite ponudu</h3>
            <div className="mt-5 flex flex-col gap-3 text-xs text-hero-muted">
              {topCategories.slice(0, 3).map((c) => (
                <Link
                  key={c.id}
                  to="/prodavnica"
                  search={{ category: c.slug }}
                  className="hover:text-hero-accent"
                >
                  {c.name.sr.replace("Rezervni delovi – ", "Delovi za ")}
                </Link>
              ))}
              <Link to="/prodavnica" search={{ onSale: true }} className="hover:text-hero-accent">
                Aktuelne akcije
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold">Za vaš aparat</h3>
            <div className="mt-5 flex flex-col gap-3 text-xs text-hero-muted">
              {["La Marzocco", "Rancilio", "Gaggia", "Rocket"].map((name) => (
                <Link
                  key={name}
                  to="/prodavnica"
                  search={{ machineBrand: name }}
                  className="hover:text-hero-accent"
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold">Pravi deo, bez nagađanja.</h3>
            <p className="mt-5 text-xs leading-6 text-hero-muted">
              Pronađite delove po modelu aparata ili originalnom OEM kodu.
            </p>
            <Link
              to="/prodavnica"
              className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-hero-accent"
            >
              Pronađite svoj deo <ArrowUpRight className="h-4 w-4" />
            </Link>
            <p className="mt-5 font-mono text-[9px] text-hero-muted">
              Sve cene su u RSD, sa PDV-om.
            </p>
          </div>
        </div>
        <div className="border-t border-hero-muted/20">
          <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3 px-5 py-5 text-[10px] text-hero-muted md:px-8">
            <span>© 2026 Ferro Crema. Sva prava zadržana.</span>
            <span>Za godine dobrog espressa.</span>
          </div>
        </div>
      </footer>
      <CartDrawer />
      <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} />
      <Sheet open={wishesOpen} onOpenChange={setWishesOpen}>
        <SheetContent className="overflow-y-auto p-6">
          <SheetHeader>
            <SheetTitle>Sačuvani delovi</SheetTitle>
            <SheetDescription>Vaša lista želja ({wishes.length})</SheetDescription>
          </SheetHeader>
          {wishes.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-4 text-center">
              <Heart className="h-10 w-10 stroke-1 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Još nema sačuvanih delova.</p>
              <Button onClick={() => setWishesOpen(false)} asChild>
                <Link to="/prodavnica">
                  Istražite ponudu <ArrowRight />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              {wishes.map((p) => (
                <div key={p.id} className="flex gap-3 border-b pb-5">
                  <ProductImage p={p} className="h-20 w-20 shrink-0 rounded" />
                  <div className="min-w-0 flex-1">
                    <Link
                      to="/proizvod/$slug"
                      params={{ slug: p.slug }}
                      onClick={() => setWishesOpen(false)}
                      className="text-xs font-bold"
                    >
                      {p.name.sr}
                    </Link>
                    <p className="mt-2 text-sm font-bold">{rsd(p.price)}</p>
                    <Button
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        setWishesOpen(false);
                        add(p.id);
                      }}
                    >
                      Dodaj u korpu <Plus />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Ukloni sačuvani deo"
                    onClick={() => toggleWish(p.id)}
                    className="h-7 w-7 shrink-0"
                  >
                    <X />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
