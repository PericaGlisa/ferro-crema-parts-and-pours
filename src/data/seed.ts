import type {
  Brand,
  Bundle,
  Category,
  GroupType,
  MachineModel,
  PortafilterSize,
  Product,
  Spec,
} from "./types";

const img = (label: string) =>
  `https://placehold.co/800x800/EDEDEA/5E6A73?text=${encodeURIComponent(label)}`;

/* ------------------------------------------------------------------ categories */

type CatSeed = [slug: string, sr: string, en: string, subs: [string, string, string][]];

const catSeed: CatSeed[] = [
  [
    "rezervni-delovi-espresso",
    "Rezervni delovi – espresso aparati",
    "Spare parts – espresso machines",
    [
      ["dihtunzi", "Dihtunzi", "Group gaskets"],
      ["tus-sita", "Tuš sita", "Shower screens"],
      ["rucke-portafilteri", "Ručke (portafilteri)", "Portafilters"],
      ["sitaste-korpe", "Sitaste korpe", "Filter baskets"],
      ["parni-i-vodeni-vrhovi", "Parni i vodeni vrhovi", "Steam & water tips"],
      ["ventili-i-solenoidi", "Ventili i solenoidi", "Valves & solenoids"],
      ["presostati-i-senzori", "Presostati i senzori", "Pressurestats & sensors"],
      ["grejaci", "Grejači", "Heating elements"],
      ["pumpe", "Pumpe", "Pumps"],
      ["servisni-kompleti", "Servisni kompleti", "Service kits"],
    ],
  ],
  [
    "rezervni-delovi-mlinovi",
    "Rezervni delovi – mlinovi",
    "Spare parts – grinders",
    [
      ["nozevi-burrs", "Noževi (burrs)", "Burrs"],
      ["posude-za-zrna", "Posude za zrna", "Bean hoppers"],
      ["komponente-mlinova", "Komponente", "Grinder components"],
      ["motori", "Motori", "Motors"],
    ],
  ],
  [
    "barista-alat",
    "Barista alat",
    "Barista tools",
    [
      ["tamperi-i-distributeri", "Tamperi i distributeri", "Tampers & distributors"],
      ["wdt", "WDT", "WDT tools"],
      ["dozirni-prsteni", "Dozirni prsteni", "Dosing rings"],
      ["puck-screen", "Puck screen", "Puck screens"],
      ["vage", "Vage", "Scales"],
      ["bokali-za-mleko", "Bokali za mleko", "Milk pitchers"],
    ],
  ],
  [
    "radna-stanica",
    "Radna stanica",
    "Workstation",
    [
      ["tamping-stanice", "Tamping stanice", "Tamping stations"],
      ["knock-box", "Knock box", "Knock boxes"],
      ["podloge", "Podloge", "Bar mats"],
      ["organizacija", "Organizacija", "Organisation"],
    ],
  ],
  [
    "priprema",
    "Priprema",
    "Brewing",
    [
      ["pour-over", "Pour-over", "Pour-over"],
      ["kuvala", "Kuvala", "Kettles"],
      ["aeropress-french-press", "Aeropress / French press", "Aeropress / French press"],
      ["cold-brew", "Cold brew", "Cold brew"],
    ],
  ],
  [
    "odrzavanje",
    "Održavanje",
    "Maintenance",
    [
      ["sredstva-za-ciscenje", "Sredstva za čišćenje", "Cleaning agents"],
      ["cetke", "Četke", "Brushes"],
      ["filteri-za-vodu", "Filteri za vodu", "Water filters"],
    ],
  ],
  [
    "pro-horeca",
    "PRO / HoReCa",
    "PRO / HoReCa",
    [
      ["profesionalni-aparati", "Profesionalni aparati", "Professional machines"],
      ["profesionalni-mlinovi", "Profesionalni mlinovi", "Professional grinders"],
    ],
  ],
];

export const categories: Category[] = catSeed.flatMap(([slug, sr, en, subs], i) => {
  const top: Category = {
    id: slug,
    slug,
    name: { sr, en },
    sort: (i + 1) * 100,
    image: img(sr),
  };
  const children: Category[] = subs.map(([cslug, csr, cen], j) => ({
    id: cslug,
    slug: cslug,
    name: { sr: csr, en: cen },
    parentId: slug,
    sort: (i + 1) * 100 + j + 1,
    image: img(csr),
  }));
  return [top, ...children];
});

export const topCategories = categories.filter((c) => !c.parentId);
export const subcategoriesOf = (id: string) => categories.filter((c) => c.parentId === id);

/* --------------------------------------------------------------------- brands */

const brandSeed: [string, string][] = [
  ["ferro-crema", "Ferro Crema"],
  ["cremaline", "Cremaline"],
  ["steelworks", "Steelworks"],
  ["gicar", "Gicar Servis"],
  ["ulka-line", "Ulka Line"],
  ["ceado-parts", "Ceado Parts"],
  ["mazzer-parts", "Mazzer Parts"],
  ["eureka-parts", "Eureka Parts"],
  ["nuova-line", "Nuova Line"],
  ["ims-precision", "IMS Precision"],
  ["pesado-tools", "Pesado Tools"],
  ["normcore-lab", "Normcore Lab"],
  ["cafelat-co", "Cafelat Co"],
  ["puly-clean", "Puly Clean"],
  ["bwt-water", "BWT Water"],
];

export const brands: Brand[] = brandSeed.map(([slug, name]) => ({
  id: slug,
  slug,
  name,
  logo: img(name),
  description: {
    sr: `${name} — provereni delovi i alat, uz garanciju dimenzija i porudžbinu po OEM kodu.`,
    en: `${name} — verified parts and tools, with dimension guarantees and OEM-code ordering.`,
  },
}));

/* ------------------------------------------------------------- machine models */

type ModelSeed = [brand: string, model: string, pf: PortafilterSize, group: GroupType];

const modelSeed: ModelSeed[] = [
  ["La Marzocco", "Linea Mini", 58, "La Marzocco"],
  ["La Marzocco", "Linea Classic", 58, "La Marzocco"],
  ["La Marzocco", "GS3", 58, "La Marzocco"],
  ["Rancilio", "Silvia", 58, "Rancilio"],
  ["Rancilio", "Silvia Pro X", 58, "Rancilio"],
  ["Rancilio", "Classe 5", 58, "Rancilio"],
  ["Faema", "E61 Legend", 57, "Faema"],
  ["Faema", "E98 UP", 57, "Faema"],
  ["Gaggia", "Classic Pro", 58, "Other"],
  ["Gaggia", "New Classic", 58, "Other"],
  ["ECM", "Synchronika", 58, "E61"],
  ["ECM", "Mechanika V Slim", 58, "E61"],
  ["Profitec", "Pro 500", 58, "E61"],
  ["Profitec", "Pro 700", 58, "E61"],
  ["Lelit", "Bianca", 58, "E61"],
  ["Lelit", "Mara X", 57, "E61"],
  ["Lelit", "Anna", 57, "Other"],
  ["Nuova Simonelli", "Oscar II", 58, "Other"],
  ["Nuova Simonelli", "Appia Life", 58, "Other"],
  ["Sage", "Dual Boiler", 54, "Other"],
  ["Sage", "Barista Express", 54, "Other"],
  ["De'Longhi", "Dedica", 51, "Other"],
  ["De'Longhi", "La Specialista", 51, "Other"],
  ["Ascaso", "Steel Duo", 58, "Other"],
  ["Bezzera", "BZ13", 58, "E61"],
];

export const machineModels: MachineModel[] = modelSeed.map(([brand, model, pf, group], i) => ({
  id: `m${i + 1}`,
  brand,
  model,
  portafilterSize: pf,
  groupType: group,
}));

export const machineBrands = Array.from(new Set(machineModels.map((m) => m.brand)));

/* ------------------------------------------------------------------- products */

type Tpl = {
  cat: string;
  sr: string;
  en: string;
  brands: string[];
  price: [number, number];
  material: string;
  specs: (v: string) => Spec[];
  variants: string[]; // suffix per generated product
  pf?: PortafilterSize;
  oem: string;
};

const mm = (v: string): Spec[] => [{ key: "Prečnik", value: v, unit: "mm" }];

const templates: Tpl[] = [
  {
    cat: "dihtunzi",
    sr: "Dihtung grupe",
    en: "Group gasket",
    brands: ["cremaline", "steelworks", "ferro-crema"],
    price: [390, 1290],
    material: "EPDM",
    variants: ["8,0 mm", "8,5 mm", "9,0 mm", "Silikon 8,5 mm", "Set 3 kom"],
    specs: (v) => [
      { key: "Prečnik", value: "58", unit: "mm" },
      { key: "Debljina", value: v.replace(/[^0-9,]/g, "") || "8,5", unit: "mm" },
      { key: "Materijal", value: "EPDM" },
      { key: "Temp. otpornost", value: "150", unit: "°C" },
    ],
    oem: "GSK",
  },
  {
    cat: "tus-sita",
    sr: "Tuš sito",
    en: "Shower screen",
    brands: ["ims-precision", "steelworks", "cremaline"],
    price: [690, 3490],
    material: "Nerđajući čelik",
    variants: ["ø 56 mm", "ø 57 mm", "ø 58,5 mm", "Kompetition ø 58,5 mm", "Mesing ø 57 mm"],
    specs: (v) => [
      ...mm(v.replace(/[^0-9,]/g, "") || "57"),
      { key: "Perforacija", value: "0,3", unit: "mm" },
      { key: "Materijal", value: "Nerđajući čelik" },
    ],
    oem: "SHW",
  },
  {
    cat: "rucke-portafilteri",
    sr: "Ručka portafiltera",
    en: "Portafilter",
    brands: ["steelworks", "pesado-tools", "nuova-line"],
    price: [3990, 12490],
    material: "Mesing / nerđajući čelik",
    variants: ["58 mm bez dna", "58 mm dupla", "54 mm dupla", "51 mm dupla", "58 mm drvena ručica"],
    specs: (v) => [
      ...mm(v.split(" ")[0]),
      { key: "Materijal tela", value: "Hromirani mesing" },
      { key: "Masa", value: "540", unit: "g" },
    ],
    oem: "PF",
  },
  {
    cat: "sitaste-korpe",
    sr: "Sitasta korpa",
    en: "Filter basket",
    brands: ["ims-precision", "cremaline", "normcore-lab"],
    price: [890, 4290],
    material: "Nerđajući čelik",
    variants: ["18 g ø 58", "20 g ø 58", "14 g ø 54", "7 g ø 51", "22 g precision ø 58"],
    specs: (v) => [
      { key: "Doza", value: v.split(" ")[0], unit: "g" },
      {
        key: "Prečnik",
        value: v.includes("54") ? "54" : v.includes("51") ? "51" : "58",
        unit: "mm",
      },
      { key: "Materijal", value: "Nerđajući čelik 304" },
    ],
    oem: "BSK",
  },
  {
    cat: "parni-i-vodeni-vrhovi",
    sr: "Vrh parne cevi",
    en: "Steam tip",
    brands: ["steelworks", "nuova-line", "cremaline"],
    price: [590, 2190],
    material: "Mesing",
    variants: ["2 otvora", "3 otvora", "4 otvora", "Latte 1 otvor", "Vodeni vrh"],
    specs: (v) => [
      { key: "Otvori", value: v.replace(/[^0-9]/g, "") || "1" },
      { key: "Navoj", value: "M8x1" },
      { key: "Materijal", value: "Mesing" },
    ],
    oem: "STP",
  },
  {
    cat: "ventili-i-solenoidi",
    sr: "Solenoidni ventil",
    en: "Solenoid valve",
    brands: ["gicar", "nuova-line", "steelworks"],
    price: [2490, 8990],
    material: "Mesing",
    variants: [
      "2 puta 230 V",
      "3 puta 230 V",
      "3 puta 120 V",
      "Ekspanzioni ventil",
      "Nepovratni ventil",
    ],
    specs: (v) => [
      { key: "Napon", value: v.includes("120") ? "120" : "230", unit: "V" },
      { key: "Priključak", value: '1/8"' },
      { key: "Radni pritisak", value: "16", unit: "bar" },
    ],
    oem: "SOL",
  },
  {
    cat: "presostati-i-senzori",
    sr: "Presostat",
    en: "Pressurestat",
    brands: ["gicar", "cremaline"],
    price: [3290, 9490],
    material: "Mesing",
    variants: ["0,5–1,4 bar", "Sonda nivoa", "Manometar 0–16 bar", "Termostat 165 °C"],
    specs: () => [
      { key: "Opseg", value: "0,5–1,4", unit: "bar" },
      { key: "Priključak", value: '1/4"' },
    ],
    oem: "PRS",
  },
  {
    cat: "grejaci",
    sr: "Grejač bojlera",
    en: "Boiler element",
    brands: ["gicar", "nuova-line"],
    price: [4990, 15900],
    material: "Nerđajući čelik",
    variants: ["1200 W", "1400 W", "1650 W", "3000 W"],
    specs: (v) => [
      { key: "Moć", value: v.replace(/[^0-9]/g, ""), unit: "W" },
      { key: "Napon", value: "230", unit: "V" },
    ],
    oem: "HTR",
  },
  {
    cat: "pumpe",
    sr: "Vibraciona pumpa",
    en: "Vibration pump",
    brands: ["ulka-line", "gicar"],
    price: [3890, 11900],
    material: "Mesing / plastika",
    variants: ["EX5 48 W", "EP5 52 W", "Rotaciona 150 l/h", "Set pumpa + nosač"],
    specs: () => [
      { key: "Protok", value: "48", unit: "l/h" },
      { key: "Napon", value: "230", unit: "V" },
    ],
    oem: "PMP",
  },
  {
    cat: "servisni-kompleti",
    sr: "Servisni komplet",
    en: "Service kit",
    brands: ["ferro-crema", "cremaline"],
    price: [1990, 7490],
    material: "Mešano",
    variants: [
      "E61 osnovni",
      "E61 kompletan",
      "Rancilio Silvia",
      "La Marzocco Linea",
      "Gaggia Classic",
    ],
    specs: () => [
      { key: "Broj delova", value: "9" },
      { key: "Interval servisa", value: "12", unit: "meseci" },
    ],
    oem: "KIT",
  },
  {
    cat: "nozevi-burrs",
    sr: "Noževi za mlin",
    en: "Grinder burrs",
    brands: ["mazzer-parts", "eureka-parts", "ceado-parts"],
    price: [4990, 18900],
    material: "Kaljeni čelik",
    variants: [
      "ø 64 mm ravni",
      "ø 65 mm ravni",
      "ø 71 mm ravni",
      "ø 83 mm ravni",
      "ø 68 mm konusni",
    ],
    specs: (v) => [...mm(v.replace(/[^0-9]/g, "")), { key: "Tvrdoća", value: "62", unit: "HRC" }],
    oem: "BUR",
  },
  {
    cat: "posude-za-zrna",
    sr: "Posuda za zrna",
    en: "Bean hopper",
    brands: ["mazzer-parts", "eureka-parts"],
    price: [2490, 8990],
    material: "Tritan",
    variants: ["250 g", "500 g", "1200 g", "Single dose 60 g"],
    specs: (v) => [{ key: "Kapacitet", value: v.replace(/[^0-9]/g, ""), unit: "g" }],
    oem: "HOP",
  },
  {
    cat: "komponente-mlinova",
    sr: "Komponenta mlina",
    en: "Grinder component",
    brands: ["mazzer-parts", "ceado-parts", "eureka-parts"],
    price: [1290, 9900],
    material: "Mešano",
    variants: ["Nosač noža", "Opruga podešavanja", "Prekidač", "Ležaj osovine", "Zupčanik"],
    specs: () => [{ key: "Garancija", value: "24", unit: "meseci" }],
    oem: "GRC",
  },
  {
    cat: "motori",
    sr: "Motor mlina",
    en: "Grinder motor",
    brands: ["mazzer-parts", "ceado-parts"],
    price: [14900, 39900],
    material: "Mešano",
    variants: ["250 W", "350 W", "600 W"],
    specs: (v) => [{ key: "Moć", value: v.replace(/[^0-9]/g, ""), unit: "W" }],
    oem: "MTR",
  },
  {
    cat: "tamperi-i-distributeri",
    sr: "Tamper",
    en: "Tamper",
    brands: ["pesado-tools", "normcore-lab", "steelworks"],
    price: [2990, 12900],
    material: "Nerđajući čelik",
    variants: [
      "58,35 mm ravan",
      "58,5 mm konveksan",
      "53,3 mm ravan",
      "51 mm ravan",
      "Distributer 58,5 mm",
    ],
    specs: (v) => [...mm(v.split(" ")[0]), { key: "Masa", value: "480", unit: "g" }],
    oem: "TMP",
  },
  {
    cat: "wdt",
    sr: "WDT alat",
    en: "WDT tool",
    brands: ["normcore-lab", "pesado-tools"],
    price: [1490, 5990],
    material: "Nerđajući čelik",
    variants: ["0,3 mm igle", "0,4 mm igle", "sa stalkom", "Rotacioni"],
    specs: (v) => [{ key: "Debljina igle", value: v.replace(/[^0-9,]/g, "") || "0,4", unit: "mm" }],
    oem: "WDT",
  },
  {
    cat: "dozirni-prsteni",
    sr: "Dozirni prsten",
    en: "Dosing ring",
    brands: ["normcore-lab", "steelworks"],
    price: [1190, 3490],
    material: "Aluminijum",
    variants: ["58 mm magnetni", "54 mm magnetni", "51 mm"],
    specs: (v) => [...mm(v.split(" ")[0])],
    oem: "DSR",
  },
  {
    cat: "puck-screen",
    sr: "Puck screen",
    en: "Puck screen",
    brands: ["ims-precision", "normcore-lab"],
    price: [890, 2490],
    material: "Nerđajući čelik",
    variants: ["1,7 mm ø 58,5", "0,8 mm ø 58,5", "1,7 mm ø 51"],
    specs: (v) => [{ key: "Debljina", value: v.split(" ")[0], unit: "mm" }],
    oem: "PCK",
  },
  {
    cat: "vage",
    sr: "Barista vaga",
    en: "Barista scale",
    brands: ["pesado-tools", "normcore-lab"],
    price: [4990, 17900],
    material: "Plastika / staklo",
    variants: ["0,1 g / 2 kg", "0,1 g sa tajmerom", "0,01 g / 500 g"],
    specs: () => [{ key: "Tačnost", value: "0,1", unit: "g" }],
    oem: "SCL",
  },
  {
    cat: "bokali-za-mleko",
    sr: "Bokal za mleko",
    en: "Milk pitcher",
    brands: ["steelworks", "cafelat-co"],
    price: [1290, 4990],
    material: "Nerđajući čelik",
    variants: ["350 ml", "600 ml", "900 ml", "600 ml mat crni"],
    specs: (v) => [{ key: "Zapremina", value: v.replace(/[^0-9]/g, ""), unit: "ml" }],
    oem: "PIT",
  },
  {
    cat: "tamping-stanice",
    sr: "Tamping stanica",
    en: "Tamping station",
    brands: ["pesado-tools", "cafelat-co"],
    price: [4990, 14900],
    material: "Drvo / silikon",
    variants: ["58 mm", "54 mm", "sa ležištem za tamper"],
    specs: () => [{ key: "Dimenzije", value: "180×120×60", unit: "mm" }],
    oem: "TST",
  },
  {
    cat: "knock-box",
    sr: "Knock box",
    en: "Knock box",
    brands: ["cafelat-co", "steelworks"],
    price: [2490, 8990],
    material: "Nerđajući čelik / silikon",
    variants: ["1,2 l", "2,0 l", "ugradni"],
    specs: () => [{ key: "Zapremina", value: "2", unit: "l" }],
    oem: "KNB",
  },
  {
    cat: "podloge",
    sr: "Silikonska podloga",
    en: "Bar mat",
    brands: ["cafelat-co", "ferro-crema"],
    price: [990, 3490],
    material: "Silikon",
    variants: ["150×150 mm", "300×150 mm", "400×200 mm"],
    specs: () => [{ key: "Materijal", value: "Silikon" }],
    oem: "MAT",
  },
  {
    cat: "organizacija",
    sr: "Držač alata",
    en: "Tool holder",
    brands: ["ferro-crema", "steelworks"],
    price: [1490, 5490],
    material: "Nerđajući čelik",
    variants: ["za 2 ručke", "za 3 ručke", "zidni za tamper"],
    specs: () => [{ key: "Montaža", value: "Zidna" }],
    oem: "ORG",
  },
  {
    cat: "pour-over",
    sr: "Pour-over set",
    en: "Pour-over set",
    brands: ["cafelat-co", "ferro-crema"],
    price: [1990, 7990],
    material: "Keramika / staklo",
    variants: ["V-dripper 02", "Karafa 600 ml", "Papirni filteri 100 kom"],
    specs: () => [{ key: "Kapacitet", value: "600", unit: "ml" }],
    oem: "POV",
  },
  {
    cat: "kuvala",
    sr: "Kuvalo sa tankim grlom",
    en: "Gooseneck kettle",
    brands: ["steelworks", "cafelat-co"],
    price: [4990, 15900],
    material: "Nerđajući čelik",
    variants: ["0,8 l ručno", "1,0 l električno", "1,0 l sa PID"],
    specs: () => [{ key: "Zapremina", value: "1", unit: "l" }],
    oem: "KTL",
  },
  {
    cat: "aeropress-french-press",
    sr: "French press",
    en: "French press",
    brands: ["cafelat-co", "ferro-crema"],
    price: [1490, 5990],
    material: "Staklo / čelik",
    variants: ["350 ml", "800 ml", "Rezervni filter"],
    specs: () => [{ key: "Zapremina", value: "800", unit: "ml" }],
    oem: "FRP",
  },
  {
    cat: "cold-brew",
    sr: "Cold brew posuda",
    en: "Cold brew brewer",
    brands: ["cafelat-co"],
    price: [2490, 6990],
    material: "Staklo",
    variants: ["600 ml", "1,2 l"],
    specs: () => [{ key: "Zapremina", value: "1,2", unit: "l" }],
    oem: "CBR",
  },
  {
    cat: "sredstva-za-ciscenje",
    sr: "Sredstvo za čišćenje",
    en: "Cleaning agent",
    brands: ["puly-clean", "ferro-crema"],
    price: [690, 4490],
    material: "Prašak / tablete",
    variants: ["Prašak 900 g", "Tablete 100 kom", "Za mlinove 3×15 g", "Sredstvo za mleko 1 l"],
    specs: () => [{ key: "Pakovanje", value: "900", unit: "g" }],
    oem: "CLN",
  },
  {
    cat: "cetke",
    sr: "Četka za grupu",
    en: "Group brush",
    brands: ["puly-clean", "ferro-crema"],
    price: [490, 1990],
    material: "Najlon",
    variants: ["zakrivljena", "sa strugačem", "za mlin"],
    specs: () => [{ key: "Dužina", value: "210", unit: "mm" }],
    oem: "BRS",
  },
  {
    cat: "filteri-za-vodu",
    sr: "Filter za vodu",
    en: "Water filter",
    brands: ["bwt-water", "puly-clean"],
    price: [2990, 18900],
    material: "Mešano",
    variants: ["patrona S", "patrona M", "omekšivač 8 l", "TDS tester"],
    specs: () => [{ key: "Kapacitet", value: "1200", unit: "l" }],
    oem: "WTF",
  },
  {
    cat: "profesionalni-aparati",
    sr: "Profesionalni espresso aparat",
    en: "Professional espresso machine",
    brands: ["nuova-line", "steelworks"],
    price: [289000, 690000],
    material: "Nerđajući čelik",
    variants: ["2 grupe", "3 grupe"],
    specs: () => [{ key: "Grupe", value: "2" }],
    oem: "MCH",
  },
  {
    cat: "profesionalni-mlinovi",
    sr: "Profesionalni mlin",
    en: "Professional grinder",
    brands: ["mazzer-parts", "ceado-parts"],
    price: [79000, 210000],
    material: "Nerđajući čelik",
    variants: ["ø 64 mm", "ø 83 mm"],
    specs: () => [{ key: "Noževi", value: "83", unit: "mm" }],
    oem: "GRD",
  },
];

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[čćĉ]/g, "c")
    .replace(/[šś]/g, "s")
    .replace(/[žź]/g, "z")
    .replace(/đ/g, "dj")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const pfFromText = (t: string): PortafilterSize | undefined => {
  if (t.includes("58,35")) return 58.35;
  if (t.includes("58")) return 58;
  if (t.includes("57")) return 57;
  if (t.includes("54") || t.includes("53")) return 54;
  if (t.includes("51")) return 51;
  return undefined;
};

const compatFor = (pf?: PortafilterSize): Product["compatibility"] => {
  const pool = pf
    ? machineModels.filter((m) => Math.round(m.portafilterSize) === Math.round(pf))
    : machineModels;
  const use = pool.length ? pool : machineModels;
  const byBrand = new Map<string, { models: string[]; groupType: GroupType }>();
  use.forEach((m) => {
    const e = byBrand.get(m.brand) ?? { models: [], groupType: m.groupType as GroupType };
    e.models.push(m.model);
    byBrand.set(m.brand, e);
  });
  return Array.from(byBrand.entries()).map(([machineBrand, v]) => ({
    machineBrand,
    models: v.models,
    groupType: v.groupType,
  }));
};

const products: Product[] = [];
let n = 0;
templates.forEach((tpl, ti) => {
  tpl.variants.forEach((variant, vi) => {
    n += 1;
    const brandId = tpl.brands[vi % tpl.brands.length];
    const brand = brands.find((b) => b.id === brandId)!;
    const nameSr = `${tpl.sr} ${variant}`;
    const nameEn = `${tpl.en} ${variant}`;
    const span = tpl.price[1] - tpl.price[0];
    const rawPrice = tpl.price[0] + Math.round((span * ((vi * 37 + ti * 13) % 100)) / 100);
    const price = Math.round(rawPrice / 10) * 10;
    const onSale = n % 7 === 0;
    const stock = n % 11 === 0 ? 0 : ((n * 5) % 24) + 1;
    const pf = tpl.pf ?? pfFromText(variant);
    const badges: Product["badges"] = [];
    if (n % 9 === 0) badges.push("new");
    if (n % 6 === 0) badges.push("bestseller");
    if (onSale) badges.push("sale");
    if (tpl.cat.startsWith("profesionalni")) badges.push("pro");

    products.push({
      id: `p${n}`,
      slug: slugify(`${nameSr}-${brand.name}-${n}`),
      sku: `FC-${tpl.oem}-${String(1000 + n)}`,
      oemCodes: [`${tpl.oem}${2200 + n * 3}`, `OEM-${tpl.oem}-${n * 7}`],
      ean: `86001${String(100000 + n)}`,
      name: { sr: nameSr, en: nameEn },
      shortDescription: {
        sr: `${tpl.sr} — ${variant}. Materijal: ${tpl.material}. Isporuka 1–2 radna dana.`,
        en: `${tpl.en} — ${variant}. Material: ${tpl.material}. Ships in 1–2 business days.`,
      },
      description: {
        sr: `${nameSr} proizvođača ${brand.name}. Dimenzije su merene i navedene u tabeli specifikacija, pa deo možete uporediti sa postojećim pre naručivanja. Pre ugradnje očistite ležište i proverite da nema ostataka starog dihtunga ili kamenca. Ako model vašeg aparata nije na listi kompatibilnosti, pošaljite nam OEM kod sa originalnog dela.`,
        en: `${nameEn} by ${brand.name}. All dimensions are measured and listed in the specification table so you can compare the part with your existing one before ordering. Clean the seat before installation and check for scale or old gasket residue. If your machine model is not listed, send us the OEM code from the original part.`,
      },
      brandId,
      categoryIds: [tpl.cat],
      images: [
        { src: img(tpl.sr), alt: { sr: nameSr, en: nameEn }, w: 800, h: 800 },
        {
          src: img(variant),
          alt: { sr: `${nameSr} — detalj`, en: `${nameEn} — detail` },
          w: 800,
          h: 800,
        },
      ],
      price,
      compareAtPrice: onSale ? Math.round((price * 1.25) / 10) * 10 : undefined,
      currency: "RSD",
      stock,
      leadTimeDays: stock === 0 ? 7 : 1,
      specs: [...tpl.specs(variant), { key: "Materijal", value: tpl.material }],
      compatibility: compatFor(pf),
      portafilterSize: pf,
      badges: badges.length ? badges : undefined,
      rating: { avg: 4 + ((n % 10) / 10) * 0.9, count: 3 + (n % 40) },
    });
  });
});

// cross-link related products within the same category
products.forEach((p) => {
  p.relatedIds = products
    .filter((o) => o.id !== p.id && o.categoryIds[0] === p.categoryIds[0])
    .slice(0, 4)
    .map((o) => o.id);
});

export const allProducts = products;

/* -------------------------------------------------------------------- bundles */

const bundleOf = (slugPart: string, count: number) =>
  products.filter((p) => p.categoryIds[0] === slugPart).slice(0, count);

const mkBundle = (
  id: string,
  sr: string,
  en: string,
  picks: Product[],
  discount: number,
): Bundle => {
  const compareAtPrice = picks.reduce((s, p) => s + p.price, 0);
  return {
    id,
    slug: id,
    name: { sr, en },
    productIds: picks.map((p) => p.id),
    price: Math.round((compareAtPrice * (1 - discount)) / 10) * 10,
    compareAtPrice,
  };
};

export const bundles: Bundle[] = [
  mkBundle(
    "servis-e61",
    "Servisni set za E61 grupu",
    "E61 group service set",
    [
      ...bundleOf("dihtunzi", 1),
      ...bundleOf("tus-sita", 1),
      ...bundleOf("cetke", 1),
      ...bundleOf("sredstva-za-ciscenje", 1),
    ],
    0.15,
  ),
  mkBundle(
    "start-barista",
    "Startni barista set 58 mm",
    "Starter barista set 58 mm",
    [
      ...bundleOf("tamperi-i-distributeri", 1),
      ...bundleOf("wdt", 1),
      ...bundleOf("dozirni-prsteni", 1),
      ...bundleOf("bokali-za-mleko", 1),
    ],
    0.12,
  ),
  mkBundle(
    "precizna-ekstrakcija",
    "Set za preciznu ekstrakciju",
    "Precision extraction set",
    [...bundleOf("sitaste-korpe", 1), ...bundleOf("puck-screen", 1), ...bundleOf("vage", 1)],
    0.1,
  ),
  mkBundle(
    "odrzavanje-mlina",
    "Set za održavanje mlina",
    "Grinder maintenance set",
    [...bundleOf("nozevi-burrs", 1), ...bundleOf("cetke", 1), ...bundleOf("komponente-mlinova", 1)],
    0.14,
  ),
];

bundles.forEach((b) =>
  b.productIds.forEach((pid) => {
    const p = products.find((x) => x.id === pid);
    if (p) p.bundleIds = [...(p.bundleIds ?? []), b.id];
  }),
);

export const FREE_SHIPPING_THRESHOLD = 8000;
