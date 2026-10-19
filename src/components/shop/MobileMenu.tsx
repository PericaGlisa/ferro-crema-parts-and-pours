import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ChevronDown, ScanLine } from "lucide-react";
import { topCategories, subcategoriesOf } from "@/data/seed";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function MobileMenu({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const close = () => onOpenChange(false);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="mobile-menu flex w-full max-w-md flex-col gap-0 p-0">
        <SheetHeader className="border-b px-6 pb-6 pt-8 text-left">
          <SheetTitle className="text-2xl font-extrabold">Ferro Crema</SheetTitle>
          <SheetDescription className="text-xs">
            Delovi za espresso aparate i mlinove
          </SheetDescription>
        </SheetHeader>
        <nav
          aria-label="Mobilna navigacija"
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5"
        >
          <Link
            to="/"
            onClick={close}
            className="flex min-h-12 items-center justify-between text-sm font-bold"
          >
            Početna <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            to="/prodavnica"
            onClick={close}
            className="flex min-h-12 items-center justify-between border-b pb-3 text-sm font-bold"
          >
            Cela ponuda <ArrowUpRight className="h-4 w-4" />
          </Link>
          <p className="pb-2 pt-6 font-mono text-[10px] text-muted-foreground">KATEGORIJE</p>
          {topCategories.map((c) => (
            <details key={c.id} className="group border-b">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 py-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
                <span className="min-w-0">
                  {c.name.sr
                    .replace("Rezervni delovi – espresso aparati", "Delovi za aparate")
                    .replace("Rezervni delovi – mlinovi", "Delovi za mlinove")}
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <div className="space-y-1 pb-4 pl-3">
                <Link
                  to="/prodavnica"
                  search={{ category: c.slug }}
                  onClick={close}
                  className="flex min-h-11 items-center text-xs font-bold"
                >
                  Pogledajte sve <ArrowUpRight className="ml-2 h-3 w-3" />
                </Link>
                {subcategoriesOf(c.id).map((s) => (
                  <Link
                    key={s.id}
                    to="/prodavnica"
                    search={{ category: s.slug }}
                    onClick={close}
                    className="flex min-h-11 items-center text-sm text-muted-foreground"
                  >
                    {s.name.sr}
                  </Link>
                ))}
              </div>
            </details>
          ))}
          <Link
            to="/prodavnica"
            search={{ onSale: true }}
            onClick={close}
            className="flex min-h-14 items-center justify-between text-sm font-bold text-alert"
          >
            Akcije <ArrowUpRight className="h-4 w-4" />
          </Link>
        </nav>
        <div className="safe-bottom border-t bg-secondary px-6 py-5">
          <Button asChild className="h-12 w-full justify-between">
            <Link to="/prodavnica" onClick={close}>
              <span className="flex items-center gap-2">
                <ScanLine className="h-4 w-4" /> Pronađite svoj deo
              </span>
              <ArrowUpRight />
            </Link>
          </Button>
          <p className="mt-3 text-center text-[10px] text-muted-foreground">
            Precizno odabrani delovi. Za godine dobrog espressa.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
