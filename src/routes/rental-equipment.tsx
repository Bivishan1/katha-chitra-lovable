import { createFileRoute } from '@tanstack/react-router'
import RentalEquipmentPage from '@/pages/Rental-equipment'

export const Route = createFileRoute('/rental-equipment')({
  component: RentalEquipmentPage,
})

