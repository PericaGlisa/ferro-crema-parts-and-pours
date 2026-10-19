import {
  FREE_SHIPPING_THRESHOLD,
  allProducts,
  brands,
  bundles,
  categories,
  machineModels,
} from "./seed";
import type {
  Brand,
  CatalogService,
  Category,
  FacetValue,
  Product,
  ProductListResult,
  ProductQuery,
  SortKey,
} from "./types";

export const collator = new Intl.Collator("sr-Latn", { sensitivity: "base", numeric: true });

/** Strips diacritics so "sita" matches "sita", "dihtung" matches "dihtunzi". */
export const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[čćĉ]/g, "c")
    .replace(/[šś]/g, "s")
    .replace(/[žź]/g, "z")
    .replace(/đ/g, "dj")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const descendantIds = (categorySlug: string): string[] => {
  const ids = [categorySlug];
  categories
    .filter((c) => c.parentId === categorySlug)
    .forEach((c) => ids.push(...descendantIds(c.slug)));
  return ids;
};

const materialOf = (p: Product) =>
  p.specs.find((s) => s.key.toLowerCase().startsWith("materijal"))?.value ?? "Ostalo";

const haystack = (p: Product) =>
  normalize(
    [
      p.name.sr,
      p.name.en,
      p.sku,
      p.ean ?? "",
      ...p.oemCodes,
      ...p.compatibility.flatMap((c) => [c.machineBrand, ...c.models]),
      brands.find((b) => b.id === p.brandId)?.name ?? "",
    ].join(" "),
  );

/** Stem-tolerant token match: "dihtung" matches "dihtunzi", "sito" matches "sita". */
const matchesTerm = (p: Product, term: string) => {
  const hay = haystack(p);
  return normalize(term)
    .split(/\s+/)
    .filter(Boolean)
    .every(
      (token) => hay.includes(token) || hay.includes(token.slice(0, Math.max(4, token.length - 2))),
    );
};

type Predicates = Omit<ProductQuery, "sort" | "page" | "perPage">;

const applyFilters = (items: Product[], q: Predicates, skip?: keyof Predicates) => {
  let out = items;
  if (q.category && skip !== "category") {
    const ids = descendantIds(q.category);
    out = out.filter((p) => p.categoryIds.some((c) => ids.includes(c)));
  }
  if (q.search && skip !== "search") out = out.filter((p) => matchesTerm(p, q.search!));
  if (q.brand && skip !== "brand") out = out.filter((p) => p.brandId === q.brand);
  if (q.machineBrand && skip !== "machineBrand")
    out = out.filter((p) => p.compatibility.some((c) => c.machineBrand === q.machineBrand));
  if (q.machineModel && skip !== "machineModel")
    out = out.filter((p) => p.compatibility.some((c) => c.models.includes(q.machineModel!)));
  if (q.portafilter && skip !== "portafilter")
    out = out.filter(
      (p) => p.portafilterSize && Math.round(p.portafilterSize) === Math.round(q.portafilter!),
    );
  if (q.groupType && skip !== "groupType")
    out = out.filter((p) => p.compatibility.some((c) => c.groupType === q.groupType));
  if (q.material && skip !== "material") out = out.filter((p) => materialOf(p) === q.material);
  if (q.priceMin != null && skip !== "priceMin") out = out.filter((p) => p.price >= q.priceMin!);
  if (q.priceMax != null && skip !== "priceMax") out = out.filter((p) => p.price <= q.priceMax!);
  if (q.availability && skip !== "availability")
    out = out.filter((p) => (q.availability === "in-stock" ? p.stock > 0 : p.stock === 0));
  if (q.onSale && skip !== "onSale") out = out.filter((p) => p.compareAtPrice != null);
  return out;
};

const sorters: Record<SortKey, (a: Product, b: Product) => number> = {
  recommended: (a, b) =>
    Number(b.stock > 0) - Number(a.stock > 0) ||
    (b.badges?.length ?? 0) - (a.badges?.length ?? 0) ||
    (b.rating?.count ?? 0) - (a.rating?.count ?? 0),
  bestseller: (a, b) => (b.rating?.count ?? 0) - (a.rating?.count ?? 0),
  newest: (a, b) => Number(b.id.slice(1)) - Number(a.id.slice(1)),
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  "name-asc": (a, b) => collator.compare(a.name.sr, b.name.sr),
  "name-desc": (a, b) => collator.compare(b.name.sr, a.name.sr),
  "stock-first": (a, b) => Number(b.stock > 0) - Number(a.stock > 0) || a.price - b.price,
};

const facet = (
  items: Product[],
  key: (p: Product) => string[],
  label: (v: string) => string,
): FacetValue[] => {
  const counts = new Map<string, number>();
  items.forEach((p) => new Set(key(p)).forEach((v) => counts.set(v, (counts.get(v) ?? 0) + 1)));
  return Array.from(counts.entries())
    .map(([value, count]) => ({ value, label: label(value), count }))
    .sort((a, b) => collator.compare(a.label, b.label));
};

export const mockCatalogService: CatalogService = {
  listProducts(query) {
    const { sort = "recommended", page = 1, perPage = 24, ...pred } = query;
    const filtered = applyFilters(allProducts, pred);
    const sorted = [...filtered].sort(sorters[sort] ?? sorters.recommended);
    const start = (page - 1) * perPage;

    const scopeFor = (k: keyof Predicates) => applyFilters(allProducts, pred, k);
    const priceScope = applyFilters(allProducts, {
      ...pred,
      priceMin: undefined,
      priceMax: undefined,
    });

    const result: ProductListResult = {
      items: sorted.slice(start, start + perPage),
      total: filtered.length,
      page,
      perPage,
      priceRange: {
        min: priceScope.length ? Math.min(...priceScope.map((p) => p.price)) : 0,
        max: priceScope.length ? Math.max(...priceScope.map((p) => p.price)) : 0,
      },
      facets: {
        brand: facet(
          scopeFor("brand"),
          (p) => [p.brandId],
          (v) => brands.find((b) => b.id === v)?.name ?? v,
        ),
        machineBrand: facet(
          scopeFor("machineBrand"),
          (p) => p.compatibility.map((c) => c.machineBrand),
          (v) => v,
        ),
        machineModel: facet(
          scopeFor("machineModel"),
          (p) => p.compatibility.flatMap((c) => c.models),
          (v) => v,
        ),
        portafilter: facet(
          scopeFor("portafilter"),
          (p) => (p.portafilterSize ? [String(p.portafilterSize)] : []),
          (v) => `${v} mm`,
        ),
        groupType: facet(
          scopeFor("groupType"),
          (p) => p.compatibility.map((c) => c.groupType ?? "Other"),
          (v) => v,
        ),
        material: facet(
          scopeFor("material"),
          (p) => [materialOf(p)],
          (v) => v,
        ),
        availability: facet(
          scopeFor("availability"),
          (p) => [p.stock > 0 ? "in-stock" : "backorder"],
          (v) => (v === "in-stock" ? "Na stanju" : "Po porudžbini"),
        ),
        onSale: facet(
          scopeFor("onSale"),
          (p) => (p.compareAtPrice ? ["1"] : []),
          () => "Na akciji",
        ),
      },
    };
    return result;
  },

  getProduct(slug) {
    return allProducts.find((p) => p.slug === slug);
  },

  getProductsByIds(ids) {
    return ids.map((id) => allProducts.find((p) => p.id === id)).filter(Boolean) as Product[];
  },

  listCategories() {
    return [...categories].sort((a, b) => a.sort - b.sort);
  },

  getCategory(slug) {
    return categories.find((c) => c.slug === slug);
  },

  listBrands(): Brand[] {
    return [...brands].sort((a, b) => collator.compare(a.name, b.name));
  },

  getBrand(slug) {
    return brands.find((b) => b.slug === slug);
  },

  listMachineModels() {
    return machineModels;
  },

  listBundles() {
    return bundles;
  },

  search(term) {
    const t = normalize(term).trim();
    if (!t) return { products: [], categories: [], brands: [] };
    return {
      products: allProducts.filter((p) => matchesTerm(p, term)).slice(0, 8),
      categories: (categories as Category[])
        .filter((c) => normalize(c.name.sr).includes(t) || normalize(c.name.en).includes(t))
        .slice(0, 5),
      brands: brands.filter((b) => normalize(b.name).includes(t)).slice(0, 5),
    };
  },

  isCompatible(productSlug, brand, model) {
    const p = allProducts.find((x) => x.slug === productSlug);
    if (!p) return false;
    return p.compatibility.some((c) => c.machineBrand === brand && c.models.includes(model));
  },
};

export const catalog = mockCatalogService;
export { FREE_SHIPPING_THRESHOLD };
