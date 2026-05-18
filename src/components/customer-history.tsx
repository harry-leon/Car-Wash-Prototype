import { useState } from "react";
import { Car, Clock, Eye, X } from "lucide-react";
import { Booking, STATUS_STYLES, fmtBookingMoney, useBookings } from "@/lib/booking-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export function CustomerHistory({ onTrack }: { onTrack: () => void }) {
  const { bookings, updateStatus, setSelectedBookingId } = useBookings();
  const [cancelId, setCancelId] = useState<string | null>(null);

  const upcoming = bookings.filter((b) => b.status !== "Cancelled" && b.status !== "Checked-in");
  const past = bookings.filter((b) => b.status === "Cancelled" || b.status === "Checked-in");

  const renderCard = (b: Booking) => {
    const cancellable = b.status === "Pending" || b.status === "Confirmed";
    return (
      <Card key={b.id} className="p-5 transition-all hover:shadow-md">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
              <Car className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-base">#{b.id}</span>
                <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[b.status]}`}>
                  {b.status}
                </span>
              </div>
              <div className="mt-1 text-sm">
                {b.vehicleName} / {b.vehiclePlate}
              </div>
              <div className="text-sm text-muted-foreground">{b.services.join(", ")}</div>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" /> {b.scheduledAt}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="mr-3 text-right">
              <div className="text-xs text-muted-foreground">Total</div>
              <div className="font-bold">{fmtBookingMoney(b.totalPrice)}</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedBookingId(b.id);
                onTrack();
              }}
            >
              <Eye className="mr-1 h-4 w-4" /> Track
            </Button>
            {cancellable && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCancelId(b.id)}
                className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
              >
                <X className="mr-1 h-4 w-4" /> Cancel
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Upcoming ({upcoming.length})
        </h3>
        <div className="space-y-3">
          {upcoming.length === 0 && <p className="text-sm text-muted-foreground">No upcoming bookings.</p>}
          {upcoming.map(renderCard)}
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Past ({past.length})
        </h3>
        <div className="space-y-3">
          {past.length === 0 && <p className="text-sm text-muted-foreground">No past bookings.</p>}
          {past.map(renderCard)}
        </div>
      </div>

      <AlertDialog open={!!cancelId} onOpenChange={(open) => !open && setCancelId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently cancel booking #{cancelId}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 hover:bg-rose-700"
              onClick={() => {
                if (!cancelId) {
                  return;
                }

                try {
                  updateStatus(cancelId, "Cancelled");
                  toast.success(`Booking ${cancelId} cancelled`);
                } catch (error) {
                  toast.error(error instanceof Error ? error.message : "Unable to cancel booking.");
                } finally {
                  setCancelId(null);
                }
              }}
            >
              Yes, Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
