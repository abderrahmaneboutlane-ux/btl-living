export interface Category {
  key: string;
  label: string;
  blurb: string;
}

export interface Product {
  slug: string;
  name: string;
  category: string; // Category.key
  price: number; // MAD
  priceFrom?: boolean; // "à partir de"
  tagline: string;
  description: string;
  matiere: string;
  finition: string;
  dimensions: string;
  delai: string;
  badge?: string;
  /** A single URL, or a JSON array of URLs (["/a.webp","/b.webp"]) for a
   *  multi-photo gallery. Empty/absent → the bundled /products/<slug>.webp. */
  image_url?: string | null;
}

export const CATEGORIES: Category[] = [
  {
    key: "chambre",
    label: "Chambre",
    blurb: "Lits, têtes de lit, chevets et commodes — pour des nuits calmes et des matins clairs.",
  },
  {
    key: "dressing",
    label: "Dressing",
    blurb: "Penderies, verrières et modules éclairés qui organisent l'espace sans l'alourdir.",
  },
  {
    key: "salle-a-manger",
    label: "Salle à manger",
    blurb: "Tables, chaises et buffets pour recevoir et prolonger les repas.",
  },
  {
    key: "salon",
    label: "Salon",
    blurb: "Assises, tables basses et meubles TV — le confort devient design.",
  },
  {
    key: "coiffeuse-decor",
    label: "Coiffeuse & décor",
    blurb: "Coiffeuses, miroirs et pièces d'appoint qui signent une pièce.",
  },
];

export const PRODUCTS: Product[] = [
  {
    slug: "lit-skoura",
    name: "Lit Skoura",
    category: "chambre",
    price: 2200,
    priceFrom: true,
    tagline: "140 × 190 cm — tête de lit capitonnée, chêne clair",
    description:
      "Une tête de lit capitonnée en tissu gris clair, portée par une structure en chêne. Disponible avec un sommier coffre — large rangement intégré pour couettes et linge de maison, sans surélever la chambre. Livraison et montage inclus.\n\nSimple : 2 200 DH · Avec coffre de rangement : 2 700 DH.",
    matiere: "Chêne clair · tissu",
    finition: "Vernis mat",
    dimensions: "Couchage 140 × 190 cm",
    delai: "Livraison et montage inclus",
    badge: "Nouveau",
  },
  {
    slug: "lit-bahia",
    name: "Lit Bahia",
    category: "chambre",
    price: 2600,
    priceFrom: true,
    tagline: "160 × 200 cm — laqué blanc, liseré doré",
    description:
      "Une structure laquée blanc brillant, tête de lit capitonnée et liseré doré. Disponible avec un sommier coffre — vaste rangement intégré, accessible d'un geste. Livraison et montage inclus.\n\nSimple : 2 600 DH · Avec coffre de rangement : 3 000 DH.",
    matiere: "MDF laqué · tissu",
    finition: "Laqué brillant",
    dimensions: "Couchage 160 × 200 cm",
    delai: "Livraison et montage inclus",
    badge: "Nouveau",
  },
  {
    slug: "lit-ifrane",
    name: "Lit Ifrane",
    category: "chambre",
    price: 1400,
    priceFrom: true,
    tagline: "90 × 200 cm — une place, chêne et noyer",
    description:
      "Un lit une place à tête de lit capitonnée, structure chêne rehaussée d'un cadre noyer. Disponible avec un sommier coffre — le rangement en plus, parfait pour une chambre d'enfant ou d'amis. Installation et livraison gratuites.\n\nSimple : 1 400 DH · Avec coffre de rangement : 1 800 DH.",
    matiere: "Chêne · noyer · tissu",
    finition: "Vernis mat",
    dimensions: "Couchage 90 × 200 cm",
    delai: "Installation et livraison gratuites",
    badge: "Nouveau",
  },
  {
    slug: "chevet-habous",
    name: "Chevet Habous (la paire)",
    category: "chambre",
    price: 3400,
    tagline: "Deux tiroirs, poignée laiton",
    description:
      "Vendus par deux. Deux tiroirs à fermeture douce, façade noyer et poignée en laiton bruni. Se glisse sous la plupart des têtes de lit.",
    matiere: "Noyer · laiton",
    finition: "Huile naturelle mate",
    dimensions: "50 × 40 × 45 (H) cm — l'unité",
    delai: "3 à 4 semaines",
  },
  {
    slug: "commode-riad",
    name: "Commode Riad",
    category: "chambre",
    price: 6800,
    tagline: "Quatre grands tiroirs",
    description:
      "Quatre tiroirs profonds sur coulisses à fermeture douce, piétement fuselé. Autant de rangement qu'une petite penderie, l'encombrement en moins.",
    matiere: "Panneau plaqué noyer · piétement massif",
    finition: "Huile naturelle mate",
    dimensions: "110 × 45 × 80 (H) cm",
    delai: "3 à 5 semaines",
  },
  {
    slug: "ensemble-ourika",
    name: "Ensemble Ourika — commode + 2 chevets",
    category: "chambre",
    price: 2200,
    tagline: "Commode 80 cm et deux chevets, chêne clair",
    description:
      "Un ensemble de chambre en chêne clair, lignes scandinaves et prises intégrées : une commode quatre tiroirs de 80 cm de large et deux chevets deux tiroirs assortis. Piétement fuselé. Installation et livraison incluses.",
    matiere: "Chêne clair",
    finition: "Vernis mat",
    dimensions: "Commode 80 cm de large · 2 chevets 40 × 40 cm · piétement fuselé",
    delai: "Installation et livraison incluses",
    badge: "Nouveau",
  },
  {
    slug: "dressing-mansour",
    name: "Dressing Mansour",
    category: "dressing",
    price: 18500,
    priceFrom: true,
    tagline: "Trois modules, façades verre fumé, éclairage intégré",
    description:
      "Composition de trois modules : penderie, étagères et tiroirs, façades en verre fumé sur cadre noyer, bandeaux LED. Configuré sur mesure à partir de vos dimensions.",
    matiere: "Noyer · verre fumé · LED",
    finition: "Huile naturelle mate",
    dimensions: "Sur mesure — base 300 × 60 × 240 (H) cm",
    delai: "6 à 9 semaines",
    badge: "Sur mesure",
  },
  {
    slug: "penderie-zellige",
    name: "Penderie Zellige",
    category: "dressing",
    price: 9200,
    tagline: "Deux portes, tringle et étagère haute",
    description:
      "Une penderie autonome, deux portes battantes, tringle pleine largeur et étagère haute. La solution simple quand la chambre n'a pas de placard.",
    matiere: "Panneau plaqué noyer",
    finition: "Huile naturelle mate",
    dimensions: "120 × 60 × 220 (H) cm",
    delai: "4 à 6 semaines",
  },
  {
    slug: "table-assilah",
    name: "Table Assilah",
    category: "salle-a-manger",
    price: 14500,
    tagline: "Plateau noyer massif, 8 personnes",
    description:
      "Un plateau d'une seule venue en noyer massif, piétement central en acier laqué. Reçoit huit convives, dix au serré.",
    matiere: "Noyer massif · acier laqué",
    finition: "Huile naturelle mate",
    dimensions: "240 × 100 × 75 (H) cm",
    delai: "5 à 7 semaines",
    badge: "Signature",
  },
  {
    slug: "chaise-medina",
    name: "Chaise Medina",
    category: "salle-a-manger",
    price: 1950,
    tagline: "Cuir pleine fleur cognac, piétement métal",
    description:
      "Assise et dossier en cuir pleine fleur teinté cognac, qui prend sa patine à l'usage. Piétement métal fin. Prix à l'unité.",
    matiere: "Cuir pleine fleur · métal",
    finition: "Cuir cognac · métal noir mat",
    dimensions: "46 × 54 × 82 (H) cm — l'unité",
    delai: "3 à 5 semaines",
  },
  {
    slug: "buffet-oualidia",
    name: "Buffet Oualidia",
    category: "salle-a-manger",
    price: 11800,
    tagline: "Trois portes, plateau pierre",
    description:
      "Trois portes sur aménagement mixte étagères / tiroirs, plateau en travertin adouci. Range le service, expose les belles pièces.",
    matiere: "Noyer · travertin",
    finition: "Huile naturelle mate · pierre non traitée",
    dimensions: "180 × 45 × 85 (H) cm",
    delai: "5 à 7 semaines",
  },
  {
    slug: "fauteuil-essaouira",
    name: "Fauteuil Essaouira",
    category: "salon",
    price: 4600,
    tagline: "Coque enveloppante, lin lavé",
    description:
      "Une coque basse et enveloppante, mousse haute résilience, housse en lin lavé. Le fauteuil où l'on reste plus longtemps que prévu.",
    matiere: "Lin lavé · hêtre",
    finition: "Lin naturel",
    dimensions: "78 × 82 × 71 (H) cm",
    delai: "4 à 6 semaines",
  },
  {
    slug: "table-basse-taghazout",
    name: "Table basse Taghazout",
    category: "salon",
    price: 5400,
    tagline: "Plateau travertin, socle noyer",
    description:
      "Un bloc de travertin non rebouché posé sur un socle bas en noyer. Massif, franc, il tient la pièce.",
    matiere: "Travertin · noyer",
    finition: "Pierre non traitée · huile mate",
    dimensions: "110 × 60 × 34 (H) cm",
    delai: "4 à 6 semaines",
  },
  {
    slug: "meuble-tv-corniche",
    name: "Meuble TV Corniche",
    category: "salon",
    price: 7900,
    tagline: "Deux tiroirs, passages de câbles",
    description:
      "Long, bas, deux tiroirs à fermeture douce et passages de câbles discrets. Pensé pour disparaître sous l'écran.",
    matiere: "Panneau plaqué noyer · piétement massif",
    finition: "Huile naturelle mate",
    dimensions: "180 × 40 × 45 (H) cm",
    delai: "3 à 5 semaines",
  },
  {
    slug: "coiffeuse-menara",
    name: "Coiffeuse Menara",
    category: "coiffeuse-decor",
    price: 3100,
    tagline: "Miroir LED nuage, plateau coffre vitré",
    description:
      "Une coiffeuse laquée blanc à miroir LED en forme de nuage, tactile et dimmable. Le plateau s'ouvre sur un coffre vitré compartimenté pour bijoux et maquillage, deux tiroirs et un chiffonnier latéral trois tiroirs. Tabouret assorti inclus. Livraison et montage inclus.",
    matiere: "Laqué blanc · verre trempé · miroir LED",
    finition: "Laqué mat",
    dimensions: "Plateau 120 × 40 cm · h. totale ≈ 140 cm · tabouret inclus",
    delai: "Livraison et montage inclus",
    badge: "Nouveau",
  },
  {
    slug: "coiffeuse-agdal",
    name: "Coiffeuse Agdal",
    category: "coiffeuse-decor",
    price: 3100,
    tagline: "Miroir LED galet, façades nervurées, piétement doré",
    description:
      "Une coiffeuse taupe aux façades nervurées et piétement métal doré, miroir LED en forme de galet à intensité réglable. Deux tiroirs sous plateau et un chiffonnier latéral à bandeaux lumineux. Tabouret assorti inclus. Livraison et montage inclus.",
    matiere: "Laqué taupe · métal doré · miroir LED",
    finition: "Laqué brillant",
    dimensions: "Plateau 120 × 40 cm · h. totale ≈ 140 cm · tabouret inclus",
    delai: "Livraison et montage inclus",
    badge: "Nouveau",
  },
  {
    slug: "coiffeuse-gueliz",
    name: "Coiffeuse Guéliz",
    category: "coiffeuse-decor",
    price: 3100,
    tagline: "Miroir LED rond, plateau verre, liseré doré",
    description:
      "Une coiffeuse laquée noir soulignée d'un liseré doré, plateau en verre trempé et miroir LED rond rétroéclairé. Deux tiroirs sous plateau et un chiffonnier latéral trois tiroirs. Tabouret capitonné inclus. Livraison et montage inclus.",
    matiere: "Laqué noir · verre trempé · liseré doré · miroir LED",
    finition: "Laqué brillant",
    dimensions: "Plateau 120 × 40 cm · h. totale ≈ 140 cm · tabouret inclus",
    delai: "Livraison et montage inclus",
    badge: "Nouveau",
  },
  {
    slug: "coiffeuse-majorelle",
    name: "Coiffeuse Majorelle",
    category: "coiffeuse-decor",
    price: 6200,
    tagline: "Miroir organique rétroéclairé, tiroir compartimenté",
    description:
      "Un plan noyer, un tiroir compartimenté et un miroir organique rétroéclairé en lumière chaude. Se pose aussi bien dans la chambre que dans un dressing.",
    matiere: "Noyer · miroir · LED",
    finition: "Huile naturelle mate",
    dimensions: "110 × 45 × 78 (H) cm",
    delai: "4 à 6 semaines",
  },
  {
    slug: "miroir-lune",
    name: "Miroir Lune",
    category: "coiffeuse-decor",
    price: 2100,
    tagline: "Forme organique, sans cadre",
    description:
      "Une forme libre, polie sur chant, sans cadre. Se pose à même le mur, seul ou en constellation.",
    matiere: "Verre miroir",
    finition: "Chant poli",
    dimensions: "60 × 90 cm",
    delai: "2 à 3 semaines",
  },
  {
    slug: "chevet-ourika",
    name: "Chevet Ourika",
    category: "coiffeuse-decor",
    price: 450,
    tagline: "Chêne clair, deux tiroirs, plateau 40 × 40 cm",
    description:
      "Un chevet compact en chêne clair, deux tiroirs à prise intégrée et piétement fuselé façon scandinave. Plateau carré 40 × 40 cm. Livraison incluse.",
    matiere: "Chêne clair",
    finition: "Vernis mat",
    dimensions: "Plateau 40 × 40 cm · h. ≈ 50 cm",
    delai: "Livraison incluse",
    badge: "Nouveau",
  },
];

export const productImage = (slug: string) => `/products/${slug}.webp`;

/** `image_url` may be a plain URL or a JSON array of URLs — normalise to a list. */
export function parseImages(raw: string | null | undefined): string[] {
  if (!raw) return [];
  const s = raw.trim();
  if (s.startsWith("[")) {
    try {
      const arr = JSON.parse(s);
      if (Array.isArray(arr)) {
        return arr.filter((u): u is string => typeof u === "string" && !!u.trim());
      }
    } catch {
      /* not valid JSON — treat as a plain URL below */
    }
  }
  return [s];
}
/** Encode a list of URLs back into the `image_url` column (plain string when
 *  there is only one, JSON array when there are several, null when empty). */
export function encodeImages(urls: string[]): string | null {
  const clean = urls.map((u) => u.trim()).filter(Boolean);
  if (clean.length === 0) return null;
  if (clean.length === 1) return clean[0];
  return JSON.stringify(clean);
}

/** Primary product image — DB override if present, else the bundled crop. */
export const imageFor = (p: Product) =>
  parseImages(p.image_url)[0] || `/products/${p.slug}.webp`;
/** Every photo for a product, primary first — falls back to the bundled crop. */
export const galleryFor = (p: Product): string[] => {
  const imgs = parseImages(p.image_url);
  return imgs.length ? imgs : [`/products/${p.slug}.webp`];
};
/** `matiere` is authored as a "·"-separated list, e.g. "Chêne clair · tissu" —
 *  split it for display as a composition list. */
export const materialsFor = (p: Product): string[] =>
  p.matiere.split("·").map((s) => s.trim()).filter(Boolean);

export function getCategory(key: string): Category | undefined {
  return CATEGORIES.find((c) => c.key === key);
}
export function categoryLabel(key: string): string {
  return getCategory(key)?.label ?? key;
}
export function productsByCategory(key: string): Product[] {
  return PRODUCTS.filter((p) => p.category === key);
}
export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
export function relatedProducts(p: Product, n = 3): Product[] {
  return PRODUCTS.filter(
    (x) => x.category === p.category && x.slug !== p.slug,
  ).slice(0, n);
}