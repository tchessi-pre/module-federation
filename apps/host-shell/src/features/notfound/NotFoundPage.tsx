import { Link } from 'react-router-dom'

import { StatusCard } from '@cxhub/shared/ui/card'

export default function NotFoundPage() {
  return (
    <StatusCard
      title="Page introuvable"
      description={
        <>
          Retour au <Link className="text-primary underline" to="/">dashboard</Link>.
        </>
      }
    />
  )
}
