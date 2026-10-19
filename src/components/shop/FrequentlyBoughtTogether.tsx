import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, Check, ShoppingBag, ArrowRight, Sparkles, Tag } from "lucide-react";
import type { Product } from "@/data/types";
import { catalog } from "@/data/catalogService";
import { rsd, useStore } from "@/lib/store";
import { ProductImage } from "./ProductImage";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FrequentlyBoughtTogetherProps {
  mainProduct: Product;
}

export function FrequentlyBoughtTogether({ mainProduct }: FrequentlyBoughtTogetherProps) {
  const { add, setCartOpen } = useStore();

  // Find complementary bundle products
  const bundleItems: Product[] = useMemo(() => {
    // 1. Try related items
    const related = catalog.getProductsByIds(mainProduct.relatedIds ?? []);
    if (related.length >= 2) {
      return [mainProduct, related[0], related[1]];
    }

    // 2. Fallback to intelligent complementary products from maintenance/accessories
    const all = catalog
      .listProducts({ perPage: 60 })
      .products.filter((p) => p.id !== mainProduct.id && p.stock > 0);

    const complementary = all.filter((p) => {
      // If main is gasket, find shower screen or maintenance
      if (mainProduct.categoryIds.includes("dihtunzi")) {
        return (
          p.categoryIds.includes("tus-sita") ||
          p.categoryIds.includes("odrzavanje") ||
          p.categoryIds.includes("barista-alat")
        );
      }
      // If main is burrs, find grinder maintenance or brush
      if (mainProduct.categoryIds.includes("nozevi-burrs")) {
        return p.categoryIds.includes("odrzavanje") || p.categoryIds.includes("barista-alat");
      }
      // Default: find any maintenance or barista tool
      return (
        p.categoryIds.includes("odrzavanje") ||
        p.categoryIds.includes("barista-alat") ||
        p.categoryIds.includes("dihtunzi")
      );
    });

    const chosen = [...related, ...complementary].filter(
      (p, i, self) => self.findIndex((x) => x.id === p.id) === i && p.id !== mainProduct.id,
    );

    return [mainProduct, chosen[0] ?? all[0], chosen[1] ?? all[1]].filter(Boolean);
  }, [mainProduct]);

  // Selected product IDs in bundle (all checked by default)
  const [selectedIds, setSelectedIds] = useState<string[]>(() => bundleItems.map((p) => p.id));

  const toggleSelect = (id: string) => {
    if (id === mainProduct.id) return; // Main product cannot be deselected
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const selectedProducts = bundleItems.filter((p) => selectedIds.includes(p.id));
  const count = selectedProducts.length;

  const rawTotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);
  const isBundleEligible = count >= 2;
  const discountMultiplier = isBundleEligible ? 0.9 : 1; // 10% bundle discount
  const finalTotal = Math.round((rawTotal * discountMultiplier) / 10) * 10;
  const savings = rawTotal - finalTotal;

  const handleAddBundle = () => {
    selectedProducts.forEach((p) => {
      add(p.id, 1);
    });

    if (savings > 0) {
      toast.success(`Servisni komplet dodat u korpu (${count} artikla) — ušteda ${rsd(savings)}!`);
    } else {
      toast.success(`Artikal dodat u korpu`);
    }

    setCartOpen(true);
  };

  if (bundleItems.length < 2) return null;

  return (
    <section className="mt-14 rounded-xl border bg-card/60 p-6 shadow-sm md:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded bg-crema/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-crema">
              <Sparkles className="h-3 w-3" /> Preporučeni komplet
            </span>
            {isBundleEligible && (
              <span className="rounded bg-ok/15 px-2 py-0.5 text-[10px] font-bold text-ok">
                -10% popusta na paket
              </span>
            )}
          </div>
          <h2 className="mt-2 text-xl font-extrabold tracking-tight md:text-2xl">
            Često se kupuje zajedno
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Kombinujte komplementarne delove za servis i redovno održavanje uz uštedu.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
        {/* Visual products chain */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {bundleItems.map((p, idx) => {
            const isMain = p.id === mainProduct.id;
            const isChecked = selectedIds.includes(p.id);

            return (
              <div key={p.id} className="flex items-center gap-3 sm:gap-4">
                <div
                  onClick={() => toggleSelect(p.id)}
                  className={`group relative flex w-28 flex-col items-center rounded-lg border p-2.5 transition-all sm:w-32 ${
                    isMain ? "cursor-default" : "cursor-pointer"
                  } ${
                    isChecked
                      ? "border-primary/50 bg-background shadow-sm"
                      : "border-border/60 bg-muted/30 opacity-60 hover:opacity-85"
                  }`}
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded">
                    <ProductImage p={p} className="h-full w-full object-cover" />
                    {isMain && (
                      <span className="absolute left-1 top-1 rounded bg-foreground px-1 font-mono text-[8px] font-bold text-background">
                        Ovaj deo
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <span className="line-clamp-2 text-[11px] font-semibold leading-tight group-hover:text-primary">
                      {p.name.sr}
                    </span>
                    <span className="mt-1 block font-mono text-xs font-bold text-foreground">
                      {rsd(p.price)}
                    </span>
                  </div>

                  {/* Small checkbox indicator */}
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <div
                      className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                        isChecked
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input bg-card"
                      }`}
                    >
                      {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                    <span>{isMain ? "Obavezno" : isChecked ? "Izabrano" : "Dodaj"}</span>
                  </div>
                </div>

                {idx < bundleItems.length - 1 && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Plus className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pricing Summary and Action Box */}
        <div className="flex flex-col justify-between rounded-lg border bg-secondary/40 p-5">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Ukupno za {count} {count === 1 ? "artikal" : count < 5 ? "artikla" : "artikala"}:
            </div>

            <div className="mt-3 flex items-baseline gap-3">
              <span className="num text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
                {rsd(finalTotal)}
              </span>
              {savings > 0 && (
                <span className="num text-sm text-muted-foreground line-through">
                  {rsd(rawTotal)}
                </span>
              )}
            </div>

            {savings > 0 ? (
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-ok/15 px-2.5 py-1 text-xs font-bold text-ok">
                <Tag className="h-3.5 w-3.5" /> Ušteda u kompletu: {rsd(savings)}
              </div>
            ) : (
              <p className="mt-2 text-[11px] text-muted-foreground">
                Izaberite 2 ili više delova za 10% popusta na ceo paket.
              </p>
            )}

            <p className="mt-2 text-[10px] text-muted-foreground">
              PDV uključen · Isporuka 1–2 radna dana
            </p>
          </div>

          <Button
            size="lg"
            onClick={handleAddBundle}
            className="mt-5 h-12 w-full gap-2 bg-crema text-xs font-bold text-crema-foreground transition-all hover:bg-crema/90 active:scale-[0.99]"
          >
            <ShoppingBag className="h-4 w-4" />
            Dodaj ceo komplet u korpu ({rsd(finalTotal)})
          </Button>
        </div>
      </div>
    </section>
  );
}
