import { useNavigate } from '@tanstack/react-router';
import { VehicleForm } from '../components/VehicleForm';
import { useCustomerBooking } from '../context/CustomerBookingContext';
import type { Vehicle } from '../types/vehicle.types';
import styles from '../styles/vehicles.module.css';

interface VehicleFormPageProps {
  vehicleId?: string;
}

export function VehicleFormPage({ vehicleId }: VehicleFormPageProps) {
  const navigate = useNavigate();
  const { customer, vehicles, addVehicle, updateVehicle } = useCustomerBooking();

  const isEdit = !!vehicleId && vehicleId !== 'new';
  const existing = isEdit ? vehicles.find((v) => v.id === vehicleId) : undefined;

  const handleSubmit = (vehicle: Vehicle) => {
    if (isEdit) {
      updateVehicle(vehicle);
    } else {
      addVehicle(vehicle);
    }
    navigate({ to: '/customer/vehicles' });
  };

  const handleCancel = () => {
    navigate({ to: '/customer/vehicles' });
  };

  return (
    <div className={`p-4 md:p-8 lg:p-10 ${styles.page}`}>
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold tracking-tight mb-6">
          {isEdit ? 'Edit Vehicle' : 'Add New Vehicle'}
        </h1>
        <VehicleForm
          initial={existing}
          ownerId={customer.id}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
