import { Check, Clock, CheckCircle2, Car, XCircle } from "lucide-react";
import { useBookings, STATUS_STYLES, BookingStatus } from "@/lib/booking-store";
import { Card } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const STEPS: { key: BookingStatus; label: string; desc: string; Icon: any }[] = [
  { key: "Pending", label: "Pending", desc: "Awaiting approval", Icon: Clock },
  { key: "Confirmed", label: "Confirmed", desc: "Slot secured", Icon: CheckCircle2 },
  { key: "Checked-in", label: "Checked-in", desc: "Vehicle arrived", Icon: Car },
];

export function LiveTracker() {
  const { bookings, selectedBookingId, setSelectedBookingId } = useBookings();
  const booking = bookings.find((b) => b.id === selectedBookingId) ?? bookings[0];

  if (!booking) {
    return <Card className="p-12 text-center text-muted-foreground">No bookings to track.</Card>;
  }

  const activeIdx = STEPS.findIndex((s) => s.key === booking.status);
  const isCancelled = booking.status === "Cancelled";

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Now tracking</div>
            <div className="text-2xl font-bold mt-1">Booking #{booking.id}</div>
            <div className="text-sm text-muted-foreground">
              {booking.vehicleName} · {booking.vehiclePlate} · {booking.scheduledAt}
            </div>
          </div>
          <div className="min-w-[200px]">
            <Select value={booking.id} onValueChange={setSelectedBookingId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {bookings.map((b) => (
                  <SelectItem key={b.id} value={b.id}>#{b.id} · {b.vehiclePlate}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="p-8">
        {isCancelled ? (
          <div className="flex flex-col items-center text-center py-8 gap-3 animate-in fade-in zoom-in duration-500">
            <div className="h-16 w-16 rounded-full bg-rose-100 flex items-center justify-center">
              <XCircle className="h-8 w-8 text-rose-600" />
            </div>
            <div className="text-xl font-bold">Booking Cancelled</div>
            <div className="text-sm text-muted-foreground">This booking has been cancelled.</div>
            <span className={`mt-2 px-3 py-1 rounded-full text-xs font-medium border ${STATUS_STYLES.Cancelled}`}>
              Cancelled
            </span>
          </div>
        ) : (
          <>
            <div className="hidden md:flex items-start justify-between relative">
              <div className="absolute top-7 left-[8%] right-[8%] h-1 bg-muted rounded-full">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${(activeIdx / (STEPS.length - 1)) * 100}%` }}
                />
              </div>
              {STEPS.map((s, i) => {
                const done = i < activeIdx;
                const active = i === activeIdx;
                const Icon = s.Icon;
                return (
                  <div key={s.key} className="flex flex-col items-center text-center flex-1 relative z-10">
                    <div
                      className={`h-14 w-14 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${
                        done
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : active
                            ? "bg-primary border-primary text-primary-foreground scale-110 shadow-lg animate-in zoom-in"
                            : "bg-background border-muted text-muted-foreground"
                      }`}
                    >
                      {done ? <Check className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                    </div>
                    <div className={`mt-3 font-semibold ${active ? "text-primary" : ""}`}>{s.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{s.desc}</div>
                    {active && (
                      <span className={`mt-2 px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[s.key]} animate-pulse`}>
                        Current
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile vertical */}
            <div className="md:hidden space-y-4">
              {STEPS.map((s, i) => {
                const done = i < activeIdx;
                const active = i === activeIdx;
                const Icon = s.Icon;
                return (
                  <div key={s.key} className="flex gap-3">
                    <div className={`h-12 w-12 rounded-full border-4 flex items-center justify-center shrink-0 ${
                      done ? "bg-emerald-500 border-emerald-500 text-white"
                        : active ? "bg-primary border-primary text-primary-foreground"
                        : "bg-background border-muted text-muted-foreground"
                    }`}>
                      {done ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="font-semibold">{s.label}</div>
                      <div className="text-xs text-muted-foreground">{s.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Card>

      <Card className="p-6">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">Booking Details</h4>
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div><dt className="text-muted-foreground text-xs">Services</dt><dd className="font-medium mt-0.5">{booking.services.join(", ")}</dd></div>
          <div><dt className="text-muted-foreground text-xs">Scheduled</dt><dd className="font-medium mt-0.5">{booking.scheduledAt}</dd></div>
          <div><dt className="text-muted-foreground text-xs">Total</dt><dd className="font-medium mt-0.5">${booking.totalPrice}</dd></div>
          <div><dt className="text-muted-foreground text-xs">Status</dt>
            <dd className="mt-0.5">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[booking.status]}`}>
                {booking.status}
              </span>
            </dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
