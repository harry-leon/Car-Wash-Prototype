export type MembershipTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: MembershipTier;
  availablePoints: number;
  lifetimePoints: number;
}

export interface ActiveCombo {
  id: string;
  comboName: string;
  status: 'ACTIVE' | 'EXPIRED' | 'EXHAUSTED';
  remainingUses: number;
  totalUses: number;
  expiresAt: string;
  validUntil: string;
  linkedVehiclePlate: string;
  comboCode: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
}

export interface ComboPackage {
  id: string;
  name: string;
  price: number;
  totalUses: number;
  validDays: number;
  applicableServiceIds: string[];
}
