import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Heart,
  Minus,
  Plus,
  Copy,
  ChevronRight,
  Truck,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { catalog } from "@/data/catalogService";
import { brands } from "@/data/seed";
import { rsd, useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductImage } from "@/components/shop/ProductImage";
import { CompatibilityChecker } from "@/components/shop/CompatibilityChecker";
import { FrequentlyBoughtTogether } from "@/components/shop/FrequentlyBoughtTogether";

export const Route = createFileRoute("/proizvod/$slug")({
  loader: ({ params }) => {
    const p = catalog.getProduct(params.slug);
    if (!p) throw notFound();
    return {
      slug: p.slug,
      name: p.name.sr,
      desc: p.shortDescription.sr,
      sku: p.sku,
      price: p.price,
      stock: p.stock,
      image: p.images[0]?.src || "/og-image.jpg",
    };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — Ferro Crema — delovi za espresso aparate i mlinove` },
          { name: "description", content: loaderData.desc },
          { property: "og:title", content: `${loaderData.name} — Ferro Crema` },
          { property: "og:description", content: loaderData.desc },
          { property: "og:type", content: "product" },
          { property: "og:image", content: loaderData.image },
          { name: "twitter:card", content: "summary_large_image" },
          { name: "twitter:image", content: loaderData.image },
        ]
      : [{ title: "Proizvod nije pronađen — Ferro Crema" }, { name: "robots", content: "noindex" }],
    scripts: loaderData
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: loaderData.name,
              sku: loaderData.sku,
              description: loaderData.desc,
              brand: { "@type": "Brand", name: "Ferro Crema" },
              offers: {
                "@type": "Offer",
                priceCurrency: "RSD",
                price: loaderData.price,
                availability:
                  loaderData.stock > 0
                    ? "https://schema.org/InStock"
                    : "https://schema.org/BackOrder",
              },
            }),
          },
        ]
      : [],
  }),
  component: Pdp,
});

function Pdp() {
  const { slug } = Route.useLoaderData();
  const p = catalog.getProduct(slug)!;
  const { add, wishlist, toggleWish } = useStore();
  const [qty, setQty] = useState(1);
  const brand = brands.find((b) => b.id === p.brandId);
  const related = catalog.getProductsByIds(p.relatedIds ?? []).slice(0, 4);
  const wished = wishlist.includes(p.id);
  const copy = () => {
    navigator.clipboard?.writeText(p.oemCodes.join(", "));
    toast.success("OEM kod kopiran");
  };
  const addToCart = () => {
    add(p.id, qty);
    toast.success("Dodato u korpu");
  };

  return (
    <div className="pb-24 md:pb-0">
      <div className="mx-auto max-w-7xl px-5 py-6 md:px-8 md:py-10">
        <nav
          aria-label="Putanja"
          className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground"
        >
          <Link to="/" className="hover:text-foreground">
            Početna
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/prodavnica" className="hover:text-foreground">
            Prodavnica
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="line-clamp-1 text-foreground">{p.name.sr}</span>
        </nav>
        <div className="mt-6 grid gap-10 md:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="md:sticky md:top-40 md:self-start">
            <ProductImage p={p} className="aspect-square w-full rounded-md border" />
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {brand?.name}
            </div>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
              {p.name.sr}
            </h1>
            <div className="mt-4 flex flex-wrap gap-2 font-mono text-[10px]">
              <span className="rounded border bg-card px-2 py-1">SKU {p.sku}</span>
              {p.oemCodes.length > 0 && (
                <button
                  onClick={copy}
                  className="inline-flex items-center gap-1.5 rounded border bg-card px-2 py-1 hover:border-foreground"
                >
                  OEM {p.oemCodes.join(", ")} <Copy className="h-3 w-3" />
                </button>
              )}
            </div>
            <p className="mt-5 text-sm leading-6 text-muted-foreground">{p.shortDescription.sr}</p>

            <div className="mt-6 rounded-md border bg-card p-5">
              <div className="flex items-baseline gap-3">
                <span className="num text-3xl font-extrabold">{rsd(p.price)}</span>
                {p.compareAtPrice && (
                  <>
                    <span className="num text-sm text-muted-foreground line-through">
                      {rsd(p.compareAtPrice)}
                    </span>
                    <span className="rounded bg-alert px-2 py-0.5 text-[10px] font-bold text-destructive-foreground">
                      Ušteda {rsd(p.compareAtPrice - p.price)}
                    </span>
                  </>
                )}
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">PDV uključen</p>
              <div
                className={`mt-4 text-xs font-semibold ${p.stock > 0 ? "text-ok" : "text-muted-foreground"}`}
              >
                {p.stock > 0
                  ? `● Na stanju (${p.stock} kom) — poručeno do 14h, šaljemo isti dan`
                  : `○ Po porudžbini, rok ${p.leadTimeDays ?? 7} dana`}
              </div>
              <div className="mt-5 flex gap-2">
                <div className="flex h-12 items-center rounded border">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Manje"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                  >
                    <Minus />
                  </Button>
                  <span className="num w-8 text-center text-sm" aria-live="polite">
                    {qty}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Više"
                    onClick={() => setQty(qty + 1)}
                  >
                    <Plus />
                  </Button>
                </div>
                <Button
                  className="h-12 flex-1 bg-crema text-crema-foreground hover:bg-crema/90"
                  onClick={addToCart}
                >
                  Dodaj u korpu
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12"
                  aria-pressed={wished}
                  aria-label={wished ? "Ukloni iz liste želja" : "Sačuvaj u listu želja"}
                  onClick={() => toggleWish(p.id)}
                >
                  <Heart className={wished ? "fill-crema text-crema" : ""} />
                </Button>
              </div>
            </div>

            <CompatibilityChecker product={p} />

            <ul className="mt-6 grid gap-3 text-xs text-muted-foreground sm:grid-cols-3">
              <li className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-foreground" /> Dostava 1–2 radna dana
              </li>
              <li className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-foreground" /> Povrat 14 dana
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-foreground" /> Tehnička podrška
              </li>
            </ul>
          </div>
        </div>

        <Tabs defaultValue="opis" className="mt-14">
          <TabsList className="h-auto flex-wrap justify-start">
            <TabsTrigger value="opis">Opis</TabsTrigger>
            <TabsTrigger value="spec">Specifikacije</TabsTrigger>
            <TabsTrigger value="komp">Kompatibilnost</TabsTrigger>
            <TabsTrigger value="dostava">Dostava i povrat</TabsTrigger>
          </TabsList>
          <TabsContent
            value="opis"
            className="max-w-3xl pt-4 text-sm leading-7 text-muted-foreground"
          >
            {p.description.sr}
          </TabsContent>
          <TabsContent value="spec" className="max-w-2xl pt-4">
            <table className="w-full text-sm">
              <tbody>
                {p.specs.map((sp) => (
                  <tr key={sp.key} className="border-b">
                    <td className="py-3 text-muted-foreground">{sp.key}</td>
                    <td className="num py-3 text-right font-semibold">
                      {sp.value}
                      {sp.unit ? ` ${sp.unit}` : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TabsContent>
          <TabsContent value="komp" className="max-w-2xl pt-4">
            {p.compatibility.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Univerzalan proizvod — ne zavisi od modela aparata.
              </p>
            ) : (
              <ul className="space-y-3 text-sm">
                {p.compatibility.map((c) => (
                  <li key={c.machineBrand} className="rounded border p-3">
                    <b>{c.machineBrand}</b>
                    {c.groupType ? (
                      <span className="ml-2 font-mono text-[10px] text-muted-foreground">
                        {c.groupType}
                      </span>
                    ) : null}
                    <div className="mt-1 text-xs text-muted-foreground">{c.models.join(" · ")}</div>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
          <TabsContent
            value="dostava"
            className="max-w-3xl pt-4 text-sm leading-7 text-muted-foreground"
          >
            Dostava kurirskom službom za 1–2 radna dana. Besplatna dostava za porudžbine preko 8.000
            RSD. Neiskorišćen deo u originalnom pakovanju možete vratiti u roku od 14 dana.
          </TabsContent>
        </Tabs>

        {/* Frequently Bought Together Bundle */}
        <FrequentlyBoughtTogether mainProduct={p} />

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-extrabold tracking-tight">Preporučeni srodni delovi</h2>
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
              {related.map((r) => (
                <ProductCard key={r.id} p={r} />
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t bg-background/95 p-3 backdrop-blur md:hidden">
        <div className="min-w-0 flex-1">
          <div className="line-clamp-1 text-[11px]">{p.name.sr}</div>
          <div className="num text-sm font-extrabold">{rsd(p.price)}</div>
        </div>
        <Button className="h-11 bg-crema text-crema-foreground" onClick={addToCart}>
          Dodaj u korpu
        </Button>
      </div>
    </div>
  );
}
