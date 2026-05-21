import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TransactionTable } from '../components/TransactionTable';
import { mockPointTransactions } from '../mock/history.mock';

export function PointTransactionsPage() {
  return (
    <Card className="overflow-hidden border-border/50 bg-card/60 shadow-xl backdrop-blur-xl">
      <CardHeader className="border-b border-border/50 bg-accent/20 py-4">
        <CardTitle className="text-base font-semibold">Point Transactions</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <TransactionTable transactions={mockPointTransactions} />
      </CardContent>
    </Card>
  );
}
