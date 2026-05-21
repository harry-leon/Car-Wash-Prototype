import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Customer, ActiveCombo, ServicePackage, ComboPackage } from '../types/customer.types';
import type { Vehicle } from '../types/vehicle.types';
import type { Booking } from '../types/booking.types';
import { mockCustomer, mockActiveCombo, mockServicePackages, mockComboPackages } from '../mock/customer.mock';
import { mockVehicles } from '../mock/vehicles.mock';
import { mockBookings } from '../mock/booking.mock';

interface CustomerBookingContextValue {
  customer: Customer;
  setCustomer: React.Dispatch<React.SetStateAction<Customer>>;
  activeCombo: ActiveCombo | null;
  servicePackages: ServicePackage[];
  comboPackages: ComboPackage[];
  vehicles: Vehicle[];
  addVehicle: (vehicle: Vehicle) => void;
  updateVehicle: (vehicle: Vehicle) => void;
  deleteVehicle: (id: string) => void;
  setDefaultVehicle: (id: string) => void;
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
}

const CustomerBookingContext = createContext<CustomerBookingContextValue | null>(null);

export function CustomerBookingProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer>({ ...mockCustomer });
  const [activeCombo] = useState<ActiveCombo | null>({ ...mockActiveCombo });
  const [vehicles, setVehicles] = useState<Vehicle[]>([...mockVehicles]);
  const [bookings, setBookings] = useState<Booking[]>([...mockBookings]);

  const addVehicle = useCallback((vehicle: Vehicle) => {
    setVehicles((prev) => {
      if (vehicle.isDefault) {
        return [...prev.map((v) => ({ ...v, isDefault: false })), vehicle];
      }
      return [...prev, vehicle];
    });
  }, []);

  const updateVehicle = useCallback((vehicle: Vehicle) => {
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === vehicle.id) return vehicle;
        if (vehicle.isDefault && v.isDefault) return { ...v, isDefault: false };
        return v;
      }),
    );
  }, []);

  const deleteVehicle = useCallback((id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  }, []);

  const setDefaultVehicle = useCallback((id: string) => {
    setVehicles((prev) =>
      prev.map((v) => ({
        ...v,
        isDefault: v.id === id,
      })),
    );
  }, []);

  const addBooking = useCallback((booking: Booking) => {
    setBookings((prev) => [booking, ...prev]);
  }, []);

  const value: CustomerBookingContextValue = {
    customer,
    setCustomer,
    activeCombo,
    servicePackages: mockServicePackages,
    comboPackages: mockComboPackages,
    vehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    setDefaultVehicle,
    bookings,
    addBooking,
  };

  return (
    <CustomerBookingContext.Provider value={value}>
      {children}
    </CustomerBookingContext.Provider>
  );
}

export function useCustomerBooking(): CustomerBookingContextValue {
  const ctx = useContext(CustomerBookingContext);
  if (!ctx) {
    throw new Error('useCustomerBooking must be used within CustomerBookingProvider');
  }
  return ctx;
}
