import { Document } from '@langchain/core/documents'

type StoredEmbedding = {
  key: string
  vector: number[]
}

function fnv1a(str: string) {
  let hash = 2166136261
  for (let i = 0; i < str.length; i += 1) {
    hash ^= str.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0).toString(16)
}

function openEmbeddingsDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('tribune-cx-hub', 1)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains('embeddings')) {
        db.createObjectStore('embeddings', { keyPath: 'key' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('IndexedDB error'))
  })
}

async function idbGet(key: string): Promise<number[] | null> {
  const db = await openEmbeddingsDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('embeddings', 'readonly')
    const store = tx.objectStore('embeddings')
    const req = store.get(key)
    req.onsuccess = () => {
      const value = req.result as StoredEmbedding | undefined
      resolve(value?.vector ?? null)
    }
    req.onerror = () => reject(req.error ?? new Error('IndexedDB get error'))
  })
}

async function idbSet(key: string, vector: number[]) {
  const db = await openEmbeddingsDb()
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction('embeddings', 'readwrite')
    const store = tx.objectStore('embeddings')
    store.put({ key, vector } satisfies StoredEmbedding)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error ?? new Error('IndexedDB set error'))
  })
}

let extractorPromise: Promise<(text: string) => Promise<number[]>> | null = null

async function getExtractor(): Promise<(text: string) => Promise<number[]>> {
  if (extractorPromise) return extractorPromise
  extractorPromise = (async () => {
    const { pipeline } = await import('@xenova/transformers')
    const pipe = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
    return async (text: string) => {
      const output = (await pipe(text, {
        pooling: 'mean',
        normalize: true,
      })) as unknown as { data?: Float32Array | number[] }
      const data = output.data
      if (!data) throw new Error('Embedding output missing data')
      return Array.from(data)
    }
  })()
  return extractorPromise
}

function fallbackEmbed(text: string) {
  const dim = 128
  const vec = new Array<number>(dim).fill(0)
  const tokens = text
    .toLowerCase()
    .replace(/[^a-z0-9àâçéèêëîïôûùüÿñæœ\s-]/gi, ' ')
    .split(/\s+/)
    .filter(Boolean)

  for (const t of tokens) {
    const h = parseInt(fnv1a(t), 16)
    const idx = h % dim
    vec[idx] = (vec[idx] ?? 0) + 1
  }

  const norm = Math.sqrt(vec.reduce((acc, v) => acc + v * v, 0)) || 1
  return vec.map((v) => v / norm)
}

async function embedWithCache(key: string, text: string) {
  const cached = await idbGet(key)
  if (cached) return cached

  try {
    const extractor = await getExtractor()
    const vector = await extractor(text)
    await idbSet(key, vector)
    return vector
  } catch {
    const vector = fallbackEmbed(text)
    await idbSet(key, vector)
    return vector
  }
}

function cosineSimilarity(a: number[], b: number[]) {
  const len = Math.min(a.length, b.length)
  let dot = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < len; i += 1) {
    const av = a[i] ?? 0
    const bv = b[i] ?? 0
    dot += av * bv
    normA += av * av
    normB += bv * bv
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB)
  if (!denom) return 0
  return dot / denom
}

export type RetrievedDoc = {
  doc: Document
  score: number
}

export function getKnowledgeBase() {
  const docs = [
    new Document({
      pageContent:
        'Smart Tribune est un acteur CX orienté knowledge management, feedback et selfcare. Une bonne démo produit doit montrer une navigation fluide, des KPIs et une expérience IA contextualisée.',
      metadata: { id: 'kb_001', title: 'Contexte Smart Tribune' },
    }),
    new Document({
      pageContent:
        "Module Federation (Vite) permet de charger des micro-frontends à la demande via des remoteEntry indépendants. Les dépendances critiques comme React doivent être partagées en singleton pour éviter des doubles runtimes.",
      metadata: { id: 'kb_002', title: 'Micro-frontends & federation' },
    }),
    new Document({
      pageContent:
        "Un mini-RAG côté navigateur peut: 1) transformer des documents en embeddings, 2) stocker les vecteurs dans IndexedDB, 3) calculer une similarité cosine pour récupérer les passages pertinents, 4) générer une réponse en citant les sources.",
      metadata: { id: 'kb_003', title: 'RAG local' },
    }),
    new Document({
      pageContent:
        'Core Web Vitals: LCP, CLS et INP. Une interface IA doit être progressive (streaming), accessible (focus/ARIA) et performante (lazy loading, cache).',
      metadata: { id: 'kb_004', title: 'Performance & a11y' },
    }),
  ]
  return docs
}

export async function retrieve(query: string, k = 3): Promise<RetrievedDoc[]> {
  const docs = getKnowledgeBase()
  const queryKey = `q:${fnv1a(query)}`
  const qVec = await embedWithCache(queryKey, query)

  const scored = await Promise.all(
    docs.map(async (doc) => {
      const id = String(doc.metadata?.id ?? fnv1a(doc.pageContent))
      const key = `d:${id}:${fnv1a(doc.pageContent)}`
      const dVec = await embedWithCache(key, doc.pageContent)
      return { doc, score: cosineSimilarity(qVec, dVec) }
    }),
  )

  return scored.sort((a, b) => b.score - a.score).slice(0, k)
}
