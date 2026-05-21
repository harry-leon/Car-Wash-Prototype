import type { MembershipTier } from './customer.types';

export type BookingStatus =
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export interface Promotion {
  id: string;
  name: string;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
  applicableTiers: MembershipTier[] | 'ALL' | 'NEW_CUSTOMER';
  validUntil: string;
}

export interface BookingFormState {
  vehicleId: string;
  packageId: string;
  scheduledDate: string;
  scheduledTime: string;
  promotionId?: string;
  useCombo: boolean;
  redeemPoints: number;
}

export interface Booking {
  id: string;
  customerId: string;
  vehicleId: string;
  vehiclePlate: string;
  packageId: string;
  packageName: string;
  packagePrice: number;
  scheduledAt: string;
  status: BookingStatus;
  promotionId?: string;
  promotionName?: string;
  promotionDiscount: number;
  redeemPoints: number;
  pointsDiscount: number;
  usedComboId?: string;
  usedComboName?: string;
  finalAmount: number;
  createdAt: string;
}
