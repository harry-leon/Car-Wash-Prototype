import { useCarwashStore, BookingStatus, VehicleType, formatMoney } from "@/lib/carwash-store";

export type { BookingStatus };

export interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  plate: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  icon: string;
}

export interface Booking {
  id: string;
  vehiclePlate: string;
  vehicleName: string;
  vehicleType: string;
  services: string[];
  totalPrice: number;
  scheduledAt: string;
  dateISO: string;
  status: BookingStatus;
  isWalkIn?: boolean;
}

export function useBookings() {
  const store = useCarwashStore();
  return {
    bookings: store.bookings.map((booking) => ({
      id: booking.id,
      vehiclePlate: booking.vehiclePlate,
      vehicleName: booking.vehicleName,
      vehicleType: booking.vehicleType,
      services: booking.services,
      totalPrice: booking.totalPrice,
      scheduledAt: booking.scheduledAt,
      dateISO: booking.dateISO,
      status: booking.status,
      isWalkIn: booking.isWalkIn,
    })),
    addBooking: store.createBookingFromLegacy,
    updateStatus: store.updateBookingStatus,
    selectedBookingId: store.selectedBookingId,
    setSelectedBookingId: store.setSelectedBookingId,
  };
}

export function useCurrentVehicles(): Vehicle[] {
  const store = useCarwashStore();
  return (store.vehiclesByCustomer[store.currentCustomerId] ?? []).map((vehicle) => ({
    id: vehicle.id,
    name: vehicle.brandModel,
    type: vehicle.type,
    plate: vehicle.plate,
  }));
}

export function useAvailableServices(): Service[] {
  const store = useCarwashStore();
  return store.services;
}

export const STATUS_STYLES: Record<BookingStatus, string> = {
  Pending: "bg-slate-100 text-slate-700 border-slate-200",
  Confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  "Checked-in": "bg-emerald-100 text-emerald-700 border-emerald-200",
  Completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Cancelled: "bg-rose-100 text-rose-700 border-rose-200",
  "No-show": "bg-amber-100 text-amber-700 border-amber-200",
};

export function fmtBookingMoney(value: number) {
  return formatMoney(value);
}
