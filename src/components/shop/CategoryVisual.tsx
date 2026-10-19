import gasket from "@/assets/gasket.jpg";
import portafilter from "@/assets/portafilter.jpg";
import burrs from "@/assets/burrs.jpg";
import barista from "@/assets/barista.jpg";
import basket from "@/assets/basket.jpg";
import screen from "@/assets/screen.jpg";
import pump from "@/assets/pump.jpg";
import cleaning from "@/assets/cleaning.jpg";

export const categoryPhotos: Record<string, string> = {
  dihtunzi: gasket,
  "rucke-portafilteri": portafilter,
  "nozevi-burrs": burrs,
  "barista-alat": barista,
  "sitaste-korpe": basket,
  "tus-sita": screen,
  pumpe: pump,
  odrzavanje: cleaning,
};

export function CategoryVisual({
  category,
  className = "",
}: {
  category: string;
  className?: string;
}) {
  const src = categoryPhotos[category];
  return src ? (
    <img src={src} alt="" width={680} height={680} loading="lazy" className={className} />
  ) : null;
}
