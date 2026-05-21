import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { PointTransaction, TransactionType } from '../types/history.types';
import styles from '../styles/history.module.css';

interface TransactionTableProps {
  transactions: PointTransaction[];
}

const TYPE_CLASS: Record<TransactionType, string> = {
  EARN: styles.typeEARN,
  REDEEM: styles.typeREDEEM,
  REFUND: styles.typeREFUND,
  BONUS: styles.typeBONUS,
  ADJUSTMENT: styles.typeADJUSTMENT,
};

const POSITIVE_TYPES: TransactionType[] = ['EARN', 'REFUND', 'BONUS'];

export function TransactionTable({ transactions }: TransactionTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Points</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((tx) => {
          const isPositive = POSITIVE_TYPES.includes(tx.type);
          return (
            <TableRow key={tx.id}>
              <TableCell className="text-xs text-muted-foreground">
                {new Date(tx.createdAt).toLocaleDateString('en-GB')}{' '}
                {new Date(tx.createdAt).toLocaleTimeString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={`font-semibold text-xs ${TYPE_CLASS[tx.type]}`}
                >
                  {tx.type}
                </Badge>
              </TableCell>
              <TableCell
                className={`text-right font-mono ${isPositive ? styles.pointsPositive : styles.pointsNegative}`}
              >
                {isPositive ? '+' : ''}{tx.points}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                {tx.description}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
