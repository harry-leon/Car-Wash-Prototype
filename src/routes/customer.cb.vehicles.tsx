import { createFileRoute, useSearch } from "@tanstack/react-router";
import { VehiclesPage } from "@/modules/customer-booking/pages/VehiclesPage";
import { VehicleFormPage } from "@/modules/customer-booking/pages/VehicleFormPage";

type VehicleSearch = { editId?: string };

export const Route = createFileRoute("/customer/cb/vehicles")({
  validateSearch: (search: Record<string, unknown>): VehicleSearch => ({
    editId: typeof search.editId === "string" ? search.editId : undefined,
  }),
  component: VehiclesRoute,
});

function VehiclesRoute() {
  const { editId } = Route.useSearch();

  if (editId) {
    return <VehicleFormPage vehicleId={editId} />;
  }

  return <VehiclesPage />;
}
