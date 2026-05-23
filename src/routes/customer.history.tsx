import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { History } from "lucide-react";
import { HistoryTabs } from "@/modules/customer-booking/components/HistoryTabs";
import { BookingHistoryPage } from "@/modules/customer-booking/pages/BookingHistoryPage";
import { PointTransactionsPage } from "@/modules/customer-booking/pages/PointTransactionsPage";
import { WashHistoryPage } from "@/modules/customer-booking/pages/WashHistoryPage";

export const Route = createFileRoute("/customer/history")({
  component: CustomerBookingsRoute,
});

function CustomerBookingsRoute() {
  const [activeTab, setActiveTab] = useState<"bookings" | "washes" | "points">("bookings");
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (pathname !== "/customer/history") {
    return <Outlet />;
  }

  return (
    <div className="p-4 md:p-8 lg:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary shadow-sm backdrop-blur-md">
          <History className="h-3.5 w-3.5" /> History
        </div>
        <h1 className="mb-6 text-2xl font-bold tracking-tight">Bookings</h1>
        <HistoryTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "bookings" && <BookingHistoryPage />}
        {activeTab === "washes" && <WashHistoryPage />}
        {activeTab === "points" && <PointTransactionsPage />}
      </div>
    </div>
  );
}
