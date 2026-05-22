import { createFileRoute } from "@tanstack/react-router";
import { Crown, Gift, Ticket, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getUsableVouchers, useCustomerBooking } from "@/modules/customer-booking/routes";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/customer/loyalty")({
  component: () => <LoyaltyPage />,
});

function LoyaltyPage() {
  const { customer, language, pointTransactions, redeemPointsForVoucher, vouchers } =
    useCustomerBooking();
  const [redeemPoints, setRedeemPoints] = useState(50);
  const [message, setMessage] = useState("");
  const copy =
    language === "vi"
      ? {
          member: "Thành viên",
          heroTitle: "Điểm được đổi thành voucher trước checkout",
          heroText:
            "Điểm khả dụng dùng để tạo voucher giảm giá. Điểm tích lũy không giảm và chỉ dùng để tính hạng thành viên.",
          available: "Điểm khả dụng",
          lifetime: "Điểm tích lũy",
          active: "Voucher khả dụng",
          rule: "Quy tắc đổi điểm",
          generateTitle: "Tạo voucher",
          generateText:
            "Tối thiểu 50 điểm, tối đa 200 điểm. Một điểm tạo 1,000 VND giá trị voucher.",
          points: "Điểm",
          voucherValue: "giá trị voucher",
          generate: "Tạo voucher",
          generated: "đã tạo, giảm",
          until: "đến",
          unable: "Không thể tạo voucher.",
          apply: "Áp dụng một ưu đãi",
          usable: "Voucher có thể dùng",
          ledger: "Sổ điểm",
          transactions: "Giao dịch",
        }
      : {
          member: "Member",
          heroTitle: "Points become vouchers before checkout",
          heroText:
            "Available points can generate discount vouchers. Lifetime points never decrease and are used only to calculate membership tier.",
          available: "Available points",
          lifetime: "Lifetime points",
          active: "Active vouchers",
          rule: "Redeem rule",
          generateTitle: "Generate a voucher",
          generateText:
            "Minimum 50 points, maximum 200 points. One point creates 1,000 VND voucher value.",
          points: "Points",
          voucherValue: "voucher value",
          generate: "Generate voucher",
          generated: "generated,",
          until: "until",
          unable: "Unable to generate voucher.",
          apply: "Apply one promotion",
          usable: "Usable vouchers",
          ledger: "Point ledger",
          transactions: "Transactions",
        };
  const usableVouchers = getUsableVouchers(vouchers, customer);
  const tierTarget =
    customer.tier === "Silver" ? 5000 : customer.tier === "Gold" ? 12000 : customer.lifetimePoints;
  const tierBase = customer.tier === "Silver" ? 0 : customer.tier === "Gold" ? 5000 : 12000;
  const progress =
    customer.tier === "Diamond"
      ? 100
      : Math.min(
          100,
          Math.round(((customer.lifetimePoints - tierBase) / (tierTarget - tierBase)) * 100),
        );

  const redeem = () => {
    try {
      const voucher = redeemPointsForVoucher(redeemPoints);
      setMessage(
        language === "vi"
          ? `${voucher.code} ${copy.generated} ${voucher.discountAmount.toLocaleString()} VND ${copy.until} ${voucher.expiresAt}.`
          : `${voucher.code} ${copy.generated} ${voucher.discountAmount.toLocaleString()} VND off ${copy.until} ${voucher.expiresAt}.`,
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : copy.unable);
    }
  };

  return (
    <div className="p-4 md:p-8 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mx-auto max-w-7xl space-y-8">
        <Card className="overflow-hidden rounded-2xl border-border/50 bg-card/60 p-6 shadow-xl backdrop-blur-xl md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                <Crown className="h-3.5 w-3.5" />{" "}
                {language === "vi"
                  ? `${copy.member} ${customer.tier}`
                  : `${customer.tier} ${copy.member}`}
              </div>
              <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground">
                {copy.heroTitle}
              </h1>
              <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-muted-foreground">
                {copy.heroText}
              </p>
              <div className="mt-6 h-2 overflow-hidden rounded-full bg-accent">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <Metric label={copy.available} value={customer.availablePoints.toLocaleString()} />
              <Metric label={copy.lifetime} value={customer.lifetimePoints.toLocaleString()} />
              <Metric label={copy.active} value={String(usableVouchers.length)} />
            </div>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="rounded-2xl border-border/50 bg-card/60 p-6 shadow-lg backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <Gift className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {copy.rule}
                </div>
                <h2 className="mt-1 text-xl font-black tracking-tight">{copy.generateTitle}</h2>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  {copy.generateText}
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-[120px_1fr]">
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
            </div>
            <Button className="mt-4 h-11 w-full rounded-xl font-bold" onClick={redeem}>
              {copy.generate}
            </Button>
            {message ? (
              <p className="mt-3 rounded-xl bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-700">
                {message}
              </p>
            ) : null}
          </Card>

          <Card className="rounded-2xl border-border/50 bg-card/60 p-6 shadow-lg backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {copy.apply}
                </div>
                <h2 className="text-xl font-black tracking-tight">{copy.usable}</h2>
              </div>
              <Ticket className="h-8 w-8 text-primary" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {usableVouchers.map((voucher) => (
                <div
                  key={voucher.id}
                  className="rounded-xl border border-border/60 bg-background/60 p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-black text-foreground">{voucher.code}</div>
                    <div className="rounded-full bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
                      {voucher.source.replaceAll("_", " ")}
                    </div>
                  </div>
                  <p className="mt-2 text-sm font-medium text-muted-foreground">{voucher.label}</p>
                  <div className="mt-3 flex items-end justify-between gap-3 border-t border-border/50 pt-3">
                    <strong className="text-primary">
                      -{voucher.discountAmount.toLocaleString()} VND
                    </strong>
                    <small className="font-semibold text-muted-foreground">
                      {copy.until} {voucher.expiresAt}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="rounded-2xl border-border/50 bg-card/60 shadow-lg backdrop-blur-xl">
          <div className="border-b border-border/50 p-6">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {copy.ledger}
            </div>
            <h2 className="mt-1 text-xl font-black tracking-tight">{copy.transactions}</h2>
          </div>
          <ul className="divide-y divide-border/50">
            {pointTransactions.map((transaction) => (
              <li key={transaction.id} className="flex items-center gap-4 p-5">
                <div
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-full",
                    transaction.points >= 0
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-rose-500/10 text-rose-600",
                  )}
                >
                  {transaction.points >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-foreground">
                    {transaction.description}
                  </div>
                  <div className="mt-1 text-xs font-medium text-muted-foreground">
                    {new Date(transaction.createdAt).toLocaleString()} / {transaction.type}
                  </div>
                </div>
                <div
                  className={cn(
                    "font-black tabular-nums",
                    transaction.points >= 0 ? "text-emerald-600" : "text-rose-600",
                  )}
                >
                  {transaction.points > 0 ? "+" : ""}
                  {transaction.points.toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        </Card>
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
