import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/work')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/work"!</div>
}
