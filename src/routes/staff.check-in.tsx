import { createFileRoute } from "@tanstack/react-router";
import { StaffDashboard } from "@/components/staff-dashboard";

export const Route = createFileRoute("/staff/check-in")({
  component: StaffCheckInPage,
});

function StaffCheckInPage() {
  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Staff check-in</h1>
          <p className="text-sm text-muted-foreground">
            Check in confirmed bookings or register walk-ins before wash session processing.
          </p>
        </div>
        <StaffDashboard />
      </div>
    </div>
  );
}

