import type { Vehicle, BrandModelMap } from '../types/vehicle.types';

export const mockVehicles: Vehicle[] = [
  {
    id: 'v-001',
    licensePlate: '51A-123.45',
    brand: 'Toyota',
    model: 'Camry',
    vehicleType: 'SEDAN',
    color: 'Black',
    isDefault: true,
    ownerId: 'cust-001',
  },
  {
    id: 'v-002',
    licensePlate: '51B-678.90',
    brand: 'Honda',
    model: 'CR-V',
    vehicleType: 'SUV',
    color: 'White',
    isDefault: false,
    ownerId: 'cust-001',
  },
  {
    id: 'v-003',
    licensePlate: '51C-246.80',
    brand: 'Mazda',
    model: 'Mazda3',
    vehicleType: 'HATCHBACK',
    isDefault: false,
    ownerId: 'cust-001',
  },
];

export const brandModelMap: BrandModelMap = {
  Toyota: [
    { model: 'Camry', vehicleType: 'SEDAN' },
    { model: 'Corolla', vehicleType: 'SEDAN' },
    { model: 'RAV4', vehicleType: 'SUV' },
    { model: 'Hilux', vehicleType: 'PICKUP' },
    { model: 'Yaris', vehicleType: 'HATCHBACK' },
  ],
  Honda: [
    { model: 'Civic', vehicleType: 'SEDAN' },
    { model: 'CR-V', vehicleType: 'SUV' },
    { model: 'HR-V', vehicleType: 'SUV' },
    { model: 'Jazz', vehicleType: 'HATCHBACK' },
  ],
  Ford: [
    { model: 'Ranger', vehicleType: 'PICKUP' },
    { model: 'Everest', vehicleType: 'SUV' },
    { model: 'Focus', vehicleType: 'SEDAN' },
    { model: 'EcoSport', vehicleType: 'SUV' },
  ],
  Mazda: [
    { model: 'Mazda3', vehicleType: 'HATCHBACK' },
    { model: 'Mazda6', vehicleType: 'SEDAN' },
    { model: 'CX-5', vehicleType: 'SUV' },
    { model: 'CX-8', vehicleType: 'SUV' },
    { model: 'BT-50', vehicleType: 'PICKUP' },
  ],
};
