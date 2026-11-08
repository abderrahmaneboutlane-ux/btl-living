# BTL LIVING

Site vitrine — maison marocaine de mobilier. Next.js (App Router) · TypeScript ·
Tailwind · React Three Fiber · GSAP + Lenis.

## Lancer

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build && npm run start   # production
```

## Structure

```
app/
  layout.tsx      métadonnées SEO + JSON-LD (FurnitureStore), polices, smooth scroll
  page.tsx        assemble la page + numéro WhatsApp
  robots.ts       /robots.txt
  sitemap.ts      /sitemap.xml
  icon.svg        favicon (monogramme B)
  globals.css     tokens + utilitaires (.eyebrow, .rule, .grain)
components/
  Hero.tsx        hero plein écran (image + calque shader)
  HeroCanvas.tsx  WebGL : zoom lent, parallaxe souris, push au scroll
  Header.tsx      nav transparente → opaque au scroll, menu mobile
  Finishes3D.tsx  showcase 3D des finitions (sphères matières, HDRI Lightformer)
  Sections.tsx    Univers · Manifeste · Finitions · Savoir-faire · Témoignages · Contact · Footer
  SmoothScroll.tsx  Lenis piloté par le ticker GSAP
lib/
  useReveal.ts    reveals au scroll (gsap.from — dégrade proprement sans JS)
scripts/
  optimize-hero.mjs  pipeline image (upscale 4K + grade + og crop)
public/
  showroom.jpg    master 3840×2142 (fond hero + crops univers)
  showroom.webp   master 3840×2142 (calque shader du hero, ~0,5 Mo)
  og.jpg          1200×630 (Open Graph / partages sociaux)
```

## Remplacer l'image du hero

```bash
npm run optimize:hero -- "C:\chemin\vers\nouveau-rendu.jpg"
```

Régénère `showroom.jpg` / `showroom.webp` (upscalés en 3840 px, contraste +
netteté) et `og.jpg`. ⚠︎ L'upscale ne crée pas de détail : pour une vraie 4K,
fournir un rendu source haute résolution.

## Configuré

- **Domaine** : `https://btl-living.com` (`.env.local` + fallback dans le code).
- **WhatsApp / téléphone** : `+212708029551` (flottant, hero, contact, footer, JSON-LD).
- **E-mail** : `contact@btl-living.com` — ⚙︎ créer la boîte (Namecheap Private Email
  ou une redirection) avant mise en ligne.

## Reste à compléter (repérés `⚙︎`)

| Où | Quoi |
|----|------|
| `app/layout.tsx` | JSON-LD : `address` (rue / ville), `sameAs` (profils sociaux) |
| `components/Sections.tsx` | handle Instagram (footer), délais de livraison, témoignages réels |
| Boîte mail | activer `contact@btl-living.com` |

## SEO en place

- Métadonnées complètes : `metadataBase`, canonical, Open Graph + Twitter, `robots`.
- `robots.txt` et `sitemap.xml` générés (`app/robots.ts`, `app/sitemap.ts`).
- Données structurées JSON-LD `FurnitureStore` (nom, description, zones desservies, devise MAD).
- HTML sémantique : un seul `<h1>`, sections en `<h2>`, `<header>/<nav>/<footer>`.
- `alt` descriptifs sur les images de contenu ; images décoratives en `alt=""` + `aria-hidden`.
- `lang="fr"`, `prefers-reduced-motion` respecté (animations et smooth scroll désactivés).