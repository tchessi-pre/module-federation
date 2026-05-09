import * as React from 'react'

import { Button } from '@cxhub/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@cxhub/shared/ui/card'

import { Field, TextArea, TextInput } from '../form'
import type { CreateSavTicketInput, TicketPriority } from '../../types'

export function NewTicketCard({
  isPending,
  errorMessage,
  onCreate,
}: {
  isPending: boolean
  errorMessage: string | null
  onCreate: (input: CreateSavTicketInput) => Promise<void>
}) {
  const [customer, setCustomer] = React.useState('')
  const [subject, setSubject] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [priority, setPriority] = React.useState<TicketPriority>('medium')
  const [channel, setChannel] = React.useState<CreateSavTicketInput['channel']>('web')

  const canCreate =
    customer.trim().length >= 2 &&
    subject.trim().length >= 5 &&
    description.trim().length >= 10 &&
    !isPending

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nouveau ticket</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Field label="Client">
          <TextInput
            value={customer}
            onChange={(e) => setCustomer(e.currentTarget.value)}
            placeholder="Acme Retail"
          />
        </Field>
        <Field label="Sujet">
          <TextInput
            value={subject}
            onChange={(e) => setSubject(e.currentTarget.value)}
            placeholder="Ex: Retour produit / échange / remboursement…"
          />
        </Field>
        <Field label="Description">
          <TextArea
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
            placeholder="Décris le problème et le contexte…"
          />
        </Field>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Priorité">
            <select
              className="h-10 w-full rounded-md border border-border bg-card px-2 text-sm"
              value={priority}
              onChange={(e) => setPriority(e.currentTarget.value as TicketPriority)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </Field>
          <Field label="Canal">
            <select
              className="h-10 w-full rounded-md border border-border bg-card px-2 text-sm"
              value={channel}
              onChange={(e) => setChannel(e.currentTarget.value as CreateSavTicketInput['channel'])}
            >
              <option value="web">Web</option>
              <option value="email">Email</option>
              <option value="chat">Chat</option>
              <option value="phone">Téléphone</option>
            </select>
          </Field>
        </div>
        <div className="flex items-center justify-end gap-2 pt-1">
          <Button
            variant="ghost"
            onClick={() => {
              setCustomer('')
              setSubject('')
              setDescription('')
              setPriority('medium')
              setChannel('web')
            }}
            disabled={isPending}
          >
            Reset
          </Button>
          <Button
            onClick={async () => {
              const input: CreateSavTicketInput = {
                customer: customer.trim(),
                subject: subject.trim(),
                description: description.trim(),
                priority,
                channel,
              }
              await onCreate(input)
              setCustomer('')
              setSubject('')
              setDescription('')
              setPriority('medium')
              setChannel('web')
            }}
            disabled={!canCreate}
          >
            Créer
          </Button>
        </div>
        {errorMessage ? <div className="text-sm text-danger">{errorMessage}</div> : null}
      </CardContent>
    </Card>
  )
}
