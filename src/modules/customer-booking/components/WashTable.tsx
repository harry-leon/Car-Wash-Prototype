import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { WashRecord } from '../types/history.types';

interface WashTableProps {
  records: WashRecord[];
}

export function WashTable({ records }: WashTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Vehicle</TableHead>
          <TableHead>Package</TableHead>
          <TableHead>Used Combo</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((r) => (
          <TableRow key={r.bookingId}>
            <TableCell className="text-xs text-muted-foreground">
              {new Date(r.completedAt).toLocaleDateString('en-GB')}{' '}
              {new Date(r.completedAt).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </TableCell>
            <TableCell className="font-mono text-xs">{r.vehiclePlate}</TableCell>
            <TableCell>{r.packageName}</TableCell>
            <TableCell>
              {r.usedCombo ? (
                <span className="text-sm font-semibold text-amber-600">{r.comboName}</span>
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
