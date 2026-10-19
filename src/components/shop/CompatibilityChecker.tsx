import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Wrench,
  ChevronDown,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import type { Product } from "@/data/types";
import { catalog } from "@/data/catalogService";
import { Button } from "@/components/ui/button";

interface CompatibilityCheckerProps {
  product: Product;
}

const QUICK_PRESETS = [
  { label: "E61 Grupa (58 mm)", brand: "Rocket", model: "Giotto / Mozzafiato" },
  { label: "Rancilio Silvia", brand: "Rancilio", model: "Silvia" },
  { label: "La Marzocco Linea", brand: "La Marzocco", model: "Linea Mini / Micra" },
  { label: "Gaggia Classic", brand: "Gaggia", model: "Classic" },
  { label: "ECM Mechanika", brand: "ECM", model: "Mechanika" },
];

export function CompatibilityChecker({ product }: CompatibilityCheckerProps) {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");

  const allModels = catalog.listMachineModels();
  const brandsList = Array.from(new Set(allModels.map((m) => m.brand))).sort();
  const availableModelsForBrand = allModels.filter((m) => m.brand === selectedBrand);

  const isChecked = Boolean(selectedBrand && selectedModel);
  const fits = isChecked ? catalog.isCompatible(product.slug, selectedBrand, selectedModel) : null;

  const currentModelInfo = isChecked
    ? allModels.find((m) => m.brand === selectedBrand && m.model === selectedModel)
    : undefined;

  const handlePreset = (brand: string, model: string) => {
    setSelectedBrand(brand);
    setSelectedModel(model);
  };

  const reset = () => {
    setSelectedBrand("");
    setSelectedModel("");
  };

  return (
    <div className="mt-8 rounded-lg border bg-gradient-to-b from-card to-card/60 p-5 shadow-sm md:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-crema/15 text-crema">
            <Wrench className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight">
              Interaktivna provera kompatibilnosti
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Proverite tačnost dimenzija i grupe pre kupovine
            </p>
          </div>
        </div>
        {isChecked && (
          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
            className="h-7 gap-1 px-2 text-[11px] text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" /> Ponovo izaberi
          </Button>
        )}
      </div>

      {/* Quick selection chips */}
      <div className="mt-4">
        <span className="flex items-center gap-1 font-mono text-[10px] uppercase text-muted-foreground">
          <Sparkles className="h-3 w-3 text-crema" /> Najčešći modeli:
        </span>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {QUICK_PRESETS.map((p) => {
            const isActive = selectedBrand === p.brand && selectedModel === p.model;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => handlePreset(p.brand, p.model)}
                className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground font-semibold"
                    : "border-border bg-muted/60 text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selectors */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="relative">
          <label htmlFor="comp-brand-select" className="sr-only">
            Proizvođač aparata
          </label>
          <select
            id="comp-brand-select"
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setSelectedModel("");
            }}
            className="h-11 w-full appearance-none rounded-md border bg-background px-3 pr-8 text-xs font-medium outline-none transition-colors focus:border-primary"
          >
            <option value="">1. Izaberite proizvođača aparata</option>
            {brandsList.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-muted-foreground" />
        </div>

        <div className="relative">
          <label htmlFor="comp-model-select" className="sr-only">
            Model aparata
          </label>
          <select
            id="comp-model-select"
            value={selectedModel}
            disabled={!selectedBrand}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="h-11 w-full appearance-none rounded-md border bg-background px-3 pr-8 text-xs font-medium outline-none transition-colors focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">2. Izaberite model aparata</option>
            {availableModelsForBrand.map((m) => (
              <option key={m.id} value={m.model}>
                {m.model} ({m.portafilterSize} mm)
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Result Card */}
      {isChecked && fits !== null && (
        <div
          role="status"
          aria-live="polite"
          className={`mt-4 rounded-md border p-4 transition-all duration-200 ${
            fits
              ? "border-ok/40 bg-ok/10 text-foreground"
              : "border-alert/40 bg-alert/10 text-foreground"
          }`}
        >
          {fits ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-ok" />
                <span className="text-sm font-bold text-ok">
                  Garantovano odgovara za {selectedBrand} {selectedModel}!
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pl-7">
                Dimenzije i geometrija ovog dela odgovaraju fabričkim standardima grupe za vaš model
                ({currentModelInfo?.portafilterSize} mm
                {currentModelInfo?.groupType ? ` · ${currentModelInfo.groupType} tip` : ""}). Možete
                ga sigurno montirati.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 shrink-0 text-alert" />
                <span className="text-sm font-bold text-alert">
                  Ne odgovara za {selectedBrand} {selectedModel}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pl-7">
                Ovaj deo ima drugačije dimenzije ili specifikacije od onih koje zahteva grupa
                aparata {selectedBrand} {selectedModel}. Da biste izbegli curenje ili oštećenje,
                potražite deo namenjen vašem modelu.
              </p>
              <div className="pl-7">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 border-alert/30 text-xs hover:bg-alert/15"
                >
                  <Link
                    to="/prodavnica"
                    search={{ machineBrand: selectedBrand, machineModel: selectedModel }}
                  >
                    Prikaži odgovarajuće delove za {selectedBrand} {selectedModel}{" "}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Idle explanation / Compatibility overview */}
      {!isChecked && (
        <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-crema" /> Baza sa preko 20 proverenih modela
            aparata
          </span>
          <span className="hidden sm:inline">100% tačnost dimenzija</span>
        </div>
      )}
    </div>
  );
}
