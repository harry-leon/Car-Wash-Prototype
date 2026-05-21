import { CalendarPlus } from 'lucide-react';
import { BookingForm } from '../components/BookingForm';
import styles from '../styles/booking.module.css';

export function BookingPage() {
  return (
    <div className={`p-4 md:p-8 lg:p-10 ${styles.page}`}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary shadow-sm backdrop-blur-md">
          <CalendarPlus className="h-3.5 w-3.5" /> New Booking
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-6">Book a Wash</h1>
        <BookingForm />
      </div>
    </div>
  );
}
