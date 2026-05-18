import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CustomerBookingForm } from "@/components/customer-booking-form";

export const Route = createFileRoute("/bookings/new")({
  component: NewBookingPage,
});

function NewBookingPage() {
  const navigate = useNavigate();

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Create booking</h1>
          <p className="text-sm text-muted-foreground">
            Booking uses the active customer profile, vehicle data and shop slot validation.
          </p>
        </div>
        <CustomerBookingForm onBooked={() => navigate({ to: "/bookings" })} />
      </div>
    </div>
  );
}

