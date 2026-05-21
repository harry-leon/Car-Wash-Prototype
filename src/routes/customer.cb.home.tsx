import { createFileRoute } from "@tanstack/react-router";
import { CustomerHomePage } from "@/modules/customer-booking/pages/CustomerHomePage";

export const Route = createFileRoute("/customer/cb/home")({
  component: () => <CustomerHomePage />,
});
