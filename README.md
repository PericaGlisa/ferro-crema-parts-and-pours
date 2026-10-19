# Ferro Crema Parts And Pours

MASTER PROMPT — Ferro Crema (B2C webshop)

delovi za espresso aparate i mlinove

Kako koristiti: naziv brenda je već upisan (Ferro Crema). Proveri još samo {{FREE_SHIP}} prag, pa pokreni projekat. Uz specifikaciju su priloženi analiza_sajtova.json i definisani design tokeni.

ROLE

You are a senior e-commerce engineer and product designer. Build a production-quality, fully responsive webshop for Ferro Crema, a Serbia-based retailer of espresso machine and coffee grinder spare parts, barista tools and accessories.

Brand:

Name: Ferro Crema (always two words, both capitalised; never "FerroCrema" or "Ferro-Crema").

Descriptor, used together with the name in the site title, meta title, hero area, footer and OG tags: „Ferro Crema — delovi za espresso aparate i mlinove".

The name is a juxtaposition: ferro (metal, the parts) against crema (the result in the cup). Let that contrast drive the visual system — cool steel greys and machined details against a warm crema tone. In the logotype set "FERRO" in a light technical uppercase and "Crema" in a softer weight, so the two materials read differently.

Tone of voice: precise, practical, no hype. The shop sells parts that must fit, so copy states dimensions, compatibility and delivery times plainly.

The name alone does not tell a first-time visitor what is sold, so the descriptor must always be visible next to it above the fold and in every page title.

The information architecture, UX patterns and feature set must match the best patterns found in five reference stores (mhw3bomber.com, barista-shop.gr, homebarista.be, barista.tools, lastaforest.com — details in the attached analiza_sajtova.json). Do not copy their logos, product photos, copywriting, brand names or trade dress. Use original branding, placeholder images and original copy.

TECH STACK

React 18 + TypeScript, Tailwind CSS, shadcn/ui primitives, lucide-react icons.

Routing: Vite + TanStack Router / TanStack Start SSR.

State: Zustand for cart/wishlist/recently-viewed (persisted to localStorage).

Data: typed mock data layer in /src/data behind a catalogService interface so it can later be swapped for WooCommerce REST API (/wp-json/wc/v3/products) or Supabase without touching UI.

i18n: sr-Latn (default) and en. All UI strings in dictionary files. Serbian Latin collation for alphabetical sorting (Intl.Collator('sr-Latn')).

Currency: RSD default, EUR secondary. Prices displayed with VAT included and label "PDV uključen". Format 12.490 RSD / €104,90.

SEO: SSR/SSG where available, per-page meta, OpenGraph, canonical, JSON-LD (Product, Offer, BreadcrumbList, Organization), clean slugs.

Accessibility: WCAG 2.2 AA, visible focus rings, keyboard-operable menus/drawers, never disable pinch zoom, meaningful alt text, prefers-reduced-motion respected.

Performance: lazy images with explicit width/height, responsive srcset, Lighthouse ≥ 90 on mobile.

DESIGN DIRECTION

Subject: precise metal parts, gaskets, burrs, portafilters — workshop precision meets café craft.

Palette (derived from the name: ferro = steel, crema = warm; 5 named tokens, CSS variables, light + dark): --ferro #1C1F22 (text, machined dark), --steel #5E6A73 (secondary, brushed metal), --paper #FAFAF8 (background), --crema #C8A16B (accent, CTAs — the warm tone the name promises), --ok #2F7D5B (in stock), --alert #B3261E (sale / out of stock). The two token names --ferro and --crema carry the brand idea; keep steel tones for structure and chrome, and reserve the crema tone for actions and highlights only. Override with measured values from design_tokens if provided.

Type: one technical sans for UI (e.g. "IBM Plex Sans" or "Inter Tight") + tabular numerals for prices, SKUs and dimensions. Sentence case for headings and navigation.

Layout: 1320px max container, 12-col grid, 8px spacing scale. Product imagery on neutral square tiles (1:1). Radius: 6px on inputs/buttons, 10px on cards — no single radius everywhere.

Motion: only feedback motion (drawer open, add-to-cart confirmation, image hover swap). No scroll-triggered fade-ins.

One memorable element: the Compatibility finder — give it the strongest visual treatment on the homepage.

DATA MODEL (TypeScript)

type Product = {
id: string; slug: string; sku: string; oemCodes: string[]; ean?: string;
name: Record<Locale,string>; shortDescription: Record<Locale,string>; description: Record<Locale,string>;
brandId: string; categoryIds: string[];
images: { src: string; alt: Record<Locale,string>; w: number; h: number }[];
price: number; compareAtPrice?: number; currency: 'RSD';
stock: number; leadTimeDays?: number;
variants?: { id: string; sku: string; options: Record<string,string>; price: number; stock: number; swatch?: string }[];
specs: { key: string; value: string; unit?: string }[]; // diameter 58 mm, thickness 8.5 mm, material EPDM...
compatibility: { machineBrand: string; models: string[]; groupType?: 'E61'|'Faema'|'Rancilio'|'La Marzocco'|'Other' }[];
portafilterSize?: 49|51|53|54|57|58|58.35;
badges?: ('new'|'bestseller'|'sale'|'pro')[];
rating?: { avg: number; count: number };
relatedIds?: string[]; bundleIds?: string[];
};
type Category = { id; slug; name: Record<Locale,string>; parentId?: string; image?: string; sort: number };
type Brand = { id; slug; name; logo?: string; description?: Record<Locale,string> };
type MachineModel = { id; brand: string; model: string; portafilterSize: number; groupType: string };
type Bundle = { id; slug; name; productIds: string[]; price: number; compareAtPrice: number };

Seed: 8 top categories, ~40 subcategories, 15 brands, 25 machine models, 120 products (realistic parts: group gaskets, shower screens, portafilters, baskets, burrs, steam tips, solenoid valves, pressure switches, tampers, pitchers, cleaning), 4 bundles. Use neutral placeholder images (e.g. https://placehold.co/800x800).

INFORMATION ARCHITECTURE

Top categories (patterns from barista-shop.gr + lastaforest):

Rezervni delovi – espresso aparati → Dihtunzi, Tuš sita, Ručke (portafilteri), Sitaste korpe, Parni i vodeni vrhovi, Ventili i solenoidi, Presostati i senzori, Grejači, Pumpe, Servisni kompleti

Rezervni delovi – mlinovi → Noževi (burrs), Posude za zrna, Komponente, Motori

Barista alat → Tamperi i distributeri, WDT, Dozirni prsteni, Puck screen, Vage, Bokali za mleko

Radna stanica → Tamping stanice, Knock box, Podloge, Organizacija

Priprema → Pour-over, Kuvala, Aeropress/French press, Cold brew

Održavanje → Sredstva za čišćenje, Četke, Filteri za vodu

PRO / HoReCa → Profesionalni aparati i mlinovi

Brendovi

Mega-menu top level: Prodavnica · Pronađi deo za svoj aparat · Metoda pripreme · Brendovi · Saveti · Akcije.

PAGES & COMPONENTS

Global

Announcement bar: rotating 2–3 messages (free-shipping threshold {{FREE_SHIP: 8.000 RSD}} (potvrdi prag), dispatch time, current promo). Dismissible, respects reduced motion.

Header (sticky, shrinks on scroll): logo, search, account, wishlist count, cart count + amount, language & currency switchers, phone number.

Mega menu: 3 levels; each category column + contextual brand list + one promo tile ("Najprodavanije u kategoriji"). Mobile: full-screen drill-down drawer with back navigation.

Search overlay: instant results as you type (debounced 200ms) grouped into Proizvodi / Kategorije / Brendovi; matches name, SKU, OEM code, EAN and machine model; "Popularne pretrage" chips when empty; fuzzy match tolerant to missing diacritics (sita = sita, dihtung = dihtunzi).

Cart drawer: line items with qty stepper, free-shipping progress bar, order note, promo code, subtotal with VAT line, "Nastavi na plaćanje" + "Pogledaj korpu". Upsell row: 3 compatible items.

Side panels: Wishlist, Recently viewed.

Footer: 4 columns (Kupovina: dostava, plaćanje, povrat, reklamacije · Podrška: kontakt, radno vreme, praćenje porudžbine, FAQ · O nama: priča, B2B/servisi, blog · Newsletter with first-order discount). Payment icons, social links, company legal data (PIB, MB, address) — required in Serbia.

Cookie consent with granular categories.

Homepage (section order)

Hero: one strong photo slot + H1 + subline + 2 CTAs (Pronađi deo / Najprodavanije).

Trust strip, 4 distinct icons: Isporuka 1–2 radna dana · Besplatna dostava preko praga · 14 dana za povrat · Tehnička podrška.

Compatibility finder (hero-level visual weight): 3-step selector Brend aparata → Model → Kategorija dela → routes to filtered PLP. Secondary quick buttons by portafilter diameter: 51 / 54 / 58 mm, each with example machine brands. Link to "Vodič za kompatibilnost".

Top categories: horizontal scroll cards (image + name + product count).

Bestsellers carousel (tabs: Rezervni delovi / Barista alat / Održavanje).

Featured product spotlight: image + specs + price + Dodaj u korpu + Proveri kompatibilnost.

Bundles grid (4 sets, savings shown as amount, not only %).

Brands logo row.

B2B block for cafés and service technicians: volume pricing, invoice payment, registration CTA.

Guides/blog: 3 latest articles (e.g. "Kako izmeriti dihtung grupe").

Reviews summary.

Newsletter.

Collection / Category / Brand page (PLP)

Breadcrumbs, H1, short intro text (collapsible, SEO), subcategory chips.

Brand pages: brand logo + description header.

Toolbar: result count, sort (Preporučeno, Najprodavanije, Najnovije, Cena ↑, Cena ↓, Naziv A–Š, Naziv Š–A, Na stanju prvo), grid/list toggle, per-page (24/48/96).

Faceted filters (left sidebar desktop, bottom-sheet drawer mobile), each with result counts, applied-filter chips, "Obriši sve", URL-synced query params: Kategorija (tree) · Brend aparata · Model aparata · Prečnik portafiltera · Tip grupe · Brend proizvoda · Materijal · Dimenzija (range) · Cena (dual slider + inputs) · Dostupnost (na stanju / po porudžbini) · Akcija.

List view (important for parts): thumbnail, name, SKU + OEM codes, key specs (diameter/thickness), stock status with lead time, price, qty + add to cart.

Product card (grid): 1:1 image with second image on hover, badges (Novo / Najprodavanije / −X% / PRO), brand, name (2-line clamp), SKU in small tabular text, rating, price + compare-at, "od X RSD" for variants, color/size swatches with "+N", stock dot, Brzi pregled and Dodaj u korpu (or Izaberi opciju → quick-view modal with variant selection).

Pagination (numbered, SEO-friendly ?page=) plus optional "Učitaj još".

Empty state: explain which filters removed results, one-click remove each.

Product page (PDP)

Gallery: thumbnails, zoom on hover (desktop), pinch-zoom lightbox (mobile), 1:1.

Buy box: brand, H1, SKU, OEM codes (copy-to-clipboard), rating link, price with "PDV uključen", compare-at + savings amount, variant selector (swatches/buttons, disabled out-of-stock), qty, Dodaj u korpu, wishlist, stock status + estimated delivery date, free-shipping remaining.

Compatibility block: "Odgovara za" table (brand → models) + inline checker "Da li odgovara mom aparatu?" (select brand/model → green/red result).

Tabs/accordions: Opis · Tehničke specifikacije (table with units) · Kompatibilnost · Uputstvo za ugradnju (PDF/video slot) · Dostava i povrat · Recenzije.

"Često kupljeno zajedno" (bundle with combined price), "Slični delovi", Recently viewed.

Sticky mobile add-to-cart bar.

JSON-LD Product with offers, availability, sku, gtin, brand, aggregateRating.

Other pages

Cart page · Checkout (guest + account; fields for Serbian addresses; delivery methods: kurirska služba, lično preuzimanje; payment: pouzećem, uplatnica/predračun, kartica) · Account (orders, addresses, wishlist, B2B status) · Brands A–Š index · Compatibility guide · Blog list/detail · Static: O nama, Kontakt (map slot, radno vreme), Dostava, Povrat i reklamacije, Uslovi korišćenja, Politika privatnosti · 404 with search.

BEHAVIOUR & QUALITY REQUIREMENTS

Filters, sort and pagination fully reflected in the URL; back button restores state.

Variants are ONE product with swatches (never separate listing per color).

Prices and stock rendered server-side / in initial HTML where the framework allows.

All interactive elements reachable by keyboard; menus close on Esc; focus trapped in drawers/modals.

Toast confirmations use the same verb as the button ("Dodato u korpu").

Error and empty states give a concrete next action.

Unit tests for catalogService filtering/sorting and compatibility matching; one Playwright E2E: search by OEM code → PDP → compatibility check → add to cart → checkout form.

BUILD PHASES (execute in order, confirm each)

Foundation: tokens, typography, layout shell, header/mega menu/footer, i18n, mock data + catalogService.

Catalog: PLP with facets, product card, list view, search overlay, brand pages.

Product & cart: PDP, compatibility checker, quick view, cart drawer, wishlist, recently viewed.

Homepage sections incl. compatibility finder and bundles.

Checkout & account, static pages, SEO/JSON-LD, a11y and performance pass.

Integration stub: WooCommerceCatalogService implementing the same interface (env vars WC_URL, WC_KEY, WC_SECRET), mapping WC attributes pa_marka-aparata, pa_model, pa_precnik to the compatibility model.

DELIVERABLE

A runnable project with README (setup, env vars, how to swap mock data for WooCommerce), no console errors, no placeholder "lorem ipsum" in visible UI (write real, concise Serbian copy).

Dodatne napomene po alatu

Claude Code: dodaj na početak "Read analiza_sajtova.json first. Plan the file structure, then implement phase by phase, running tests after each phase."

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
