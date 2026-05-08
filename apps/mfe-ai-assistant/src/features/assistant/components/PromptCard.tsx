import type * as React from 'react'

import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'

export default function PromptCard({
  input,
  status,
  onChangeInput,
  onSubmit,
}: {
  input: string
  status: string
  onChangeInput: (event: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-3">
        <CardTitle>Prompt</CardTitle>
        <div className="text-sm text-foreground/60">{status}</div>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-3" onSubmit={onSubmit}>
          <Input
            value={input}
            onChange={onChangeInput}
            placeholder="Ex: Comment tu garantis l'autonomie des MFEs ?"
          />
          <div className="flex items-center justify-end gap-2">
            <Button type="submit" disabled={status === 'streaming' || input.trim().length === 0}>
              Envoyer
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
