import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, CheckCircle2, Clock3, ClipboardList, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/modules/public-auth/components/LanguageSwitcher";
import { BookingStatusBadge } from "../components/BookingStatusBadge";
import { OperationsFilters } from "../components/OperationsFilters";
import { OperationsTable } from "../components/OperationsTable";
import {
  filterOperationBookings,
  getOperationHourOptionsByLocale,
  useOperationBookings,
  useOperationStaffOptions,
} from "../mock/operations.mock";
import type { OperationFilters } from "../types/operations.types";
import styles from "../styles/operations-board.module.css";

const defaultFilters: OperationFilters = {
  status: "ALL",
  time: "ALL",
  hour: "ALL",
  staffId: "ALL",
};

const PAGE_SIZE = 5;

export function OperationsBoardPage() {
  const bookings = useOperationBookings();
  const staffOptions = useOperationStaffOptions();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const [filters, setFilters] = React.useState<OperationFilters>(defaultFilters);
  const [page, setPage] = React.useState(1);
  const locale = lang === "vi" ? "vi-VN" : "en-US";

  React.useEffect(() => {
    setPage(1);
  }, [filters]);

  const visibleBookings = React.useMemo(
    () => filterOperationBookings(bookings, filters),
    [bookings, filters],
  );

  const metrics = React.useMemo(
    () => ({
      total: bookings.length,
      confirmed: bookings.filter((booking) => booking.status === "CONFIRMED").length,
      checkedIn: bookings.filter((booking) => booking.status === "CHECKED_IN").length,
      inProgress: bookings.filter((booking) => booking.status === "IN_PROGRESS").length,
      completed: bookings.filter((booking) => booking.status === "COMPLETED").length,
    }),
    [bookings],
  );

  const hourOptions = React.useMemo(
    () => getOperationHourOptionsByLocale(bookings, locale),
    [bookings, locale],
  );
  const totalPages = Math.max(1, Math.ceil(visibleBookings.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedBookings = React.useMemo(
    () => visibleBookings.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [safePage, visibleBookings],
  );

  const openBooking = (id: string) => {
    navigate({ to: "/staff/checkin/$id", params: { id } });
  };

  return (
    <div className="p-4 md:p-8 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className={`${styles.boardHeader} p-5 md:p-6`}>
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className={styles.kicker}>
                <ClipboardList />
                {t("Staff Operations", "Vận hành nhân viên")}
              </div>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {t("Today's booking queue", "Hàng đợi booking hôm nay")}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {t(
                  "Check in arrivals and move vehicles through the wash workflow.",
                  "Check-in khách đến và đưa xe qua từng bước trong quy trình rửa.",
                )}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <BookingStatusBadge status="CONFIRMED" />
              <BookingStatusBadge status="CHECKED_IN" />
              <BookingStatusBadge status="IN_PROGRESS" />
              <BookingStatusBadge status="COMPLETED" />
            </div>
          </div>
        </section>

        <div className={styles.metricStrip}>
          <MetricCard
            label={t("Today", "Hôm nay")}
            value={metrics.total}
            icon={Clock3}
            tone="today"
          />
          <MetricCard
            label={t("Confirmed", "Đã xác nhận")}
            value={metrics.confirmed}
            icon={ClipboardList}
            tone="confirmed"
          />
          <MetricCard
            label={t("Checked in", "Đã check-in")}
            value={metrics.checkedIn}
            icon={CheckCircle2}
            tone="checkedIn"
          />
          <MetricCard
            label={t("In progress", "Đang rửa")}
            value={metrics.inProgress}
            icon={Play}
            tone="inProgress"
          />
          <MetricCard
            label={t("Completed", "Hoàn tất")}
            value={metrics.completed}
            icon={CheckCircle2}
            tone="completed"
          />
        </div>

        <Card className={styles.filterCard}>
          <CardContent className="p-5">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-base font-bold text-foreground">
                    {t("Queue filters", "Bộ lọc hàng đợi")}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {t(
                      `Showing ${visibleBookings.length} of ${bookings.length} bookings.`,
                      `Hiển thị ${visibleBookings.length} / ${bookings.length} booking.`,
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFilters(defaultFilters)}
                  className="h-9 rounded-lg font-bold"
                >
                  {t("Reset", "Đặt lại")}
                </Button>
              </div>
              <OperationsFilters
                filters={filters}
                hourOptions={hourOptions}
                staffOptions={staffOptions}
                onChange={setFilters}
              />
            </div>
          </CardContent>
        </Card>

        <OperationsTable bookings={pagedBookings} onOpenBooking={openBooking} />
        <PagerBar
          lang={lang}
          page={safePage}
          totalPages={totalPages}
          totalRows={visibleBookings.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          onPrev={() => setPage((current) => Math.max(1, current - 1))}
          onNext={() => setPage((current) => Math.min(totalPages, current + 1))}
        />
      </div>
    </div>
  );
}

function PagerBar({
  lang,
  page,
  totalPages,
  totalRows,
  pageSize,
  onPageChange,
  onPrev,
  onNext,
}: {
  lang: "en" | "vi";
  page: number;
  totalPages: number;
  totalRows: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const start = totalRows === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(totalRows, page * pageSize);
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const isVi = lang === "vi";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card/85 px-4 py-3 shadow-md backdrop-blur-xl dark:bg-card/95">
      <span className="text-xs text-muted-foreground">
        {isVi ? "Hiển thị " : "Showing "}
        <strong className="text-foreground">{start}</strong>-
        <strong className="text-foreground">{end}</strong>
        {isVi ? ` trên ${totalRows} booking` : ` of ${totalRows} bookings`}
      </span>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={onPrev} disabled={page <= 1}>
          <ChevronLeft className="mr-1 h-3.5 w-3.5" />
          {isVi ? "Trước" : "Prev"}
        </Button>
        <div className="flex items-center gap-1">
          {pages.map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              className={
                pageNumber === page
                  ? "flex h-8 min-w-8 items-center justify-center rounded-lg bg-primary px-2 text-xs font-bold text-primary-foreground shadow-sm"
                  : "flex h-8 min-w-8 items-center justify-center rounded-lg border border-border/70 bg-background/70 px-2 text-xs font-semibold text-foreground transition-colors hover:bg-accent"
              }
              aria-current={pageNumber === page ? "page" : undefined}
            >
              {pageNumber}
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={onNext} disabled={page >= totalPages}>
          {isVi ? "Sau" : "Next"}
          <ChevronRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: typeof ClipboardList;
  tone: "today" | "confirmed" | "checkedIn" | "inProgress" | "completed";
}) {
  return (
    <div
      className={`${styles.metricCard} ${styles[`metricCard${tone[0].toUpperCase()}${tone.slice(1)}`]}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className={styles.metricValue}>{value}</div>
          <div className={styles.metricLabel}>{label}</div>
        </div>
        <div className={styles.metricIconWrap}>
          <Icon className={styles.metricIcon} />
        </div>
      </div>
    </div>
  );
}
