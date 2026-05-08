import { Link } from 'react-router-dom'

import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'

export default function NotFoundPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Page introuvable</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-foreground/70">
        Retour au <Link className="text-primary underline" to="/">dashboard</Link>.
      </CardContent>
    </Card>
  )
}
