export type TicketStatus =
  | 'open'
  | 'in_progress'
  | 'pending_customer'
  | 'resolved'
  | 'closed'

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'

export type SavTicket = {
  id: string
  createdAt: string
  updatedAt: string
  customer: string
  subject: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  channel: 'email' | 'chat' | 'phone' | 'web'
  assignee?: string
  slaDueAt: string
}

export type CreateSavTicketInput = Pick<
  SavTicket,
  'customer' | 'subject' | 'description' | 'priority' | 'channel'
>
