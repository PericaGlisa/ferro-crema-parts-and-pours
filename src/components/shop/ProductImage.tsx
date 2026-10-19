import { Package } from "lucide-react";
import type { Product } from "@/data/types";
import { categoryPhotos } from "./CategoryVisual";

export function ProductImage({
  p,
  index = 0,
  className = "",
  priority = false,
}: {
  p: Product;
  index?: number;
  className?: string;
  priority?: boolean;
}) {
  const original = p.images[index]?.src;
  const isPlaceholder = !original || original.includes("placehold.co");
  const category = p.categoryIds.find((id) => categoryPhotos[id]);
  const src = isPlaceholder ? (category ? categoryPhotos[category] : undefined) : original;
  return (
    <div className={`product-picture relative overflow-hidden bg-image ${className}`}>
      {src ? (
        <img
          src={src}
          alt={
            isPlaceholder
              ? `Ilustracija kategorije: ${p.name.sr}`
              : (p.images[index]?.alt.sr ?? p.name.sr)
          }
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          width={680}
          height={680}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-muted-foreground">
          <Package className="h-12 w-12 stroke-1" />
          <span className="font-mono text-[10px]">{p.sku}</span>
        </div>
      )}
      {isPlaceholder && (
        <span className="absolute bottom-2 left-2 rounded-sm bg-card/85 px-1.5 py-0.5 text-[8px] text-muted-foreground">
          {src ? "Ilustrativna fotografija" : "Fotografija uskoro"}
        </span>
      )}
    </div>
  );
}
