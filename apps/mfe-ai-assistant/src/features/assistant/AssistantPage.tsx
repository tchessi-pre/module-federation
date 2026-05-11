import * as React from 'react'
import { useChat } from '@ai-sdk/react'

import { StatusCard } from '@cxhub/shared/common/status-card'
import { useAssistantStore } from '@/shared/state/assistantStore'

import { createLocalRagFetch } from '@/features/assistant/api/localRagFetch'
import AssistantHeader from '@/features/assistant/components/AssistantHeader'
import ConversationCard from '@/features/assistant/components/ConversationCard'
import PromptCard from '@/features/assistant/components/PromptCard'

export default function AssistantPage() {
  const topK = useAssistantStore((s) => s.topK)
  const setTopK = useAssistantStore((s) => s.setTopK)
  const showScores = useAssistantStore((s) => s.showScores)
  const toggleScores = useAssistantStore((s) => s.toggleScores)

  const fetch = React.useMemo(() => createLocalRagFetch(() => topK), [topK])

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    stop,
    error,
    setMessages,
  } = useChat({
    streamProtocol: 'text',
    fetch,
  })

  return (
    <div className="space-y-4">
      <AssistantHeader
        topK={topK}
        setTopK={setTopK}
        showScores={showScores}
        toggleScores={toggleScores}
        status={status}
        onStop={() => stop()}
        onReset={() => setMessages([])}
      />

      {error ? (
        <StatusCard title="Erreur" tone="danger" description={error.message} />
      ) : null}

      <ConversationCard
        messages={messages.map((m) => ({
          id: m.id,
          role: m.role,
          content: String(m.content ?? ''),
        }))}
      />

      <PromptCard
        input={input}
        status={status}
        onChangeInput={handleInputChange}
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit(e)
        }}
      />
    </div>
  )
}
