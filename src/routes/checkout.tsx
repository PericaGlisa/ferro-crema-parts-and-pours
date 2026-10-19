import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  CheckCircle2,
  Landmark,
  Package,
  ShoppingBag,
  Store as StoreIcon,
  Truck,
} from "lucide-react";
import { catalog } from "@/data/catalogService";
import { FREE_SHIPPING_THRESHOLD } from "@/data/seed";
import { rsd, useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductImage } from "@/components/shop/ProductImage";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  head: () => ({
    meta: [
      { title: "Poručivanje — Ferro Crema — delovi za espresso aparate i mlinove" },
      {
        name: "description",
        content:
          "Završite porudžbinu — plaćanje pouzećem ili uplatnicom. Ferro Crema — delovi za espresso aparate i mlinove.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
});

const SHIPPING = 400;

type Delivery = "kurir" | "licno";
type Payment = "pouzece" | "uplatnica";

function Field({
  id,
  label,
  error,
  ...props
}: { id: string; label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs">
        {label}
      </Label>
      <Input id={id} aria-invalid={!!error} {...props} />
      {error && <p className="text-[11px] text-alert">{error}</p>}
    </div>
  );
}

function CheckoutPage() {
  const { cart, clearCart } = useStore();
  const items = cart.flatMap((l) => {
    const p = catalog.getProductsByIds([l.productId])[0];
    return p ? [{ ...l, p }] : [];
  });
  const subtotal = items.reduce((s, l) => s + l.p.price * l.qty, 0);

  const [delivery, setDelivery] = useState<Delivery>("kurir");
  const [payment, setPayment] = useState<Payment>("pouzece");
  const [form, setForm] = useState({
    ime: "",
    telefon: "",
    email: "",
    adresa: "",
    grad: "",
    posta: "",
    napomena: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderId, setOrderId] = useState<string | null>(null);

  const shippingCost = delivery === "licno" || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING;
  const total = subtotal + shippingCost;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.ime.trim().length < 3) errs.ime = "Unesite ime i prezime.";
    if (!/^[\d\s+/-]{6,}$/.test(form.telefon.trim()))
      errs.telefon = "Unesite ispravan broj telefona.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errs.email = "Unesite ispravnu e-mail adresu.";
    if (delivery === "kurir") {
      if (form.adresa.trim().length < 5) errs.adresa = "Unesite ulicu i broj.";
      if (form.grad.trim().length < 2) errs.grad = "Unesite grad.";
      if (!/^\d{5}$/.test(form.posta.trim())) errs.posta = "Poštanski broj ima 5 cifara.";
    }
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setOrderId(`FC-${Date.now().toString().slice(-6)}`);
    clearCart();
    window.scrollTo({ top: 0 });
  };

  if (orderId) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16 text-center md:px-8">
        <CheckCircle2 className="mx-auto h-14 w-14 stroke-1 text-ok" />
        <h1 className="mt-6 text-3xl font-extrabold">Porudžbina je primljena.</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Broj porudžbine: <span className="font-mono font-bold text-foreground">{orderId}</span>
        </p>
        <div className="mt-8 rounded-md border bg-secondary p-6 text-left text-sm leading-7">
          {payment === "pouzece" ? (
            <p>
              <b>Plaćanje pouzećem.</b> Plaćate kuriru prilikom preuzimanja pošiljke. Poslaćemo vam
              potvrdu na e-mail sa detaljima isporuke.
            </p>
          ) : (
            <p>
              <b>Plaćanje uplatnicom.</b> Na vašu e-mail adresu poslaćemo uplatnicu sa pozivom na
              broj <span className="font-mono">{orderId}</span>. Pošiljku šaljemo čim uplata bude
              vidljiva na našem računu.
            </p>
          )}
        </div>
        <Button asChild className="mt-8 h-12 bg-crema text-crema-foreground">
          <Link to="/prodavnica">
            Nastavite kupovinu <ArrowRight />
          </Link>
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-5 py-20 text-center md:px-8">
        <ShoppingBag className="h-12 w-12 stroke-1 text-muted-foreground" />
        <h1 className="mt-6 text-2xl font-bold">Korpa je prazna.</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Dodajte delove u korpu pre poručivanja.
        </p>
        <Button asChild className="mt-6">
          <Link to="/prodavnica">
            Istražite ponudu <ArrowRight />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
      <Link
        to="/prodavnica"
        className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Nazad na prodavnicu
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold">Poručivanje</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Bez registracije — dovoljni su nam podaci za dostavu.
      </p>

      <form onSubmit={submit} className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-8">
          <section>
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary font-mono text-[10px] text-primary-foreground">
                1
              </span>{" "}
              Podaci za dostavu
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field
                id="ime"
                label="Ime i prezime"
                value={form.ime}
                onChange={set("ime")}
                error={errors.ime}
                autoComplete="name"
              />
              <Field
                id="telefon"
                label="Telefon"
                value={form.telefon}
                onChange={set("telefon")}
                error={errors.telefon}
                autoComplete="tel"
                inputMode="tel"
                placeholder="06x xxx xx xx"
              />
              <Field
                id="email"
                label="E-mail"
                type="email"
                value={form.email}
                onChange={set("email")}
                error={errors.email}
                autoComplete="email"
              />
            </div>
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary font-mono text-[10px] text-primary-foreground">
                2
              </span>{" "}
              Način dostave
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                {
                  v: "kurir" as Delivery,
                  icon: Truck,
                  t: "Kurirska služba",
                  d:
                    subtotal >= FREE_SHIPPING_THRESHOLD
                      ? "Besplatno — 1–2 radna dana"
                      : `${rsd(SHIPPING)} — 1–2 radna dana`,
                },
                {
                  v: "licno" as Delivery,
                  icon: StoreIcon,
                  t: "Lično preuzimanje",
                  d: "Besplatno — Beograd",
                },
              ].map(({ v, icon: Icon, t, d }) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => setDelivery(v)}
                  aria-pressed={delivery === v}
                  className={`flex items-start gap-3 rounded-md border p-4 text-left transition-colors ${delivery === v ? "border-crema bg-secondary" : "hover:border-steel"}`}
                >
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-steel" />
                  <span>
                    <span className="block text-xs font-bold">{t}</span>
                    <span className="mt-0.5 block text-[11px] text-muted-foreground">{d}</span>
                  </span>
                </button>
              ))}
            </div>
            {delivery === "kurir" && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field
                  id="adresa"
                  label="Ulica i broj"
                  value={form.adresa}
                  onChange={set("adresa")}
                  error={errors.adresa}
                  autoComplete="street-address"
                />
                <Field
                  id="grad"
                  label="Grad"
                  value={form.grad}
                  onChange={set("grad")}
                  error={errors.grad}
                  autoComplete="address-level2"
                />
                <Field
                  id="posta"
                  label="Poštanski broj"
                  value={form.posta}
                  onChange={set("posta")}
                  error={errors.posta}
                  inputMode="numeric"
                  placeholder="11000"
                />
              </div>
            )}
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary font-mono text-[10px] text-primary-foreground">
                3
              </span>{" "}
              Način plaćanja
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                {
                  v: "pouzece" as Payment,
                  icon: Banknote,
                  t: "Pouzećem",
                  d: "Plaćate kuriru prilikom preuzimanja.",
                },
                {
                  v: "uplatnica" as Payment,
                  icon: Landmark,
                  t: "Uplatnicom",
                  d: "Uplata na naš račun pre slanja pošiljke.",
                },
              ].map(({ v, icon: Icon, t, d }) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => setPayment(v)}
                  aria-pressed={payment === v}
                  className={`flex items-start gap-3 rounded-md border p-4 text-left transition-colors ${payment === v ? "border-crema bg-secondary" : "hover:border-steel"}`}
                >
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-steel" />
                  <span>
                    <span className="block text-xs font-bold">{t}</span>
                    <span className="mt-0.5 block text-[11px] text-muted-foreground">{d}</span>
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <Label htmlFor="napomena" className="text-xs">
              Napomena uz porudžbinu (opciono)
            </Label>
            <Input
              id="napomena"
              className="mt-1.5"
              value={form.napomena}
              onChange={set("napomena")}
              placeholder="Npr. pozvati pre isporuke…"
            />
          </section>
        </div>

        <aside className="h-fit rounded-md border bg-secondary p-6 lg:sticky lg:top-28">
          <h2 className="text-sm font-bold">Vaša porudžbina</h2>
          <div className="mt-4 space-y-4">
            {items.map(({ p, qty }) => (
              <div key={p.id} className="flex items-center gap-3">
                <ProductImage p={p} className="h-14 w-14 shrink-0 rounded" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{p.name.sr}</p>
                  <p className="font-mono text-[9px] text-muted-foreground">
                    {p.sku} × {qty}
                  </p>
                </div>
                <span className="text-xs font-bold">{rsd(p.price * qty)}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-2 border-t pt-4 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Međuzbir</span>
              <span>{rsd(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dostava</span>
              <span>{shippingCost === 0 ? "Besplatno" : rsd(shippingCost)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 text-base font-bold">
              <span>Ukupno</span>
              <span>{rsd(total)}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">PDV uključen u cenu.</p>
          </div>
          <Button type="submit" className="mt-5 h-12 w-full bg-crema text-crema-foreground">
            Potvrdi porudžbinu <Package />
          </Button>
          <p className="mt-3 text-center text-[10px] text-muted-foreground">
            Potvrdom prihvatate uslove kupovine. Podatke koristimo isključivo za isporuku.
          </p>
        </aside>
      </form>
    </div>
  );
}
