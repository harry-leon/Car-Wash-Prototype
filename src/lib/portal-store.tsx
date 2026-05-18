import { useCarwashStore, Vehicle, VehicleType, Tier } from "@/lib/carwash-store";

export type { Vehicle, VehicleType, Tier };

export interface Profile {
  name: string;
  phone: string;
  countryCode: string;
  tier: Tier;
  points: number;
}

export function nextTierInfo(points: number, tier: Tier) {
  const { tiers } = useCarwashStore();
  const sorted = [...tiers].sort((a, b) => a.minPoints - b.minPoints);
  const currentIndex = sorted.findIndex((rule) => rule.name === tier);
  const next = sorted[currentIndex + 1];
  if (!next) {
    return { next: null as Tier | null, needed: 0, current: points, target: points, pct: 100 };
  }
  const base = sorted[currentIndex]?.minPoints ?? 0;
  return {
    next: next.name,
    needed: Math.max(0, next.minPoints - points),
    current: points,
    target: next.minPoints,
    pct: Math.min(100, Math.round(((points - base) / (next.minPoints - base)) * 100)),
  };
}

export function usePortal() {
  const store = useCarwashStore();
  const customer = store.customers.find((item) => item.id === store.currentCustomerId);

  return {
    profile: customer
      ? {
          name: customer.name,
          phone: customer.phone,
          countryCode: customer.countryCode,
          tier: customer.tier,
          points: customer.points,
        }
      : null,
    vehicles: store.vehiclesByCustomer[store.currentCustomerId] ?? [],
    pending: store.pendingRegistration,
    setPending: store.setPendingRegistration,
    completeRegistration: store.completeRegistration,
    updateProfile: store.updateCurrentProfile,
    addVehicle: store.addVehicle,
    updateVehicle: store.updateVehicle,
    deleteVehicle: store.deleteVehicle,
  };
}

export const VEHICLE_TYPES: VehicleType[] = ["Sedan", "SUV", "Truck", "Motorbike"];
