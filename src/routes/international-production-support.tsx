import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/international-production-support')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/international-production-support"!</div>
}
