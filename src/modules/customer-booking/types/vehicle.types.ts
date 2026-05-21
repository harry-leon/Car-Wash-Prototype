export type VehicleType = 'SEDAN' | 'SUV' | 'HATCHBACK' | 'PICKUP' | 'VAN' | 'MOTORCYCLE';

export interface Vehicle {
  id: string;
  licensePlate: string;
  brand: string;
  model: string;
  vehicleType: VehicleType;
  color?: string;
  isDefault: boolean;
  ownerId: string;
}

export interface BrandModelMap {
  [brand: string]: Array<{
    model: string;
    vehicleType: VehicleType;
  }>;
}
