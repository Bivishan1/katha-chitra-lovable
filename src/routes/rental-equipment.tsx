import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/rental-equipment')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/rental-equipment"!</div>
}
