import type { CreateSavTicketInput, SavTicket, TicketStatus } from './types'

export const savTicketsKey = ['sav', 'tickets'] as const

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function addHours(date: Date, hours: number) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000)
}

function generateId() {
  return `sav_${Math.random().toString(16).slice(2)}`
}

const mockDb: { tickets: SavTicket[] } = {
  tickets: [
    {
      id: 'sav_1001',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
      customer: 'Acme Retail',
      subject: 'Produit reçu endommagé',
      description:
        'Le colis est arrivé avec un choc sur le côté droit. Photo disponible. Demande d’échange.',
      status: 'open',
      priority: 'high',
      channel: 'email',
      assignee: 'Sofia',
      slaDueAt: addHours(new Date(), 10).toISOString(),
    },
    {
      id: 'sav_1002',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      customer: 'Nova Telecom',
      subject: 'Demande de remboursement',
      description:
        'Le client souhaite un remboursement suite à une erreur de commande. Vérifier les conditions.',
      status: 'pending_customer',
      priority: 'medium',
      channel: 'web',
      assignee: 'Yanis',
      slaDueAt: addHours(new Date(), 4).toISOString(),
    },
    {
      id: 'sav_1003',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
      customer: 'Zen Travel',
      subject: 'Garantie : panne au déballage',
      description:
        'L’appareil ne s’allume pas. Le client a essayé plusieurs chargeurs. Demande de prise en charge.',
      status: 'in_progress',
      priority: 'urgent',
      channel: 'phone',
      assignee: 'Mehdi',
      slaDueAt: addHours(new Date(), -2).toISOString(),
    },
    {
      id: 'sav_1004',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      customer: 'Beta Market',
      subject: 'Échange validé',
      description:
        'Retour reçu et contrôlé. Échange validé. En attente de préparation expédition.',
      status: 'resolved',
      priority: 'low',
      channel: 'chat',
      assignee: 'Sofia',
      slaDueAt: addHours(new Date(), 24).toISOString(),
    },
  ],
}

export async function mockListSavTickets() {
  await sleep(250)
  return [...mockDb.tickets].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export async function mockCreateSavTicket(input: CreateSavTicketInput) {
  await sleep(200)
  const now = new Date()
  const ticket: SavTicket = {
    id: generateId(),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    customer: input.customer,
    subject: input.subject,
    description: input.description,
    status: 'open',
    priority: input.priority,
    channel: input.channel,
    slaDueAt: addHours(now, input.priority === 'urgent' ? 6 : input.priority === 'high' ? 12 : 24)
      .toISOString(),
  }
  mockDb.tickets.unshift(ticket)
  return ticket
}

export async function mockSetSavTicketStatus(input: { id: string; status: TicketStatus }) {
  await sleep(150)
  const idx = mockDb.tickets.findIndex((t) => t.id === input.id)
  if (idx === -1) throw new Error('Ticket introuvable')
  const current = mockDb.tickets[idx]
  if (!current) throw new Error('Ticket introuvable')
  const now = new Date().toISOString()
  const updated: SavTicket = { ...current, status: input.status, updatedAt: now }
  mockDb.tickets[idx] = updated
  return updated
}
