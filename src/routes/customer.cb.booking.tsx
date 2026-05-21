import { createFileRoute } from "@tanstack/react-router";
import { BookingPage } from "@/modules/customer-booking/pages/BookingPage";

export const Route = createFileRoute("/customer/cb/booking")({
  component: () => <BookingPage />,
});
