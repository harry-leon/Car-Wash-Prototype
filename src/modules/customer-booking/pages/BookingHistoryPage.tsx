import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookingTable } from '../components/BookingTable';
import { useCustomerBooking } from '../context/CustomerBookingContext';
import styles from '../styles/history.module.css';

export function BookingHistoryPage() {
  const { bookings } = useCustomerBooking();

  return (
    <Card className="overflow-hidden border-border/50 bg-card/60 shadow-xl backdrop-blur-xl">
      <CardHeader className="border-b border-border/50 bg-accent/20 py-4">
        <CardTitle className="text-base font-semibold">All Bookings</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <BookingTable bookings={bookings} />
      </CardContent>
    </Card>
  );
}
