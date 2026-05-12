import { useMemo, useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'

import { Card } from '@cxhub/shared/ui/card'
import { Input } from '@cxhub/shared/ui/input'
import { cn } from '@cxhub/shared/utils'
import { FAQ_ITEMS } from './data/faqItems'

function normalize(text: string) {
  return text.toLowerCase().normalize('NFD').replaceAll(/\p{Diacritic}/gu, '')
}

export default function FaqPage() {
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null)

  const filtered = useMemo(() => {
    const q = normalize(query.trim())
    if (!q) return FAQ_ITEMS
    return FAQ_ITEMS.filter((item) => {
      const haystack = normalize([item.question, item.answer, item.tags.join(' ')].join(' '))
      return haystack.includes(q)
    })
  }, [query])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">FAQ</h1>
        <p className="text-sm text-foreground/70">
          Recherche une question, puis ouvre une réponse.
        </p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher…"
          className="pl-9"
        />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="p-4">
            <div className="text-sm text-foreground/70">Aucun résultat.</div>
          </Card>
        ) : (
          filtered.map((item) => {
            const isOpen = openId === item.id
            return (
              <Card key={item.id} className="p-4">
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-3 text-left"
                  onClick={() => setOpenId((prev) => (prev === item.id ? null : item.id))}
                >
                  <div className="space-y-2">
                    <div className="font-medium">{item.question}</div>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-muted px-2 py-0.5 text-xs text-foreground/70"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ChevronDown
                    className={cn(
                      'mt-0.5 h-4 w-4 shrink-0 text-foreground/60 transition-transform',
                      isOpen && 'rotate-180',
                    )}
                  />
                </button>

                {isOpen ? (
                  <div className="mt-3 text-sm leading-6 text-foreground/80">{item.answer}</div>
                ) : null}
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
