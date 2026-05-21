import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Booking, BookingStatus } from '../types/booking.types';
import styles from '../styles/history.module.css';

interface BookingTableProps {
  bookings: Booking[];
}

const STATUS_CLASS: Record<BookingStatus, string> = {
  CONFIRMED: styles.statusCONFIRMED,
  CHECKED_IN: styles.statusCHECKED_IN,
  IN_PROGRESS: styles.statusIN_PROGRESS,
  COMPLETED: styles.statusCOMPLETED,
  CANCELLED: styles.statusCANCELLED,
  NO_SHOW: styles.statusNO_SHOW,
};

export function BookingTable({ bookings }: BookingTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Vehicle</TableHead>
          <TableHead>Package</TableHead>
          <TableHead>Scheduled</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((b) => (
          <TableRow key={b.id}>
            <TableCell className="font-semibold text-xs">{b.id}</TableCell>
            <TableCell className="font-mono text-xs">{b.vehiclePlate}</TableCell>
            <TableCell>{b.packageName}</TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {new Date(b.scheduledAt).toLocaleDateString('en-GB')}{' '}
              {new Date(b.scheduledAt).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </TableCell>
            <TableCell className="text-right">
              <Badge
                variant="outline"
                className={`border font-semibold text-xs ${STATUS_CLASS[b.status]}`}
              >
                {b.status.replace('_', ' ')}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
