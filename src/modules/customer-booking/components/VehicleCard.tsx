import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Vehicle } from '../types/vehicle.types';
import styles from '../styles/vehicles.module.css';

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function VehicleCard({ vehicle, onEdit, onDelete }: VehicleCardProps) {
  return (
    <div
      className={`${styles.vehicleCard} ${vehicle.isDefault ? styles.vehicleCardDefault : ''}`}
    >
      <div className="flex items-start justify-between">
        <span className={styles.vehiclePlate}>{vehicle.licensePlate}</span>
        {vehicle.isDefault && (
          <Badge variant="outline" className="border-primary/40 text-primary font-semibold text-xs">
            Default
          </Badge>
        )}
      </div>
      <div className={styles.vehicleInfo}>
        <span>
          {vehicle.brand} {vehicle.model}
        </span>
        <span className="text-xs text-muted-foreground">{vehicle.vehicleType}</span>
        {vehicle.color && (
          <span className="text-xs text-muted-foreground">Color: {vehicle.color}</span>
        )}
      </div>
      <div className={styles.vehicleActions}>
        <Button size="sm" variant="outline" onClick={() => onEdit(vehicle.id)}>
          Edit
        </Button>
        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => onDelete(vehicle.id)}>
          Delete
        </Button>
      </div>
    </div>
  );
}
