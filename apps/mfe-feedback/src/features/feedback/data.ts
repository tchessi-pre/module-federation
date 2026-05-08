import type { CreateFeedbackInput, FeedbackItem } from '@/features/feedback/types'

export const feedbackKey = ['feedback', 'list'] as const

const mockDb: FeedbackItem[] = [
  {
    id: 'fb_001',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    customer: 'Acme Retail',
    message:
      "J'ai trouvé la base de connaissances rapidement, mais la recherche pourrait mieux tolérer les fautes.",
    sentiment: 'neutral',
  },
  {
    id: 'fb_002',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    customer: 'Bright Telecom',
    message: 'Super expérience, réponse instantanée et contenu très pertinent.',
    sentiment: 'positive',
  },
  {
    id: 'fb_003',
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    customer: 'Nova Airlines',
    message: "Je n'ai pas trouvé la procédure de remboursement, trop de clics.",
    sentiment: 'negative',
  },
]

export async function mockListFeedback(): Promise<FeedbackItem[]> {
  await new Promise((r) => setTimeout(r, 250))
  return [...mockDb].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function mockCreateFeedback(input: CreateFeedbackInput): Promise<FeedbackItem> {
  await new Promise((r) => setTimeout(r, 400))
  const item: FeedbackItem = {
    id: `fb_${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString(),
    ...input,
  }
  mockDb.unshift(item)
  return item
}
