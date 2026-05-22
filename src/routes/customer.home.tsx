import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  CalendarCheck,
  CarFront,
  ChevronRight,
  Crown,
  Droplets,
  Gift,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Ticket,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCarwashStore, type Tier } from "@/lib/carwash-store";
import { useCustomerBooking } from "@/modules/customer-booking/routes";
import type { BookingStatus } from "@/modules/customer-booking/types/booking.types";
import type { CustomerProfile } from "@/modules/customer-booking/types/customer.types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/customer/home")({
  component: () => <CustomerHome />,
});

const activeStatuses: BookingStatus[] = ["CONFIRMED", "CHECKED_IN", "IN_PROGRESS"];

function mapPortalTier(tier: Tier): CustomerProfile["tier"] {
  if (tier === "Gold") return "Gold";
  if (tier === "Platinum") return "Diamond";
  return "Silver";
}

function CustomerHome() {
  const navigate = useNavigate();
  const portalStore = useCarwashStore();
  const {
    activeCombo,
    bookings,
    comboPackages,
    customer: bookingCustomer,
    language,
    redeemPointsForVoucher,
    servicePackages,
    setBookingDraft,
    vehicles,
  } = useCustomerBooking();
  const portalCustomer = portalStore.customers.find(
    (customer) => customer.id === portalStore.currentCustomerId,
  );
  const customer = portalCustomer
    ? {
        ...bookingCustomer,
        id: portalCustomer.id,
        fullName: portalCustomer.name,
        tier: mapPortalTier(portalCustomer.tier),
        isNewCustomer: portalCustomer.tier === "Member",
        availablePoints: portalCustomer.points,
        lifetimePoints: Math.max(bookingCustomer.lifetimePoints, portalCustomer.points),
      }
    : bookingCustomer;
  const [redeemPoints, setRedeemPoints] = useState(50);
  const [redeemMessage, setRedeemMessage] = useState("");
  const copy =
    language === "vi"
      ? {
          member: "thành viên",
          welcome: "Chào mừng trở lại",
          intro: "Quản lý đặt lịch, xe, voucher và combo trong một không gian khách hàng gọn gàng.",
          book: "Đặt lịch rửa xe",
          history: "Xem lịch sử",
          available: "Điểm khả dụng",
          lifetime: "Điểm tích lũy",
          activeBookings: "Lịch đang hoạt động",
          aura: "Aura car care",
          clipTitle: "Đặt lịch nhanh, chăm xe sạch hơn.",
          clipText:
            "Đặt lịch rửa, theo dõi xe, quản lý combo và đổi điểm thành voucher ngay trên dashboard.",
          defaultVehicle: "Xe thanh toán mặc định",
          noVehicle: "Chưa có xe",
          addVehicle: "Thêm xe trước khi đặt lịch.",
          manageVehicles: "Quản lý xe",
          bookMinutes: "Đặt lịch trong vài phút",
          bookMinutesText: "Chọn xe, gói rửa, lịch, voucher và thanh toán trong một luồng.",
          track: "Theo dõi trạng thái",
          trackText: "Xem check-in và tiến trình rửa khi xe đang được phục vụ.",
          rewards: "Dùng ưu đãi rõ ràng",
          rewardsText: "Điểm đổi thành voucher trước, checkout đơn giản và minh bạch.",
          inWash: "Xe đang rửa",
          viewDetails: "Xem chi tiết",
          pointsVoucher: "Đổi điểm thành voucher",
          generateVoucher: "Tạo voucher checkout",
          pointsHint: "Điểm được đổi trước checkout. Mỗi booking chỉ dùng một voucher hợp lệ.",
          points: "Điểm",
          voucherValue: "giá trị voucher",
          generate: "Tạo",
          activeCombo: "Combo đang dùng",
          noCombo: "Chưa có combo đang dùng",
          buyCombo: "Mua combo từ danh sách bên dưới.",
          bookCombo: "Đặt bằng combo",
          washPlan: "Gói rửa",
          packagesTitle: "Gói cho lần rửa tiếp theo",
          packagesText: "Chọn một gói để đi tiếp tới checkout.",
          openBooking: "Mở đặt lịch",
          select: "Chọn",
          comboPlans: "Combo tháng",
          upgradeTitle: "Chỉ nâng cấp combo đang dùng",
          upgradeText: "Gói thấp hơn bị khóa. Checkout chỉ tính phần chênh lệch.",
          activePlan: "Gói hiện tại",
          downgradeLocked: "Không thể giảm gói",
          upgrade: "Nâng cấp",
        }
      : {
          member: "member",
          welcome: "Welcome back",
          intro:
            "Manage bookings, vehicle readiness, vouchers, and combo credits from one clean customer workspace.",
          book: "Book a wash",
          history: "View history",
          available: "Available points",
          lifetime: "Lifetime points",
          activeBookings: "Active bookings",
          aura: "Aura car care",
          clipTitle: "Smart wash, quick booking, cleaner ownership.",
          clipText:
            "Book a wash, track your vehicle, manage combos, and redeem point vouchers from the same customer dashboard.",
          defaultVehicle: "Default checkout vehicle",
          noVehicle: "No vehicle",
          addVehicle: "Add a vehicle before booking.",
          manageVehicles: "Manage vehicles",
          bookMinutes: "Book in minutes",
          bookMinutesText:
            "Select your vehicle, package, slot, voucher, and payment method in one flow.",
          track: "Track live status",
          trackText: "Follow check-in and wash progress when your vehicle is being serviced.",
          rewards: "Use rewards clearly",
          rewardsText: "Points become vouchers first, so checkout stays simple and auditable.",
          inWash: "Vehicle in wash",
          viewDetails: "View details",
          pointsVoucher: "Points to voucher",
          generateVoucher: "Generate checkout voucher",
          pointsHint:
            "Points are redeemed before checkout. Only one valid voucher can be used per booking.",
          points: "Points",
          voucherValue: "voucher value",
          generate: "Generate",
          activeCombo: "Active combo",
          noCombo: "No active combo",
          buyCombo: "Buy a combo from the plan list below.",
          bookCombo: "Book with combo",
          washPlan: "Wash plan",
          packagesTitle: "Packages for your next visit",
          packagesText: "Select a package to continue to the booking checkout.",
          openBooking: "Open booking flow",
          select: "Select",
          comboPlans: "Combo plans",
          upgradeTitle: "Upgrade active combo only",
          upgradeText:
            "Lower-tier plans are locked. Upgrade charges only the price difference at checkout.",
          activePlan: "Active plan",
          downgradeLocked: "Downgrade locked",
          upgrade: "Upgrade",
        };
  const defaultVehicle = vehicles.find((vehicle) => vehicle.isDefault) ?? vehicles[0];
  const linkedVehicle = activeCombo
    ? vehicles.find((vehicle) => vehicle.id === activeCombo.linkedVehicleId)
    : undefined;
  const currentCombo = activeCombo
    ? comboPackages.find((comboPackage) => comboPackage.id === activeCombo.comboPackageId)
    : undefined;
  const inProgress = bookings.find((booking) => booking.status === "IN_PROGRESS");
  const activeBookingCount = bookings.filter((booking) =>
    activeStatuses.includes(booking.status),
  ).length;

  const startSingleBooking = (packageId?: string) => {
    setBookingDraft({
      mode: "SINGLE_PACKAGE",
      packageId: packageId ?? servicePackages[0]?.id,
      vehicleId: defaultVehicle?.id,
      useActiveCombo: false,
      voucherId: "",
    });
    navigate({ to: "/customer/bookings/new" });
  };

  const startComboBooking = () => {
    if (!activeCombo || !linkedVehicle || !currentCombo) return;

    setBookingDraft({
      mode: "COMBO",
      packageId: currentCombo.packageIds[0] ?? servicePackages[0]?.id,
      vehicleId: linkedVehicle.id,
      useActiveCombo: true,
      voucherId: "",
      addonIds: [],
      paymentMethod: "",
    });
    navigate({ to: "/customer/bookings/new" });
  };

  const upgradeCombo = (comboPackageId: string) => {
    const target = comboPackages.find((comboPackage) => comboPackage.id === comboPackageId);

    if (!target || !currentCombo || target.price <= currentCombo.price) return;

    setBookingDraft({
      mode: "SINGLE_PACKAGE",
      packageId: target.packageIds[0] ?? servicePackages[0]?.id,
      vehicleId: defaultVehicle?.id,
      comboUpgradePackageId: target.id,
      comboUpgradeAmount: target.price - currentCombo.price,
      useActiveCombo: false,
      voucherId: "",
    });
    navigate({ to: "/customer/bookings/new" });
  };

  const redeemVoucher = () => {
    try {
      const voucher = redeemPointsForVoucher(redeemPoints);
      setRedeemMessage(
        `${voucher.code} generated, ${voucher.discountAmount.toLocaleString()} VND off until ${
          voucher.expiresAt
        }.`,
      );
    } catch (error) {
      setRedeemMessage(error instanceof Error ? error.message : "Unable to generate voucher.");
    }
  };

  return (
    <div className="px-4 py-8 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <Card className="overflow-hidden rounded-2xl border-border/50 bg-card/60 p-6 shadow-xl backdrop-blur-xl md:p-8">
            <div className="grid gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                  <Crown className="h-3.5 w-3.5" />
                  {customer.tier} {copy.member}
                </div>
                <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground md:text-4xl">
                  {copy.welcome}, {customer.fullName}
                </h1>
                <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-muted-foreground">
                  {copy.intro}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  className="h-12 rounded-xl px-6 font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
                  onClick={() => startSingleBooking()}
                >
                  {copy.book} <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button asChild variant="outline" className="h-12 rounded-xl font-bold">
                  <Link to="/customer/bookings">{copy.history}</Link>
                </Button>
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <Metric label={copy.available} value={customer.availablePoints.toLocaleString()} />
              <Metric label={copy.lifetime} value={customer.lifetimePoints.toLocaleString()} />
              <Metric label={copy.activeBookings} value={String(activeBookingCount)} />
            </div>
          </Card>

          <Card className="group overflow-hidden rounded-[24px] border-border/50 bg-slate-950 p-0 shadow-[0_24px_70px_-38px_rgba(15,23,42,0.75)] ring-1 ring-white/50 backdrop-blur-xl">
            <div className="relative h-full min-h-[360px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=1600&auto=format&fit=crop"
                alt="Premium automatic car wash"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/88 via-slate-950/45 to-slate-950/8" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/30 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/50 to-transparent" />
              <button
                type="button"
                className="absolute left-6 top-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/45 bg-white/20 text-white shadow-xl backdrop-blur-md transition hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
                aria-label="Play introduction clip"
              >
                <PlayCircle className="h-7 w-7" />
              </button>
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/18 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5" /> {copy.aura}
                </div>
                <h2 className="mt-3 max-w-lg text-2xl font-black leading-tight tracking-tight text-white drop-shadow md:text-[2rem]">
                  {copy.clipTitle}
                </h2>
                <p className="mt-2 max-w-lg text-sm font-semibold leading-relaxed text-white/90 drop-shadow">
                  {copy.clipText}
                </p>
              </div>
            </div>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
          <Card className="rounded-2xl border-border/50 bg-card/60 p-6 shadow-lg backdrop-blur-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {copy.defaultVehicle}
                </div>
                <div className="mt-2 text-2xl font-black tracking-tight text-foreground">
                  {defaultVehicle?.licensePlate ?? copy.noVehicle}
                </div>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  {defaultVehicle
                    ? `${defaultVehicle.brand} ${defaultVehicle.model}`
                    : copy.addVehicle}
                </p>
              </div>
              <CarFront className="h-10 w-10 text-primary" />
            </div>
            <Button asChild variant="outline" className="mt-5 h-11 w-full rounded-xl font-bold">
              <Link to="/customer/vehicles">{copy.manageVehicles}</Link>
            </Button>
          </Card>

          <Card className="rounded-2xl border-border/50 bg-card/60 p-6 shadow-lg backdrop-blur-xl">
            <div className="grid gap-4 md:grid-cols-3">
              <IntroStep
                icon={CalendarCheck}
                title={copy.bookMinutes}
                description={copy.bookMinutesText}
              />
              <IntroStep icon={Zap} title={copy.track} description={copy.trackText} />
              <IntroStep icon={ShieldCheck} title={copy.rewards} description={copy.rewardsText} />
            </div>
          </Card>
        </section>

        {inProgress ? (
          <Card className="rounded-2xl border-primary/20 bg-primary/5 p-5 shadow-lg">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="grid h-16 w-16 place-items-center rounded-full border-4 border-primary/20 bg-background text-lg font-black text-primary">
                  60%
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-primary">
                    {copy.inWash}
                  </div>
                  <h2 className="text-xl font-black tracking-tight">
                    {inProgress.vehicle.licensePlate}
                  </h2>
                  <p className="text-sm font-medium text-muted-foreground">
                    {inProgress.package.name} is in progress. Estimated remaining time: 12 minutes.
                  </p>
                </div>
              </div>
              <Button asChild variant="outline" className="rounded-xl font-bold">
                <Link to="/customer/bookings">{copy.viewDetails}</Link>
              </Button>
            </div>
          </Card>
        ) : null}

        <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="rounded-2xl border-border/50 bg-card/60 p-6 shadow-lg backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <Gift className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {copy.pointsVoucher}
                </div>
                <h2 className="mt-1 text-xl font-black tracking-tight">{copy.generateVoucher}</h2>
                <p className="mt-1 text-sm font-medium text-muted-foreground">{copy.pointsHint}</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-[120px_1fr_auto] sm:items-end">
              <label className="grid gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {copy.points}
                </span>
                <input
                  className="h-11 rounded-xl border border-border/60 bg-background/70 px-3 text-sm font-bold outline-none ring-primary/20 transition focus:ring-4"
                  type="number"
                  min={50}
                  max={200}
                  step={10}
                  value={redeemPoints}
                  onChange={(event) => setRedeemPoints(Number(event.target.value))}
                />
              </label>
              <div className="rounded-xl border border-border/60 bg-background/60 px-4 py-3 text-sm font-bold text-primary">
                {(redeemPoints * 1000).toLocaleString()} VND {copy.voucherValue}
              </div>
              <Button className="h-11 rounded-xl font-bold" onClick={redeemVoucher}>
                {copy.generate}
              </Button>
            </div>
            {redeemMessage ? (
              <p className="mt-3 rounded-xl bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-700">
                {redeemMessage}
              </p>
            ) : null}
          </Card>

          <Card className="rounded-2xl border-border/50 bg-card/60 p-6 shadow-lg backdrop-blur-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {copy.activeCombo}
                </div>
                <h2 className="mt-1 text-xl font-black tracking-tight">
                  {activeCombo?.comboName ?? copy.noCombo}
                </h2>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  {activeCombo
                    ? `${activeCombo.remainingUses}/${activeCombo.totalUses} uses left, valid until ${activeCombo.validUntil}. Linked to ${linkedVehicle?.licensePlate ?? "vehicle"}.`
                    : copy.buyCombo}
                </p>
              </div>
              <Ticket className="h-10 w-10 shrink-0 text-primary" />
            </div>
            <Button
              className="mt-5 h-11 w-full rounded-xl font-bold"
              disabled={!activeCombo || activeCombo.remainingUses <= 0}
              onClick={startComboBooking}
            >
              {copy.bookCombo}
            </Button>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-primary">
                {copy.washPlan}
              </div>
              <h2 className="text-2xl font-black tracking-tight">{copy.packagesTitle}</h2>
              <p className="text-sm font-medium text-muted-foreground">{copy.packagesText}</p>
            </div>
            <Button asChild variant="outline" className="rounded-xl font-bold">
              <Link to="/customer/bookings/new">{copy.openBooking}</Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {servicePackages.map((servicePackage) => (
              <Card
                key={servicePackage.id}
                className="group rounded-2xl border-border/50 bg-card/60 p-5 shadow-lg backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <Droplets className="h-7 w-7 text-primary" />
                <div className="mt-4 text-xs font-bold uppercase tracking-wider text-primary">
                  {servicePackage.recommendedFor}
                </div>
                <h3 className="mt-1 text-lg font-black">{servicePackage.name}</h3>
                <p className="mt-2 min-h-12 text-sm font-medium leading-relaxed text-muted-foreground">
                  {servicePackage.description}
                </p>
                <div className="mt-4 flex items-end justify-between border-t border-border/50 pt-4">
                  <div className="font-black text-primary">
                    {servicePackage.price.toLocaleString()} VND
                  </div>
                  <div className="text-xs font-bold text-muted-foreground">
                    {servicePackage.durationMinutes} min
                  </div>
                </div>
                <Button
                  className="mt-4 h-10 w-full rounded-xl font-bold"
                  onClick={() => startSingleBooking(servicePackage.id)}
                >
                  {copy.select}
                </Button>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-primary">
              {copy.comboPlans}
            </div>
            <h2 className="text-2xl font-black tracking-tight">{copy.upgradeTitle}</h2>
            <p className="text-sm font-medium text-muted-foreground">{copy.upgradeText}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {comboPackages.map((comboPackage) => {
              const isActive = comboPackage.id === activeCombo?.comboPackageId;
              const canUpgrade =
                Boolean(currentCombo) && comboPackage.price > (currentCombo?.price ?? 0);
              const upgradeAmount = currentCombo
                ? comboPackage.price - currentCombo.price
                : comboPackage.price;

              return (
                <Card
                  key={comboPackage.id}
                  className={cn(
                    "rounded-2xl border-border/50 bg-card/60 p-5 shadow-lg backdrop-blur-xl",
                    isActive && "border-primary/30 bg-primary/5",
                    !isActive && !canUpgrade && "opacity-70",
                  )}
                >
                  <div className="text-xs font-black uppercase tracking-wider text-primary">
                    {comboPackage.totalUses} washes / {comboPackage.validityDays} days
                  </div>
                  <h3 className="mt-3 text-lg font-black">{comboPackage.name}</h3>
                  <p className="mt-2 min-h-16 text-sm font-medium leading-relaxed text-muted-foreground">
                    {comboPackage.description}
                  </p>
                  <div className="mt-4 border-t border-border/50 pt-4">
                    <div className="font-black">{comboPackage.price.toLocaleString()} VND</div>
                    <div className="text-xs font-semibold text-muted-foreground">
                      {comboPackage.savingsText}
                    </div>
                  </div>
                  <Button
                    className="mt-4 h-10 w-full rounded-xl font-bold"
                    variant={canUpgrade ? "default" : "secondary"}
                    disabled={!canUpgrade}
                    onClick={() => upgradeCombo(comboPackage.id)}
                  >
                    {isActive
                      ? copy.activePlan
                      : canUpgrade
                        ? `${copy.upgrade} +${upgradeAmount.toLocaleString()}`
                        : copy.downgradeLocked}
                  </Button>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/60 p-4 shadow-sm">
      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-2xl font-black tracking-tight text-foreground">{value}</div>
    </div>
  );
}

function IntroStep({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof CalendarCheck;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/60 p-4 shadow-sm">
      <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-black tracking-tight text-foreground">{title}</h3>
      <p className="mt-1 text-sm font-medium leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
