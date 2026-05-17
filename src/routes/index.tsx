import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Car, Truck, Bike, CarFront, Check, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  GUEST,
  SERVICES,
  Service,
  fmtMoney,
  useWashStore,
} from "@/lib/wash-store";
import { toast } from "sonner";
import { PageHeader, TierBadge } from "@/components/shared";

export const Route = createFileRoute("/")({
  component: WashLoggerPage,
});

const VEHICLES = [
  { id: "Sedan", label: "Sedan", icon: Car },
  { id: "SUV", label: "SUV", icon: CarFront },
  { id: "Truck", label: "Truck", icon: Truck },
  { id: "Motorbike", label: "Motorbike", icon: Bike },
];

function WashLoggerPage() {
  const { customers, setDraft, draft } = useWashStore();
  const navigate = useNavigate();

  const [customerId, setCustomerId] = React.useState<string>(draft?.customer.id ?? "guest");
  const [vehicleType, setVehicleType] = React.useState<string>(draft?.vehicleType ?? "Sedan");
  const [plate, setPlate] = React.useState<string>(draft?.plate ?? "");
  const [selectedIds, setSelectedIds] = React.useState<string[]>(
    draft?.services.map((s) => s.id) ?? [],
  );

  const allCustomers = React.useMemo(() => [GUEST, ...customers], [customers]);
  const customer = allCustomers.find((c) => c.id === customerId) ?? GUEST;

  const selectedServices: Service[] = SERVICES.filter((s) => selectedIds.includes(s.id));
  const subtotal = selectedServices.reduce((sum, s) => sum + s.price, 0);

  const toggleService = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  const canProceed = plate.trim().length >= 4 && selectedServices.length > 0;

  const handleProceed = () => {
    if (!canProceed) {
      toast.error("Please enter a license plate and select at least one service.");
      return;
    }
    setDraft({
      customer,
      vehicleType,
      plate: plate.trim().toUpperCase(),
      services: selectedServices,
    });
    navigate({ to: "/checkout" });
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <PageHeader
        step="Step 1 of 3"
        title="New Wash Session"
        subtitle="Log a vehicle, pick services, and head to checkout."
      />

      <div className="grid gap-6 lg:grid-cols-3 mt-8">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Customer">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="mb-1.5 block">Select customer</Label>
                <Select value={customerId} onValueChange={setCustomerId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {allCustomers.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        <span className="flex items-center gap-2">
                          <User className="h-3.5 w-3.5" />
                          {c.name}
                          {c.tier !== "Guest" && (
                            <span className="text-xs text-muted-foreground">· {c.tier}</span>
                          )}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-lg border border-border bg-accent/30 p-3 text-sm">
                <div className="text-muted-foreground text-xs">Selected</div>
                <div className="font-medium mt-1">{customer.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <TierBadge tier={customer.tier} />
                  {customer.tier !== "Guest" && (
                    <span className="text-xs text-muted-foreground">
                      {customer.points} pts · {customer.discountPct}% off
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card title="Vehicle">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {VEHICLES.map((v) => {
                const active = vehicleType === v.id;
                const Icon = v.icon;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVehicleType(v.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border p-4 transition-all",
                      active
                        ? "border-primary bg-primary/5 ring-2 ring-primary/30 shadow-sm"
                        : "border-border hover:border-primary/40 hover:bg-accent/40",
                    )}
                  >
                    <Icon className={cn("h-7 w-7", active ? "text-primary" : "text-muted-foreground")} />
                    <span className="text-sm font-medium">{v.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-5">
              <Label htmlFor="plate" className="mb-1.5 block">
                License plate
              </Label>
              <Input
                id="plate"
                placeholder="e.g. 79A-12345"
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                className="font-mono uppercase tracking-wider"
              />
            </div>
          </Card>

          <Card title="Services">
            <div className="grid sm:grid-cols-2 gap-3">
              {SERVICES.map((s) => {
                const active = selectedIds.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleService(s.id)}
                    className={cn(
                      "flex items-center justify-between rounded-lg border p-4 text-left transition-all",
                      active
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/40 hover:bg-accent/40",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "h-5 w-5 rounded-md border flex items-center justify-center transition-colors",
                          active ? "border-primary bg-primary text-primary-foreground" : "border-border",
                        )}
                      >
                        {active && <Check className="h-3.5 w-3.5" />}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{s.name}</div>
                        <div className="text-xs text-muted-foreground">Add-on service</div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold">{fmtMoney(s.price)}</div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-6 rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Summary</div>
            <div className="mt-3 space-y-2">
              <Row label="Customer" value={customer.name} />
              <Row label="Vehicle" value={vehicleType} />
              <Row label="Plate" value={plate ? plate.toUpperCase() : "—"} />
              <Row label="Services" value={String(selectedServices.length)} />
            </div>
            <div className="mt-4 border-t border-border pt-4 space-y-1.5">
              {selectedServices.length === 0 && (
                <div className="text-xs text-muted-foreground">No services selected yet.</div>
              )}
              {selectedServices.map((s) => (
                <div key={s.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{s.name}</span>
                  <span>{fmtMoney(s.price)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-border pt-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Initial total</span>
              <span className="text-2xl font-semibold tracking-tight">{fmtMoney(subtotal)}</span>
            </div>
            <Button
              className="w-full mt-5"
              size="lg"
              onClick={handleProceed}
              disabled={!canProceed}
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="text-sm font-semibold tracking-tight mb-4">{title}</h3>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}