# Brancher Supabase — 4 étapes

Le site **fonctionne déjà sans Supabase** : il retombe automatiquement sur le
catalogue embarqué (`lib/products.ts`). Dès que les clés sont présentes, il lit
la base à la place.

---

## 1. Créer le projet

Dashboard Supabase → **New project**

| Champ | Valeur |
|---|---|
| Name | `btl-living` |
| Database Password | *Generate a password* → **copiez-la et gardez-la** |
| Region | **West EU (Ireland)** |
| Plan | Free |

→ **Create new project**, patientez ~2 min.

## 2. Créer les tables

Sidebar → **SQL Editor** → **New query** → collez tout le contenu de
[`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) → **Run**.

Crée : `categories`, `products`, `orders`, `order_items`, `testimonials`,
`newsletter_subscribers` + les politiques RLS (lecture publique du catalogue,
insertion publique des commandes / inscriptions, rien d'autre).

## 3. Récupérer les clés

Sidebar (en bas) → **Project Settings** → **API** :

| Dans Supabase | À coller dans `.env.local` |
|---|---|
| **Project URL** | `NEXT_PUBLIC_SUPABASE_URL` |
| **Project API keys → `anon` `public`** | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| **`service_role` `secret`** (cliquer *Reveal*) | `SUPABASE_SERVICE_ROLE_KEY` |

> ⚠️ La clé `service_role` contourne toutes les règles RLS. Elle reste
> **serveur uniquement** — jamais de préfixe `NEXT_PUBLIC_`, jamais commitée
> (`.env*.local` est dans `.gitignore`).

## 4. Remplir le catalogue

```bash
npm run seed
```

Injecte les 5 catégories et les 13 produits. Idempotent — relançable sans
créer de doublons. Les 3 témoignages d'exemple sont insérés **non publiés**
(`published = false`) : remplacez le texte par de vrais avis, puis passez
`published` à `true` pour qu'ils apparaissent.

---

## Ce qui passe par la base

| Table | Rôle | Écrit par |
|---|---|---|
| `categories` / `products` | Le catalogue. Modifiez prix, textes, `in_stock` directement dans le Table Editor. | vous (dashboard) |
| `orders` / `order_items` | Chaque commande validée au checkout, avec une réf. `BTL-XXXXXXXX`. Le message WhatsApp part quand même. | `POST /api/order` |
| `testimonials` | Section « Ils ont meublé chez eux ». Seules les lignes `published = true` s'affichent. | vous (dashboard) |
| `newsletter_subscribers` | Formulaire e-mail du footer. | `POST /api/newsletter` |

Les pages catalogue sont en **ISR `revalidate = 3600`** : une modification dans
Supabase apparaît en ligne dans l'heure (ou au prochain déploiement).

### Images produit

`products.image_url` est vide par défaut → le site utilise
`/products/<slug>.webp`. Pour passer aux vraies photos, uploadez-les dans
**Supabase Storage** et collez l'URL publique dans `image_url`.

## Vérifier

```bash
npm run build && npm run dev
```

- Catalogue vide ou clés absentes → le site affiche le catalogue de secours.
- `Table Editor → orders` se remplit après un checkout de test.