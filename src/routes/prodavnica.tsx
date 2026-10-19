import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SlidersHorizontal, X, ChevronRight, SearchX } from "lucide-react";
import { catalog } from "@/data/catalogService";
import type { SortKey, FacetValue } from "@/data/types";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

type S = {
  category?: string;
  q?: string;
  brand?: string;
  machineBrand?: string;
  machineModel?: string;
  portafilter?: number;
  availability?: "in-stock" | "backorder";
  onSale?: boolean;
  sort?: SortKey;
  page?: number;
};
const str = (v: unknown) => (typeof v === "string" && v ? v : undefined);

export const Route = createFileRoute("/prodavnica")({
  validateSearch: (s: Record<string, unknown>): S => ({
    category: str(s.category),
    q: str(s.q),
    brand: str(s.brand),
    machineBrand: str(s.machineBrand),
    machineModel: str(s.machineModel),
    portafilter: Number(s.portafilter) > 0 ? Number(s.portafilter) : undefined,
    availability:
      s.availability === "in-stock" || s.availability === "backorder" ? s.availability : undefined,
    onSale: s.onSale === true || s.onSale === "true" ? true : undefined,
    sort: str(s.sort) as SortKey | undefined,
    page: Number(s.page) > 1 ? Number(s.page) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Prodavnica delova — Ferro Crema — delovi za espresso aparate i mlinove" },
      {
        name: "description",
        content:
          "Katalog rezervnih delova za espresso aparate i mlinove. Dihtunzi, sita, portafilteri, pumpe i servisni setovi. Brza pretraga po modelu aparata.",
      },
      { property: "og:title", content: "Prodavnica delova — Ferro Crema" },
      {
        property: "og:description",
        content:
          "Svi delovi za espresso aparate i mlinove na jednom mestu. E61, La Marzocco, Rancilio, Gaggia, Rocket i Mazzer.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/og-image.jpg" },
    ],
  }),
  component: Plp,
});

const PER_PAGE = 24;

function Plp() {
  const s = Route.useSearch();
  const nav = Route.useNavigate();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const page = s.page ?? 1;
  const res = catalog.listProducts({ ...s, search: s.q, page: 1, perPage: PER_PAGE * page });
  const cat = s.category ? catalog.getCategory(s.category) : undefined;
  const title =
    cat?.name.sr ??
    (s.q
      ? `Rezultati za „${s.q}“`
      : s.onSale
        ? "Akcije"
        : s.machineBrand
          ? `Delovi za ${s.machineBrand} ${s.machineModel ?? ""}`
          : "Svi proizvodi");
  const set = (patch: Partial<S>) =>
    nav({ search: (prev) => ({ ...prev, ...patch, page: undefined }), resetScroll: false });

  const chips: { label: string; clear: Partial<S> }[] = [
    s.q && { label: `„${s.q}“`, clear: { q: undefined } },
    cat && { label: cat.name.sr, clear: { category: undefined } },
    s.brand && {
      label: res.facets.brand.find((b) => b.value === s.brand)?.label ?? s.brand,
      clear: { brand: undefined },
    },
    s.machineBrand && {
      label: s.machineBrand,
      clear: { machineBrand: undefined, machineModel: undefined },
    },
    s.machineModel && { label: s.machineModel, clear: { machineModel: undefined } },
    s.portafilter && { label: `Ø ${s.portafilter} mm`, clear: { portafilter: undefined } },
    s.availability && {
      label: s.availability === "in-stock" ? "Na stanju" : "Po porudžbini",
      clear: { availability: undefined },
    },
    s.onSale && { label: "Na akciji", clear: { onSale: undefined } },
  ].filter(Boolean) as { label: string; clear: Partial<S> }[];

  const Facet = ({
    label,
    values,
    active,
    onPick,
  }: {
    label: string;
    values: FacetValue[];
    active?: string;
    onPick: (v?: string) => void;
  }) =>
    values.length === 0 ? null : (
      <fieldset className="border-b pb-5">
        <legend className="mb-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </legend>
        <div className="max-h-56 space-y-0.5 overflow-y-auto pr-1">
          {values.map((v) => {
            const on = active === v.value;
            return (
              <label
                key={v.value}
                className={`flex cursor-pointer items-center gap-2.5 rounded px-2 py-1.5 text-xs transition-colors hover:bg-muted ${on ? "bg-muted font-semibold" : ""}`}
              >
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 accent-primary"
                  checked={on}
                  onChange={() => onPick(on ? undefined : v.value)}
                />
                <span className="flex-1">{v.label}</span>
                <span className="num text-[10px] text-muted-foreground">{v.count}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
    );

  const filters = (
    <div className="space-y-5">
      <Facet
        label="Proizvođač aparata"
        values={res.facets.machineBrand}
        active={s.machineBrand}
        onPick={(v) => set({ machineBrand: v, machineModel: undefined })}
      />
      {s.machineBrand && (
        <Facet
          label="Model aparata"
          values={res.facets.machineModel}
          active={s.machineModel}
          onPick={(v) => set({ machineModel: v })}
        />
      )}
      <Facet
        label="Prečnik portafiltera"
        values={res.facets.portafilter.map((f) => ({ ...f, label: `Ø ${f.label} mm` }))}
        active={s.portafilter ? String(s.portafilter) : undefined}
        onPick={(v) => set({ portafilter: v ? Number(v) : undefined })}
      />
      <Facet
        label="Brend proizvoda"
        values={res.facets.brand}
        active={s.brand}
        onPick={(v) => set({ brand: v })}
      />
      <Facet
        label="Dostupnost"
        values={res.facets.availability}
        active={s.availability}
        onPick={(v) => set({ availability: v as S["availability"] })}
      />
      <label className="flex cursor-pointer items-center gap-2.5 px-2 text-xs font-semibold">
        <input
          type="checkbox"
          className="h-3.5 w-3.5 accent-primary"
          checked={!!s.onSale}
          onChange={() => set({ onSale: s.onSale ? undefined : true })}
        />{" "}
        Samo proizvodi na akciji
      </label>
    </div>
  );

  return (
    <div>
      <section className="border-b bg-secondary/60">
        <div className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-12">
          <nav
            aria-label="Putanja"
            className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
          >
            <Link to="/" className="hover:text-foreground">
              Početna
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/prodavnica" className="hover:text-foreground">
              Prodavnica
            </Link>
            {cat && (
              <>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground">{cat.name.sr}</span>
              </>
            )}
          </nav>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Svaki deo ima SKU, OEM kodove i spisak aparata za koje odgovara. Suzite izbor po modelu
            ili prečniku portafiltera.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-8 md:grid-cols-[250px_1fr] md:px-8">
        <aside className="hidden md:block">
          <div className="sticky top-40">{filters}</div>
        </aside>
        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="md:hidden"
                onClick={() => setFiltersOpen(true)}
              >
                <SlidersHorizontal /> Filteri{chips.length > 0 && ` (${chips.length})`}
              </Button>
              <span className="text-xs text-muted-foreground">
                <b className="num text-foreground">{res.total}</b> proizvoda
              </span>
            </div>
            <select
              aria-label="Sortiranje"
              className="h-9 rounded border bg-card px-3 text-xs"
              value={s.sort ?? "recommended"}
              onChange={(e) => set({ sort: e.target.value as SortKey })}
            >
              <option value="recommended">Preporučeno</option>
              <option value="bestseller">Najprodavanije</option>
              <option value="newest">Najnovije</option>
              <option value="price-asc">Cena: niža prvo</option>
              <option value="price-desc">Cena: viša prvo</option>
              <option value="name-asc">Naziv A–Ž</option>
              <option value="stock-first">Na stanju prvo</option>
            </select>
          </div>
          {chips.length > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              {chips.map((c) => (
                <button
                  key={c.label}
                  onClick={() => set(c.clear)}
                  className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-[11px] font-medium hover:border-foreground"
                >
                  {c.label}
                  <X className="h-3 w-3" />
                  <span className="sr-only">Ukloni filter</span>
                </button>
              ))}
              <Link
                to="/prodavnica"
                className="text-[11px] font-semibold text-steel underline underline-offset-4"
              >
                Poništi sve
              </Link>
            </div>
          )}
          {res.items.length === 0 ? (
            <div className="flex flex-col items-center rounded-md border bg-card px-6 py-16 text-center">
              <SearchX className="h-10 w-10 stroke-1 text-muted-foreground" />
              <p className="mt-4 font-bold">Nema delova za ovu kombinaciju.</p>
              <p className="mt-2 max-w-sm text-xs text-muted-foreground">
                Uklonite poslednji filter ili pretražite po OEM kodu sa starog dela.
              </p>
              <Button asChild className="mt-6">
                <Link to="/prodavnica">Prikaži sve proizvode</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-3">
              {res.items.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          )}
          {res.items.length < res.total && (
            <div className="mt-10 flex flex-col items-center gap-3">
              <p className="text-[11px] text-muted-foreground">
                Prikazano <span className="num">{res.items.length}</span> od{" "}
                <span className="num">{res.total}</span>
              </p>
              <Button
                variant="outline"
                className="h-11 px-8"
                onClick={() =>
                  nav({ search: (prev) => ({ ...prev, page: page + 1 }), resetScroll: false })
                }
              >
                Učitaj još
              </Button>
            </div>
          )}
        </div>
      </div>

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="left" className="overflow-y-auto p-6">
          <SheetHeader>
            <SheetTitle>Filteri</SheetTitle>
            <SheetDescription>{res.total} proizvoda odgovara izboru</SheetDescription>
          </SheetHeader>
          <div className="mt-6">{filters}</div>
          <Button className="mt-6 w-full" onClick={() => setFiltersOpen(false)}>
            Prikaži {res.total} proizvoda
          </Button>
        </SheetContent>
      </Sheet>
    </div>
  );
}
