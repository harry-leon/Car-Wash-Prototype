import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, ShieldCheck, Sparkles, Tags, LayoutDashboard } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/dashboard")({
  component: () => <AdminDashboardPage />,
});

function AdminDashboardPage() {
  return (
    <div className="p-4 md:p-8 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary shadow-sm backdrop-blur-md mb-4">
            <LayoutDashboard className="h-3.5 w-3.5" /> Admin Workspace
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Governance dashboard</h1>
          <p className="mt-3 max-w-3xl text-sm md:text-base text-muted-foreground leading-relaxed">
            Manage loyalty rules, promotions, audit trails, and executive analytics.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <AdminCard
            to="/admin/analytics"
            title="Analytics"
            text="Monitor revenue, bookings, and promotion performance."
            icon={BarChart3}
          />
          <AdminCard
            to="/admin/tiers"
            title="Tier Rules"
            text="Configure thresholds, booking windows, and tier multipliers."
            icon={ShieldCheck}
          />
          <AdminCard
            to="/admin/promotions"
            title="Promotions"
            text="Launch or pause tier-targeted discounts and campaigns."
            icon={Sparkles}
          />
          <AdminCard
            to="/admin/points-audit"
            title="Points Audit"
            text="Review manual adjustments and loyalty balance changes."
            icon={Tags}
          />
        </div>
      </div>
    </div>
  );
}

function AdminCard({
  to,
  title,
  text,
  icon: Icon,
}: {
  to: string;
  title: string;
  text: string;
  icon: typeof BarChart3;
}) {
  return (
    <Link to={to} className="group block">
      <Card className="relative h-full overflow-hidden rounded-[1.5rem] border border-border/50 bg-card/60 p-6 backdrop-blur-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative z-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground shadow-sm">
            <Icon className="h-6 w-6" />
          </div>
          <div className="mt-5 text-lg font-bold text-foreground transition-colors group-hover:text-primary">{title}</div>
          <div className="mt-2 text-sm font-medium leading-relaxed text-muted-foreground">{text}</div>
        </div>
      </Card>
    </Link>
  );
}
