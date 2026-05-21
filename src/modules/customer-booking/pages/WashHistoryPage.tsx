import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WashTable } from '../components/WashTable';
import { mockWashRecords } from '../mock/history.mock';

export function WashHistoryPage() {
  return (
    <Card className="overflow-hidden border-border/50 bg-card/60 shadow-xl backdrop-blur-xl">
      <CardHeader className="border-b border-border/50 bg-accent/20 py-4">
        <CardTitle className="text-base font-semibold">Completed Washes</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <WashTable records={mockWashRecords} />
      </CardContent>
    </Card>
  );
}
