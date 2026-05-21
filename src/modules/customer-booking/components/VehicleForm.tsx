import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import type { Vehicle, VehicleType } from '../types/vehicle.types';
import { brandModelMap } from '../mock/vehicles.mock';
import styles from '../styles/vehicles.module.css';

interface VehicleFormProps {
  initial?: Vehicle;
  ownerId: string;
  onSubmit: (vehicle: Vehicle) => void;
  onCancel: () => void;
}

export function VehicleForm({ initial, ownerId, onSubmit, onCancel }: VehicleFormProps) {
  const [brand, setBrand] = useState(initial?.brand ?? '');
  const [model, setModel] = useState(initial?.model ?? '');
  const [vehicleType, setVehicleType] = useState<VehicleType | ''>(initial?.vehicleType ?? '');
  const [plate, setPlate] = useState(initial?.licensePlate ?? '');
  const [color, setColor] = useState(initial?.color ?? '');
  const [isDefault, setIsDefault] = useState(initial?.isDefault ?? false);

  const brands = useMemo(() => Object.keys(brandModelMap), []);
  const models = useMemo(
    () => (brand ? brandModelMap[brand] ?? [] : []),
    [brand],
  );

  useEffect(() => {
    if (brand && model) {
      const found = models.find((m) => m.model === model);
      setVehicleType(found?.vehicleType ?? '');
    }
  }, [brand, model, models]);

  const handleBrandChange = (value: string) => {
    setBrand(value);
    setModel('');
    setVehicleType('');
  };

  const handleModelChange = (value: string) => {
    setModel(value);
    const found = models.find((m) => m.model === value);
    setVehicleType(found?.vehicleType ?? '');
  };

  const isValid = brand && model && vehicleType && plate.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || (vehicleType as string) === '') return;

    const vehicle: Vehicle = {
      id: initial?.id ?? `v-${Date.now()}`,
      licensePlate: plate.toUpperCase().trim(),
      brand,
      model,
      vehicleType,
      color: color.trim() || undefined,
      isDefault,
      ownerId,
    };

    onSubmit(vehicle);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.formGrid}>
        <div className={styles.formField}>
          <label htmlFor="vf-brand">Brand</label>
          <select id="vf-brand" value={brand} onChange={(e) => handleBrandChange(e.target.value)} required>
            <option value="">Select brand…</option>
            {brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div className={styles.formField}>
          <label htmlFor="vf-model">Model</label>
          <select
            id="vf-model"
            value={model}
            onChange={(e) => handleModelChange(e.target.value)}
            disabled={!brand}
            required
          >
            <option value="">Select model…</option>
            {models.map((m) => (
              <option key={m.model} value={m.model}>{m.model}</option>
            ))}
          </select>
        </div>

        <div className={styles.formField}>
          <label htmlFor="vf-type">Vehicle Type</label>
          <input id="vf-type" type="text" value={vehicleType} readOnly placeholder="Auto-filled" />
        </div>

        <div className={styles.formField}>
          <label htmlFor="vf-plate">License Plate</label>
          <input
            id="vf-plate"
            type="text"
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
            placeholder="e.g. 51A-123.45"
            required
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor="vf-color">Color (optional)</label>
          <input
            id="vf-color"
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="e.g. Black"
          />
        </div>

        <div className={styles.checkboxRow}>
          <input
            id="vf-default"
            type="checkbox"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
          />
          <label htmlFor="vf-default">Set as default vehicle</label>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={!isValid}>
            {initial ? 'Save Changes' : 'Add Vehicle'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
