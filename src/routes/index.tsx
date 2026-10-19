import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { machineBrands, machineModels, allProducts } from "@/data/seed";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ScanLine,
  Truck,
  ShieldCheck,
  Wrench,
  ChevronDown,
} from "lucide-react";
import { CategoryVisual } from "@/components/shop/CategoryVisual";
import workshop from "@/assets/espresso-workshop.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ferro Crema — delovi za espresso aparate i mlinove" },
      {
        name: "description",
        content:
          "Pravi deo. Savršen espresso. Dihtunzi, tuš sita, portafilteri, noževi mlinova, pumpe i servisni kompleti za E61, Rancilio, La Marzocco i druge aparate. Isporuka 1–2 dana.",
      },
      { property: "og:title", content: "Ferro Crema — delovi za espresso aparate i mlinove" },
      {
        property: "og:description",
        content:
          "Pravi deo. Savršen espresso. Delovi za espresso aparate i mlinove — brza isporuka, OEM kodovi i provera kompatibilnosti.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Ferro Crema — delovi za espresso aparate i mlinove" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Ferro Crema — delovi za espresso aparate i mlinove" },
      {
        name: "twitter:description",
        content:
          "Pravi deo. Savršen espresso. Delovi za espresso aparate i mlinove — brza isporuka, OEM kodovi i provera kompatibilnosti.",
      },
      { name: "twitter:image", content: "/og-image.jpg" },
    ],
  }),
  component: Home,
});

function Finder() {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const nav = useNavigate();
  const models = machineModels.filter((m) => m.brand === brand);
  const sel =
    "h-12 w-full appearance-none rounded border bg-card pl-10 pr-8 text-sm font-medium outline-none disabled:text-muted-foreground";
  return (
    <section id="pronadji-deo" className="border-b bg-secondary/60">
      <div className="mx-auto grid max-w-7xl gap-5 px-5 py-7 lg:grid-cols-[1fr_1.75fr] lg:items-center lg:px-8">
        <div className="flex items-center gap-3">
          <ScanLine className="h-9 w-9 shrink-0 stroke-[1.2]" />
          <div>
            <h2 className="text-lg font-bold">Vaš aparat. Tačan deo.</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Pronađite kompatibilne delove bez nagađanja.
            </p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-4 font-mono text-xs text-muted-foreground">
              01
            </span>
            <select
              aria-label="Proizvođač"
              className={sel}
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value);
                setModel("");
              }}
            >
              <option value="">Proizvođač aparata</option>
              {machineBrands.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-4 h-4 w-4" />
          </div>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-4 font-mono text-xs text-muted-foreground">
              02
            </span>
            <select
              aria-label="Model"
              className={sel}
              value={model}
              disabled={!brand}
              onChange={(e) => setModel(e.target.value)}
            >
              <option value="">Model</option>
              {models.map((m) => (
                <option key={m.id} value={m.model}>
                  {m.model} · {m.portafilterSize} mm
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-4 h-4 w-4" />
          </div>
          <Button
            size="lg"
            className="h-12 px-5"
            disabled={!brand}
            onClick={() =>
              nav({
                to: "/prodavnica",
                search: { machineBrand: brand, machineModel: model || undefined },
              })
            }
          >
            Pronađi deo <ArrowRight />
          </Button>
        </div>
      </div>
    </section>
  );
}

const featuredCategories = [
  ["dihtunzi", "Dihtunzi", "Sitni detalji. Velika razlika."],
  ["rucke-portafilteri", "Portafilteri", "Dobra ekstrakcija počinje ovde."],
  ["nozevi-burrs", "Noževi za mlinove", "Preciznost u svakom zrnu."],
  ["barista-alat", "Barista alat", "Za vaš svakodnevni ritual."],
];

function Home() {
  const best = [...allProducts]
    .sort((a, b) => (b.rating?.count ?? 0) - (a.rating?.count ?? 0))
    .slice(0, 4);
  const sale = allProducts.filter((p) => p.compareAtPrice).slice(0, 4);
  return (
    <div>
      <section className="relative isolate overflow-hidden bg-hero text-hero-foreground">
        <img
          src={workshop}
          alt="Espresso aparat sa E61 grupom i portafilterom na servisnom stolu"
          width={1600}
          height={912}
          fetchPriority="high"
          className="hero-photo absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="hero-shade absolute inset-0 -z-10" />
        <div className="hero-enter mx-auto max-w-7xl px-5 pb-10 pt-12 md:px-8 md:pb-10 md:pt-16">
          <p className="flex items-center gap-2 font-mono text-[10px] uppercase text-hero-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-hero-accent" /> Za one koji znaju razliku.
          </p>
          <h1 className="mt-5 text-5xl font-extrabold leading-[1.1] md:text-6xl">
            Ferro Crema
            <span className="mt-3 block text-3xl font-medium leading-tight md:text-[40px]">
              Pravi deo.
              <br />
              <span className="text-hero-accent">Savršen espresso.</span>
            </span>
          </h1>
          <p className="mt-5 max-w-[370px] text-sm leading-7 text-hero-muted">
            Delovi za espresso aparate i mlinove.
            <br />
            Precizno odabrani. Za godine dobrog espressa.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Button
              asChild
              size="lg"
              className="h-12 bg-crema px-6 text-crema-foreground hover:bg-crema/90"
            >
              <Link to="/prodavnica">
                Istražite ponudu <ArrowUpRight />
              </Link>
            </Button>
            <a
              href="#pronadji-deo"
              className="flex items-center gap-2 py-3 text-xs font-semibold text-hero-foreground hover:text-hero-accent"
            >
              Pronađite deo za aparat <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-hero-muted">
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-hero-accent" /> Pretraga po OEM kodu
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-hero-accent" /> Provera kompatibilnosti
            </span>
          </div>
        </div>
      </section>
      <Finder />
      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase text-muted-foreground">
              Svaki detalj je važan
            </p>
            <h2 className="mt-2 text-2xl font-bold md:text-3xl">Šta je potrebno vašem aparatu?</h2>
          </div>
          <Link
            to="/prodavnica"
            className="hidden items-center gap-2 text-xs font-semibold sm:flex"
          >
            Sve kategorije <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-4 md:grid-cols-4">
          {featuredCategories.map(([slug, name, desc], i) => (
            <Link
              key={slug}
              to="/prodavnica"
              search={{ category: slug }}
              className="category-tile group min-w-0"
            >
              <div className="product-picture relative overflow-hidden rounded-md bg-image">
                <CategoryVisual category={slug} className="aspect-[1.2] w-full object-cover" />
                <span className="absolute left-3 top-3 font-mono text-[10px] text-muted-foreground">
                  0{i + 1}
                </span>
                <ArrowUpRight className="category-arrow absolute bottom-3 right-3 h-5 w-5" />
              </div>
              <h3 className="mt-4 text-sm font-bold">{name}</h3>
              <p className="mt-1 text-[11px] text-muted-foreground">{desc}</p>
            </Link>
          ))}
        </div>
        <p className="mt-4 text-[10px] text-muted-foreground">
          Fotografije kategorija su ilustrativne.
        </p>
      </section>
      <section className="border-y bg-muted/50">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-5 px-5 py-7 md:justify-between md:px-8">
          <span className="font-mono text-[9px] uppercase text-muted-foreground">
            Delovi za aparate
          </span>
          {["La Marzocco", "RANCILIO", "GAGGIA", "Rocket", "ECM", "MAZZER"].map((name) => (
            <Link
              key={name}
              to="/prodavnica"
              search={{
                machineBrand:
                  name === "RANCILIO"
                    ? "Rancilio"
                    : name === "GAGGIA"
                      ? "Gaggia"
                      : name === "MAZZER"
                        ? "Mazzer"
                        : name,
              }}
              className="text-base font-extrabold text-steel transition-colors hover:text-foreground"
            >
              {name}
            </Link>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase text-muted-foreground">
              Provereni favoriti
            </p>
            <h2 className="mt-2 text-3xl font-bold">Najprodavanije</h2>
          </div>
          <Link
            to="/prodavnica"
            search={{ sort: "bestseller" }}
            className="flex items-center gap-2 text-xs font-semibold"
          >
            Svi proizvodi <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
          {best.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>
      <section className="bg-secondary">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:grid-cols-3 md:px-8">
          {[
            {
              icon: ScanLine,
              title: "Tačno ono što tražite",
              text: "SKU, OEM kodovi i modeli aparata na jednom mestu.",
            },
            {
              icon: Truck,
              title: "Od dela do vaših vrata",
              text: "Porudžbine do 14h šaljemo istog dana.",
            },
            {
              icon: ShieldCheck,
              title: "Kupovina bez nagađanja",
              text: "Dimenzije, materijali i kompatibilnost uz svaki deo.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-4">
              <Icon className="mt-1 h-7 w-7 shrink-0 stroke-[1.3]" />
              <div>
                <h3 className="text-sm font-bold">{title}</h3>
                <p className="mt-2 max-w-xs text-xs leading-6 text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      {sale.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">Dobar trenutak za zamenu.</h2>
            <Link
              to="/prodavnica"
              search={{ onSale: true }}
              className="flex items-center gap-2 text-xs font-semibold"
            >
              Sve akcije <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
            {sale.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </section>
      )}
      <section className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-12 sm:flex-row sm:items-center md:px-8">
          <div className="flex gap-4">
            <Wrench className="h-9 w-9 stroke-[1.2]" />
            <div>
              <h2 className="text-xl font-bold">Mali deo. Novi život aparata.</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Pronađite sve za redovno održavanje.
              </p>
            </div>
          </div>
          <Button asChild variant="outline" size="lg">
            <Link to="/prodavnica" search={{ category: "odrzavanje" }}>
              Održavanje i čišćenje <ArrowUpRight />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
