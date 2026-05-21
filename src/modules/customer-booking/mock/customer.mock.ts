import type { Customer, ActiveCombo, ServicePackage, ComboPackage } from '../types/customer.types';

export const mockCustomer: Customer = {
  id: 'cust-001',
  name: 'Nguyen Van An',
  email: 'an.nguyen@example.com',
  phone: '0901234567',
  tier: 'GOLD',
  availablePoints: 1250,
  lifetimePoints: 4800,
};

export const mockActiveCombo: ActiveCombo = {
  id: 'combo-act-001',
  comboName: 'Gold Premium Combo',
  status: 'ACTIVE',
  remainingUses: 3,
  totalUses: 10,
  expiresAt: '2026-06-04T23:59:59',
  validUntil: '2026-06-04',
  linkedVehiclePlate: '51A-123.45',
  comboCode: 'COMBO-2024-GLD-001',
};

export const mockServicePackages: ServicePackage[] = [
  {
    id: 'pkg-basic',
    name: 'Basic Wash',
    description: 'Exterior hand wash, tire cleaning, and quick dry. Perfect for routine maintenance.',
    price: 120000,
    durationMinutes: 30,
  },
  {
    id: 'pkg-standard',
    name: 'Standard Detail',
    description: 'Full exterior wash, interior vacuum, dashboard wipe, and glass polish.',
    price: 250000,
    durationMinutes: 60,
  },
  {
    id: 'pkg-premium',
    name: 'Premium Full Detail',
    description: 'Complete interior & exterior detail, clay bar treatment, wax coat, leather conditioning, and engine bay cleaning.',
    price: 450000,
    durationMinutes: 120,
  },
  {
    id: 'pkg-ceramic',
    name: 'Ceramic Coating',
    description: 'Professional-grade ceramic coating application with 6-month hydrophobic protection and UV shield.',
    price: 1200000,
    durationMinutes: 180,
  },
];

export const mockComboPackages: ComboPackage[] = [
  {
    id: 'combo-basic-10',
    name: 'Basic Wash x10',
    price: 1000000,
    totalUses: 10,
    validDays: 90,
    applicableServiceIds: ['pkg-basic'],
  },
  {
    id: 'combo-standard-5',
    name: 'Standard Detail x5',
    price: 1100000,
    totalUses: 5,
    validDays: 60,
    applicableServiceIds: ['pkg-basic', 'pkg-standard'],
  },
];
