export type TransactionType = 'EARN' | 'REDEEM' | 'REFUND' | 'BONUS' | 'ADJUSTMENT';

export interface PointTransaction {
  id: string;
  customerId: string;
  type: TransactionType;
  points: number;
  description: string;
  bookingId?: string;
  createdAt: string;
}

export interface WashRecord {
  bookingId: string;
  vehiclePlate: string;
  packageName: string;
  completedAt: string;
  usedCombo: boolean;
  comboName?: string;
}
