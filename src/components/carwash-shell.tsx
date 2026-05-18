import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  CarFront,
  ClipboardList,
  Gift,
  LayoutDashboard,
  ReceiptText,
  Settings2,
  ShieldCheck,
  Sparkles,
  UserPlus,
  UserRound,
  Wrench,
} from "lucide-react";
import { useCarwashStore } from "@/lib/carwash-store";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    label: "Customer",
    items: [
      { to: "/", label: "Overview", icon: LayoutDashboard, exact: true },
      { to: "/register", label: "Register", icon: UserPlus },
      { to: "/profile", label: "Profile", icon: UserRound },
      { to: "/vehicles", label: "Vehicles", icon: CarFront },
      { to: "/bookings/new", label: "New Booking", icon: ClipboardList },
      { to: "/bookings", label: "Bookings", icon: ClipboardList },
      { to: "/loyalty", label: "Loyalty", icon: Gift },
      { to: "/transactions", label: "Transactions", icon: ReceiptText },
    ],
  },
  {
    label: "Operations",
    items: [
      { to: "/staff/check-in", label: "Staff Check-in", icon: Wrench },
      { to: "/wash-session", label: "Wash Session", icon: CarFront },
      { to: "/checkout", label: "Checkout", icon: ReceiptText },
      { to: "/notifications", label: "Notifications", icon: Bell },
    ],
  },
  {
    label: "Admin",
    items: [
      { to: "/admin/tiers", label: "Tier Rules", icon: Settings2 },
      { to: "/admin/promotions", label: "Promotions", icon: Sparkles },
      { to: "/admin/tier-history", label: "Tier History", icon: ShieldCheck },
      { to: "/admin/points-audit", label: "Points Audit", icon: ShieldCheck },
      { to: "/admin/analytics", label: "Analytics", icon: LayoutDashboard },
      { to: "/admin/rbac", label: "RBAC", icon: ShieldCheck },
    ],
  },
];

export function CarwashShell() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { role, setRole } = useCarwashStore();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-72 shrink-0 border-r border-border bg-card lg:flex lg:flex-col">
        <div className="border-b border-border px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold">Carwash</div>
              <div className="text-xs text-muted-foreground">Unified Prototype</div>
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-border bg-accent/30 p-3">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Active workspace role
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1 rounded-lg bg-background p-1">
              {(["Customer", "Staff", "Admin"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setRole(item)}
                  className={cn(
                    "rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                    role === item ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-4">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-5">
              <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-border bg-card/90 px-4 py-3 backdrop-blur lg:px-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold">AutoWash Pro</div>
              <div className="text-xs text-muted-foreground">
                Main flow aligned to README and business rules
              </div>
            </div>
            <div className="rounded-full bg-accent/40 px-3 py-1 text-xs font-medium text-muted-foreground">
              Role: {role}
            </div>
          </div>
        </header>
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
