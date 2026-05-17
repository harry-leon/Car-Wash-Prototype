import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Car, ClipboardList, CreditCard, History, ReceiptText, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "New Wash", icon: ClipboardList, exact: true },
  { to: "/checkout", label: "Checkout", icon: CreditCard },
  { to: "/confirmation", label: "Confirmation", icon: ReceiptText },
  { to: "/history", label: "History", icon: History },
];

export function AppShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-card">
        <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Car className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight">SudsHub</div>
            <div className="text-xs text-muted-foreground">Wash Management</div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map((item) => {
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
        </nav>
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-2 rounded-md bg-accent/40 p-3">
            <Sparkles className="h-4 w-4 text-primary" />
            <div className="text-xs">
              <div className="font-medium text-foreground">Staff Console</div>
              <div className="text-muted-foreground">Shift · Day</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 border-b border-border bg-card">
        <div className="flex items-center gap-2 px-4 py-3">
          <Car className="h-5 w-5 text-primary" />
          <span className="font-semibold text-sm">SudsHub</span>
        </div>
        <div className="flex overflow-x-auto px-2 pb-2 gap-1">
          {nav.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap",
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground bg-accent/40",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <main className="flex-1 min-w-0 pt-24 md:pt-0">
        <Outlet />
      </main>
    </div>
  );
}