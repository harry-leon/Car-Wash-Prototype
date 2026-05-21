import { useNavigate } from '@tanstack/react-router';
import { Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VehicleCard } from '../components/VehicleCard';
import { useCustomerBooking } from '../context/CustomerBookingContext';
import styles from '../styles/vehicles.module.css';

export function VehiclesPage() {
  const navigate = useNavigate();
  const { vehicles, deleteVehicle } = useCustomerBooking();

  const handleEdit = (id: string) => {
    navigate({ to: '/customer/vehicles', search: { editId: id } });
  };

  const handleDelete = (id: string) => {
    deleteVehicle(id);
  };

  return (
    <div className={`p-4 md:p-8 lg:p-10 ${styles.page}`}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary shadow-sm backdrop-blur-md">
          <Car className="h-3.5 w-3.5" /> My Vehicles
        </div>

        <div className={styles.headerRow}>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Vehicles</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your registered vehicles
            </p>
          </div>
          <Button onClick={() => navigate({ to: '/customer/vehicles', search: { editId: 'new' } })}>
            + Add Vehicle
          </Button>
        </div>

        <div className={styles.vehicleGrid}>
          {vehicles.map((v) => (
            <VehicleCard
              key={v.id}
              vehicle={v}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {vehicles.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-semibold">No vehicles yet</p>
            <p className="text-sm mt-1">Add your first vehicle to start booking washes.</p>
          </div>
        )}
      </div>
    </div>
  );
}
