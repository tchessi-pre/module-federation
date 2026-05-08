# Tribune CX Hub — Monorepo Micro‑Frontends (Rsbuild + Rspack + Module Federation)

Plateforme démo “CX Hub” (React 18 + TypeScript strict) structurée en micro‑frontends, avec un host (shell) et 3 remotes (Feedback, Analytics, AI Assistant).

## Stack

- Rsbuild (tooling) + Rspack (bundler, compatible Webpack)
- React 18 + TypeScript strict
- Module Federation via Rspack (piloté par Rsbuild)
- Tailwind CSS + composants UI (style shadcn)
- Zustand + TanStack Query

## Structure du repo

- `apps/host-shell` : shell / container (routing + layout)
- `apps/mfe-feedback` : MFE Feedback
- `apps/mfe-analytics` : MFE Analytics
- `apps/mfe-ai-assistant` : MFE AI Assistant

Les remotes exposent des modules federated consommés par le host via des imports du type `feedback/Routes`, `analytics/Routes`, et pour l’assistant `assistant/mount`.

## Prérequis

- Node.js (recommandé : une version LTS récente)
- pnpm (le repo est configuré en workspaces)

## Installation

À la racine :

```bash
pnpm install
```

## Lancer en dev (recommandé)

Le script `dev` démarre les 4 apps (host + 3 remotes) en parallèle.

```bash
pnpm dev
```

### Ports

- Host : http://localhost:5173/
- Feedback : http://localhost:5174/
- Analytics : http://localhost:5175/
- AI Assistant : http://localhost:5176/

Avec Rsbuild/Rspack, le dev server sert directement les bundles et le `remoteEntry.js` : plus besoin du contournement “build --watch + preview”.

## Routes utiles

Dans le host :

- http://localhost:5173/ (dashboard)
- http://localhost:5173/feedback/
- http://localhost:5173/analytics/
- http://localhost:5173/assistant/

Note : utilise le `/` final sur `/assistant/` (routing et basePath).

## Build (production)

Build de tout le workspace :

```bash
pnpm build
```

Build d’une app spécifique :

```bash
pnpm -C apps/host-shell build
pnpm -C apps/mfe-feedback build
pnpm -C apps/mfe-analytics build
pnpm -C apps/mfe-ai-assistant build
```

## Preview (production build)

Preview de tout le workspace en parallèle :

```bash
pnpm preview
```

Ou d’une app :

```bash
pnpm -C apps/host-shell preview
```

## Lint

```bash
pnpm lint
```

## Détails d’architecture (lecture “expert”)

### 1) Federation

Le host référence les remotes via leurs `remoteEntry.js` servis par les dev servers Rsbuild :

- `feedback` → `http://localhost:5174/remoteEntry.js`
- `analytics` → `http://localhost:5175/remoteEntry.js`
- `assistant` → `http://localhost:5176/remoteEntry.js`

Les remotes exposent typiquement `./Routes` (React Router). Pour que les styles du MFE soient bien chargés quand il est consommé en remote, l’import CSS est placé dans le module exposé (pas seulement dans `main.tsx`).

### 2) AI Assistant : montage isolé via `mount()`

L’assistant est intégré dans le host via une API `mount/unmount` (au lieu d’un simple composant React importé) afin d’éviter les problèmes de “multi‑instance React / invalid hook call” dans certains scénarios de partage de dépendances.

En pratique :

- le remote expose `assistant/mount`
- le host crée un conteneur DOM et appelle `mount(container, { basename: '/assistant' })`

### 3) Types TypeScript des remotes

Les modules federated ne sont pas connus de TypeScript par défaut.  
Le host déclare les modules dans `apps/host-shell/src/remotes.d.ts` (ex : `declare module 'assistant/mount' { ... }`).

## Dépannage

### Port déjà utilisé

Si un port 5173–5176 est déjà pris, Rsbuild échoue (config `strictPort: true`).  
Ferme les anciens processus (ou redémarre ton terminal), puis relance `pnpm dev`.

### Sous Windows : cache navigateur / service worker

Si tu vois des comportements “bizarres” (chargements partiels, 404 inattendues), fais un hard refresh (Ctrl+F5).  
Si tu as déjà activé un service worker/PWA, pense à le désenregistrer.

### “Cannot find module 'assistant/mount'” dans l’IDE

Si le build passe mais l’IDE continue d’afficher l’erreur, redémarre le serveur TypeScript :

- “TypeScript: Restart TS Server”
- ou “Developer: Reload Window”
