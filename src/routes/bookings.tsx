import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CustomerHistory } from "@/components/customer-history";

export const Route = createFileRoute("/bookings")({
  component: BookingListPage,
});

function BookingListPage() {
  const navigate = useNavigate();

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Customer bookings</h1>
          <p className="text-sm text-muted-foreground">
            Review current bookings, cancel valid ones and jump to the live tracker.
          </p>
        </div>
        <CustomerHistory onTrack={() => navigate({ to: "/bookings/tracker" })} />
      </div>
    </div>
  );
}

