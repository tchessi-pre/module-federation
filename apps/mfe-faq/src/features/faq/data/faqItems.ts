export type FaqItem = {
  id: string
  question: string
  answer: string
  tags: string[]
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'mfe',
    question: 'C’est quoi un micro-frontend (MFE) ?',
    answer:
      "Un micro-frontend est une partie de l’UI livrée comme une application indépendante, puis intégrée dans le shell via Module Federation. Ça permet de découpler les équipes et les déploiements.",
    tags: ['architecture', 'module-federation'],
  },
  {
    id: 'remoteentry',
    question: 'À quoi sert remoteEntry.js ?',
    answer:
      "C’est le manifeste exposé par le remote. Le host le charge pour découvrir et télécharger les modules exposés (ex: ./Routes).",
    tags: ['module-federation', 'runtime'],
  },
  {
    id: 'dev',
    question: 'Comment lancer le projet en local ?',
    answer:
      "Depuis la racine : pnpm dev. Le shell est sur http://localhost:5173 et chaque MFE écoute sur son port dédié.",
    tags: ['local', 'dev'],
  },
  {
    id: 'shared',
    question: 'Pourquoi partager react / react-dom en singleton ?',
    answer:
      "Pour éviter d’avoir plusieurs copies de React chargées en même temps. En singleton, le host et les remotes réutilisent la même instance.",
    tags: ['react', 'module-federation'],
  },
]
