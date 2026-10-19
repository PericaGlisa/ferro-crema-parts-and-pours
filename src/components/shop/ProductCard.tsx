import { Link } from "@tanstack/react-router";
import { Heart, Plus, ArrowUpRight } from "lucide-react";
import type { Product } from "@/data/types";
import { brands } from "@/data/seed";
import { rsd, useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ProductImage } from "./ProductImage";

export function ProductCard({ p }: { p: Product }) {
  const { add, wishlist, toggleWish } = useStore();
  const wished = wishlist.includes(p.id);
  const brand = brands.find((b) => b.id === p.brandId)?.name;
  return (
    <div className="group relative flex min-w-0 flex-col rounded-md border bg-card transition-shadow hover:shadow-lift">
      <Button
        variant="ghost"
        size="icon"
        aria-label={wished ? "Ukloni iz liste želja" : "Sačuvaj u listu želja"}
        aria-pressed={wished}
        title={wished ? "Ukloni iz liste želja" : "Sačuvaj u listu želja"}
        onClick={() => toggleWish(p.id)}
        className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full bg-card/90"
      >
        <Heart
          className={`h-4 w-4 ${wished ? "fill-crema text-crema" : "text-muted-foreground"}`}
        />
      </Button>
      {p.compareAtPrice && (
        <span className="absolute left-3 top-3 z-10 rounded bg-alert px-2 py-0.5 text-xs font-medium text-destructive-foreground">
          -{Math.round((1 - p.price / p.compareAtPrice) * 100)}%
        </span>
      )}
      <Link to="/proizvod/$slug" params={{ slug: p.slug }} className="block">
        <ProductImage p={p} className="aspect-square w-full rounded-t-md" />
        <div className="px-3 pt-4 md:px-4">
          <div className="font-mono text-[9px] uppercase text-muted-foreground">{brand}</div>
          <h3 className="mt-2 line-clamp-2 min-h-10 text-xs font-bold leading-5 md:text-sm">
            {p.name.sr}
          </h3>
          <div className="mt-2 font-mono text-[9px] text-muted-foreground">SKU {p.sku}</div>
        </div>
      </Link>
      <div className="mt-auto p-3 md:p-4">
        <div className={`text-[10px] ${p.stock > 0 ? "text-ok" : "text-muted-foreground"}`}>
          {p.stock > 0
            ? "● Na stanju"
            : `○ Po porudžbini${p.leadTimeDays ? ` · ${p.leadTimeDays} dana` : ""}`}
        </div>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-2 border-t pt-3">
          <div>
            <div className="text-sm font-extrabold md:text-base">{rsd(p.price)}</div>
            {p.compareAtPrice && (
              <div className="text-xs text-muted-foreground line-through">
                {rsd(p.compareAtPrice)}
              </div>
            )}
          </div>
          <Button
            size="icon"
            className="h-8 w-8 rounded"
            title="Dodaj u korpu"
            aria-label={`Dodaj u korpu: ${p.name.sr}`}
            onClick={() => add(p.id)}
          >
            <Plus />
          </Button>
        </div>
      </div>
    </div>
  );
}
