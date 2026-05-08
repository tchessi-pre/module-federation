export type FeedbackSentiment = 'positive' | 'neutral' | 'negative'

export type FeedbackItem = {
  id: string
  createdAt: string
  customer: string
  message: string
  sentiment: FeedbackSentiment
}

export type CreateFeedbackInput = Pick<FeedbackItem, 'customer' | 'message' | 'sentiment'>
