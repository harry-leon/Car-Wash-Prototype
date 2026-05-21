import type { PointTransaction } from '../types/history.types';
import type { WashRecord } from '../types/history.types';

export const mockPointTransactions: PointTransaction[] = [
  {
    id: 'pt-001',
    customerId: 'cust-001',
    type: 'EARN',
    points: 450,
    description: 'Earned from Premium Full Detail booking BK-2026-006',
    bookingId: 'BK-2026-006',
    createdAt: '2026-05-02T10:30:00',
  },
  {
    id: 'pt-002',
    customerId: 'cust-001',
    type: 'REDEEM',
    points: -500,
    description: 'Redeemed 500 points for BK-2026-006',
    bookingId: 'BK-2026-006',
    createdAt: '2026-05-02T10:30:00',
  },
  {
    id: 'pt-003',
    customerId: 'cust-001',
    type: 'EARN',
    points: 250,
    description: 'Earned from Standard Detail booking BK-2026-002',
    bookingId: 'BK-2026-002',
    createdAt: '2026-05-18T11:30:00',
  },
  {
    id: 'pt-004',
    customerId: 'cust-001',
    type: 'REDEEM',
    points: -200,
    description: 'Redeemed 200 points for BK-2026-002',
    bookingId: 'BK-2026-002',
    createdAt: '2026-05-18T11:30:00',
  },
  {
    id: 'pt-005',
    customerId: 'cust-001',
    type: 'BONUS',
    points: 300,
    description: 'Gold tier monthly bonus reward',
    createdAt: '2026-05-01T00:00:00',
  },
  {
    id: 'pt-006',
    customerId: 'cust-001',
    type: 'REFUND',
    points: 120,
    description: 'Refund for cancelled booking BK-2026-003',
    bookingId: 'BK-2026-003',
    createdAt: '2026-05-12T15:00:00',
  },
  {
    id: 'pt-007',
    customerId: 'cust-001',
    type: 'ADJUSTMENT',
    points: -50,
    description: 'Admin correction — duplicate earn entry',
    createdAt: '2026-04-25T09:00:00',
  },
  {
    id: 'pt-008',
    customerId: 'cust-001',
    type: 'EARN',
    points: 180,
    description: 'Referral bonus — friend signed up',
    createdAt: '2026-04-20T14:00:00',
  },
];

export const mockWashRecords: WashRecord[] = [
  {
    bookingId: 'BK-2026-002',
    vehiclePlate: '51B-678.90',
    packageName: 'Standard Detail',
    completedAt: '2026-05-18T11:30:00',
    usedCombo: false,
  },
  {
    bookingId: 'BK-2026-006',
    vehiclePlate: '51A-123.45',
    packageName: 'Premium Full Detail',
    completedAt: '2026-05-02T10:30:00',
    usedCombo: true,
    comboName: 'Gold Premium Combo',
  },
];
