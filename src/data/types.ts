export type Locale = "sr" | "en";
export type LocalizedText = Record<Locale, string>;

export type GroupType = "E61" | "Faema" | "Rancilio" | "La Marzocco" | "Other";
export type PortafilterSize = 49 | 51 | 53 | 54 | 57 | 58 | 58.35;
export type Badge = "new" | "bestseller" | "sale" | "pro";

export type ProductImage = {
  src: string;
  alt: LocalizedText;
  w: number;
  h: number;
};

export type Variant = {
  id: string;
  sku: string;
  options: Record<string, string>;
  price: number;
  stock: number;
  swatch?: string;
};

export type Spec = { key: string; value: string; unit?: string };

export type Compatibility = {
  machineBrand: string;
  models: string[];
  groupType?: GroupType;
};

export type Product = {
  id: string;
  slug: string;
  sku: string;
  oemCodes: string[];
  ean?: string;
  name: LocalizedText;
  shortDescription: LocalizedText;
  description: LocalizedText;
  brandId: string;
  categoryIds: string[];
  images: ProductImage[];
  price: number;
  compareAtPrice?: number;
  currency: "RSD";
  stock: number;
  leadTimeDays?: number;
  variants?: Variant[];
  specs: Spec[];
  compatibility: Compatibility[];
  portafilterSize?: PortafilterSize;
  badges?: Badge[];
  rating?: { avg: number; count: number };
  relatedIds?: string[];
  bundleIds?: string[];
};

export type Category = {
  id: string;
  slug: string;
  name: LocalizedText;
  parentId?: string;
  image?: string;
  sort: number;
};

export type Brand = {
  id: string;
  slug: string;
  name: string;
  logo?: string;
  description?: LocalizedText;
};

export type MachineModel = {
  id: string;
  brand: string;
  model: string;
  portafilterSize: number;
  groupType: string;
};

export type Bundle = {
  id: string;
  slug: string;
  name: LocalizedText;
  productIds: string[];
  price: number;
  compareAtPrice: number;
};

export type SortKey =
  | "recommended"
  | "bestseller"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc"
  | "stock-first";

export type ProductQuery = {
  category?: string;
  machineBrand?: string;
  machineModel?: string;
  portafilter?: number;
  groupType?: string;
  brand?: string;
  material?: string;
  priceMin?: number;
  priceMax?: number;
  availability?: "in-stock" | "backorder";
  onSale?: boolean;
  search?: string;
  sort?: SortKey;
  page?: number;
  perPage?: number;
};

export type FacetValue = { value: string; label: string; count: number };

export type ProductListResult = {
  items: Product[];
  total: number;
  page: number;
  perPage: number;
  priceRange: { min: number; max: number };
  facets: {
    brand: FacetValue[];
    machineBrand: FacetValue[];
    machineModel: FacetValue[];
    portafilter: FacetValue[];
    groupType: FacetValue[];
    material: FacetValue[];
    availability: FacetValue[];
    onSale: FacetValue[];
  };
};

export interface CatalogService {
  listProducts(query: ProductQuery): ProductListResult;
  getProduct(slug: string): Product | undefined;
  getProductsByIds(ids: string[]): Product[];
  listCategories(): Category[];
  getCategory(slug: string): Category | undefined;
  listBrands(): Brand[];
  getBrand(slug: string): Brand | undefined;
  listMachineModels(): MachineModel[];
  listBundles(): Bundle[];
  search(term: string): {
    products: Product[];
    categories: Category[];
    brands: Brand[];
  };
  isCompatible(productSlug: string, brand: string, model: string): boolean;
}
