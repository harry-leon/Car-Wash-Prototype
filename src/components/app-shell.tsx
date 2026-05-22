import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  CarFront,
  ChevronDown,
  ClipboardList,
  Droplets,
  Gift,
  Home,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Phone,
  ReceiptText,
  Settings2,
  Sparkles,
  UserRound,
  Users,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { getHomePath } from "@/lib/auth";
import { type Role, useCarwashStore } from "@/lib/carwash-store";
import { cn } from "@/lib/utils";
import {
  LanguageSwitcher,
  ThemeSwitcher,
  useLanguage,
} from "@/modules/public-auth/components/LanguageSwitcher";

type NavItem = {
  to: string;
  label: string;
  labelVi: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

type NavGroup = {
  label: string;
  labelVi: string;
  items: NavItem[];
};

const CUSTOMER_NAV: NavGroup[] = [
  {
    label: "Customer",
    labelVi: "Khách hàng",
    items: [
      {
        to: "/customer/overview",
        label: "Overview",
        labelVi: "Tổng quan",
        icon: LayoutDashboard,
        exact: true,
      },
      { to: "/customer/profile", label: "Profile", labelVi: "Hồ sơ", icon: UserRound },
      { to: "/customer/vehicles", label: "Vehicles", labelVi: "Xe của tôi", icon: CarFront },
      {
        to: "/customer/bookings/new",
        label: "New Booking",
        labelVi: "Đặt lịch mới",
        icon: ClipboardList,
      },
      { to: "/customer/bookings", label: "Bookings", labelVi: "Lịch đặt", icon: ClipboardList },
      { to: "/customer/loyalty", label: "Loyalty", labelVi: "Tích điểm", icon: Gift },
      {
        to: "/customer/transactions",
        label: "Transactions",
        labelVi: "Giao dịch",
        icon: ReceiptText,
      },
    ],
  },
  {
    label: "Booking Module",
    labelVi: "Module đặt lịch",
    items: [
      {
        to: "/customer/cb/home",
        label: "CB Home",
        labelVi: "Trang CB",
        icon: Sparkles,
        exact: true,
      },
      { to: "/customer/cb/vehicles", label: "CB Vehicles", labelVi: "Xe CB", icon: CarFront },
      {
        to: "/customer/cb/booking",
        label: "CB Booking",
        labelVi: "Đặt lịch CB",
        icon: ClipboardList,
      },
      { to: "/customer/cb/history", label: "CB History", labelVi: "Lịch sử CB", icon: ReceiptText },
    ],
  },
];

const STAFF_NAV: NavGroup[] = [
  {
    label: "Staff",
    labelVi: "Nhân viên",
    items: [
      {
        to: "/staff/dashboard",
        label: "Dashboard",
        labelVi: "Bảng điều khiển",
        icon: LayoutDashboard,
        exact: true,
      },
      { to: "/staff/operations", label: "Operations", labelVi: "Vận hành", icon: ClipboardList },
      { to: "/staff/check-in", label: "Check-in", labelVi: "Check-in", icon: Wrench },
    ],
  },
];

const ADMIN_NAV: NavGroup[] = [
  {
    label: "Admin",
    labelVi: "Quản trị",
    items: [
      {
        to: "/admin/dashboard",
        label: "Dashboard",
        labelVi: "Bảng điều khiển",
        icon: LayoutDashboard,
        exact: true,
      },
      { to: "/admin/bookings", label: "Bookings", labelVi: "Lịch đặt", icon: ClipboardList },
      { to: "/admin/customers", label: "Customers", labelVi: "Khách hàng", icon: Users },
      { to: "/admin/packages", label: "Wash Packages", labelVi: "Gói rửa xe", icon: Droplets },
      { to: "/admin/loyalty", label: "Loyalty", labelVi: "Tích điểm", icon: Gift },
      { to: "/admin/promotions", label: "Promotions", labelVi: "Khuyến mãi", icon: Sparkles },
      { to: "/admin/reports", label: "Reports", labelVi: "Báo cáo", icon: BarChart3 },
      { to: "/admin/settings", label: "Settings", labelVi: "Cài đặt", icon: Settings2 },
    ],
  },
];

function navForRole(role: Role) {
  if (role === "Staff") return STAFF_NAV;
  if (role === "Admin") return ADMIN_NAV;
  return CUSTOMER_NAV;
}

export function AppShell({ role }: { role: Role }) {
  const { t } = useLanguage();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const navigate = useNavigate();
  const { loginAs, logout } = useCarwashStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navGroups = navForRole(role);

  const switchRole = (nextRole: Role) => {
    loginAs(nextRole);
    navigate({ to: getHomePath(nextRole) });
  };

  const store = useCarwashStore();
  const currentCustomer = store.customers.find((c) => c.id === store.currentCustomerId);
  const profileName =
    role === "Customer" && currentCustomer ? currentCustomer.name : `${role} User`;
  const profileTag =
    role === "Customer" && currentCustomer
      ? t(`${currentCustomer.tier} Member`, `Hạng ${currentCustomer.tier}`)
      : t(`${role} Workspace`, `Không gian ${role}`);

  let headerTitle = "Overview";
  let headerTitleVi = "Tổng quan";
  let headerSubtitle = "Manage your car wash activities";
  let headerSubtitleVi = "Quản lý hoạt động rửa xe của bạn";

  if (pathname.includes("/cb/home")) {
    headerTitle = "Customer Home";
    headerTitleVi = "Trang khách hàng";
    headerSubtitleVi = "Bảng điều khiển điểm, combo và gói dịch vụ";
    headerSubtitle = "Your dashboard — points, combos, and packages";
  } else if (pathname.includes("/cb/vehicles")) {
    headerTitle = "My Vehicles";
    headerTitleVi = "Xe của tôi";
    headerSubtitleVi = "Thêm, sửa hoặc xóa xe đã đăng ký";
    headerSubtitle = "Add, edit, or remove your registered vehicles";
  } else if (pathname.includes("/cb/booking")) {
    headerTitle = "Book a Wash";
    headerTitleVi = "Đặt lịch rửa xe";
    headerSubtitleVi = "Tạo lịch đặt mới trong 6 bước";
    headerSubtitle = "Create a new booking in 6 easy steps";
  } else if (pathname.includes("/cb/history")) {
    headerTitle = "History";
    headerTitleVi = "Lịch sử";
    headerSubtitleVi = "Lịch đặt, lượt rửa và giao dịch điểm";
    headerSubtitle = "Bookings, washes, and point transactions";
  } else if (pathname.includes("/profile")) {
    headerTitle = "Personal Profile";
    headerTitleVi = "Hồ sơ cá nhân";
    headerSubtitleVi = "Quản lý thông tin tài khoản và tùy chọn";
    headerSubtitle = "Manage your account information and preferences";
  } else if (pathname.includes("/bookings")) {
    headerTitle = "Your Bookings";
    headerTitleVi = "Lịch đặt của bạn";
    headerSubtitleVi = "Theo dõi và quản lý lịch hẹn rửa xe";
    headerSubtitle = "Track and manage your wash appointments";
  } else if (pathname.includes("/transactions")) {
    headerTitle = "Transactions";
    headerTitleVi = "Giao dịch";
    headerSubtitleVi = "Xem lịch sử thanh toán và hóa đơn";
    headerSubtitle = "View your payment history and receipts";
  } else if (pathname.includes("/vehicles")) {
    headerTitle = "Your Vehicles";
    headerTitleVi = "Xe của bạn";
    headerSubtitleVi = "Quản lý xe đã đăng ký";
    headerSubtitle = "Manage your registered vehicles";
  } else if (pathname.includes("/loyalty")) {
    headerTitle = "Loyalty & Rewards";
    headerTitleVi = "Tích điểm & quà thưởng";
    headerSubtitleVi = "Theo dõi điểm và quyền lợi thành viên";
    headerSubtitle = "Track your points and membership benefits";
  } else if (role === "Staff") {
    headerTitle = "Staff Dashboard";
    headerTitleVi = "Bảng điều khiển nhân viên";
    headerSubtitleVi = "Quản lý check-in và vận hành";
    headerSubtitle = "Manage check-ins and operations";
  } else if (role === "Admin") {
    headerTitle = "Admin Control Panel";
    headerTitleVi = "Bảng quản trị";
    headerSubtitleVi = "Tổng quan hệ thống và cấu hình";
    headerSubtitle = "System overview and configurations";
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground relative selection:bg-primary/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/5 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/5 blur-[120px] mix-blend-screen" />
      </div>

      <aside
        className={cn(
          "hidden shrink-0 border-r border-border/50 bg-card/60 backdrop-blur-xl transition-all duration-300 lg:flex lg:flex-col relative z-20 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] dark:shadow-none",
          sidebarCollapsed ? "w-20" : "w-72",
        )}
        onClick={() => {
          if (sidebarCollapsed) {
            setSidebarCollapsed(false);
          }
        }}
      >
        <div className="border-b border-border/50 px-6 py-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-md overflow-hidden p-0.5">
                <img
                  src="/logo.png"
                  alt="AURA CAR CARE logo"
                  className="h-full w-full rounded-[10px] object-cover"
                />
              </div>
              {!sidebarCollapsed && (
                <div className="animate-in fade-in duration-300">
                  <div className="font-bold tracking-tight">AURA CAR CARE</div>
                  <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {t(`${role} Workspace`, `Không gian ${role}`)}
                  </div>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSidebarCollapsed((value) => !value);
              }}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-background/50 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary hover:border-primary/30"
              aria-label={sidebarCollapsed ? "Expand menu" : "Collapse menu"}
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>
          </div>

          {!sidebarCollapsed && (
            <div className="mt-6 rounded-xl border border-border/50 bg-background/40 p-3 backdrop-blur-sm animate-in fade-in duration-500">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                {t("Demo Role Switch", "Chuyển vai trò demo")}
              </div>
              <div className="flex gap-1.5">
                {(["Customer", "Staff", "Admin"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => switchRole(item)}
                    className={cn(
                      "flex-1 rounded-lg px-2 py-1.5 text-xs font-semibold transition-all duration-200 border",
                      role === item
                        ? "bg-primary/10 text-primary border-primary/30 shadow-sm"
                        : "bg-transparent text-muted-foreground border-transparent hover:bg-background/80 hover:border-border",
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={cn("flex-1 overflow-y-auto py-6", sidebarCollapsed ? "px-3" : "px-4")}>
          {navGroups.map((group) => (
            <div key={group.label} className="mb-6">
              {!sidebarCollapsed && (
                <div className="px-2 pb-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 animate-in fade-in">
                  {t(group.label, group.labelVi)}
                </div>
              )}
              <div className="space-y-1.5">
                {group.items.map((item) => {
                  const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={(event) => {
                        if (sidebarCollapsed) {
                          event.preventDefault();
                          setSidebarCollapsed(false);
                        }
                      }}
                      className={cn(
                        "group relative flex items-center rounded-xl text-sm font-medium transition-all duration-200",
                        sidebarCollapsed ? "justify-center h-12 w-12 mx-auto" : "gap-3 px-3 py-2.5",
                        active
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                          : "text-muted-foreground hover:bg-primary/5 hover:text-foreground",
                      )}
                      title={sidebarCollapsed ? t(item.label, item.labelVi) : undefined}
                    >
                      {active && !sidebarCollapsed && (
                        <div className="absolute left-0 top-1/2 h-1/2 w-1 -translate-y-1/2 rounded-r-full bg-primary-foreground/30" />
                      )}
                      <Icon
                        className={cn(
                          "h-4 w-4 transition-colors",
                          active
                            ? "text-primary-foreground"
                            : "text-muted-foreground group-hover:text-primary",
                        )}
                      />
                      {!sidebarCollapsed && <span>{t(item.label, item.labelVi)}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto border-t border-border/50 p-4 space-y-4">
          {!sidebarCollapsed && (
            <div className="rounded-xl bg-primary/5 p-4 border border-primary/10">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">
                    {t("Customer Support", "Hỗ trợ khách hàng")}
                  </div>
                  <div className="mt-0.5 text-base font-extrabold text-foreground tracking-tight">
                    1900 1234
                  </div>
                  <div className="mt-1 text-[10px] text-muted-foreground font-medium">
                    {t("8:00 - 20:00 Daily", "8:00 - 20:00 hằng ngày")}
                  </div>
                </div>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              logout();
              navigate({ to: "/login" });
            }}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-xl border border-border/60 bg-background/50 p-3 text-sm font-bold text-foreground transition-all hover:bg-accent hover:text-accent-foreground shadow-sm group",
              sidebarCollapsed ? "px-0" : "px-4",
            )}
            title={t("Sign out", "Đăng xuất")}
          >
            <LogOut className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            {!sidebarCollapsed && <span>{t("Sign out", "Đăng xuất")}</span>}
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1 flex flex-col relative z-10">
        <header className="sticky top-0 z-30 border-b border-border/50 bg-background/90 px-4 py-4 backdrop-blur-xl lg:px-8 transition-all">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm overflow-hidden p-0.5">
                <img
                  src="/logo.png"
                  alt="AURA CAR CARE logo"
                  className="h-full w-full rounded-[6px] object-cover"
                />
              </div>
              <div className="hidden lg:block">
                <div className="text-xl font-bold tracking-tight text-foreground">
                  {t(headerTitle, headerTitleVi)}
                </div>
                <div className="text-sm font-medium text-muted-foreground mt-0.5">
                  {t(headerSubtitle, headerSubtitleVi)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => {
                  logout();
                  window.location.assign("/");
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/60 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                title={t("Public home", "Trang chủ")}
              >
                <Home className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2">
                <ThemeSwitcher />
                <LanguageSwitcher />
              </div>

              {role === "Customer" && (
                <button
                  type="button"
                  onClick={() =>
                    navigate({
                      to: "/customer/bookings",
                    })
                  }
                  className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title={t("Booking reminders", "Nhắc lịch đặt")}
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#ff3b30] text-[10px] font-bold text-white shadow-sm ring-2 ring-background">
                    2
                  </span>
                </button>
              )}

              <div className="h-10 w-px bg-border/60 hidden sm:block" />

              <button
                type="button"
                onClick={() =>
                  navigate({
                    to:
                      role === "Customer"
                        ? "/customer/profile"
                        : `/${role.toLowerCase()}/dashboard`,
                  })
                }
                className="group flex items-center gap-3 text-left hover:opacity-80 transition-opacity"
              >
                <div className="h-10 w-10 overflow-hidden rounded-full border border-border/50 bg-secondary/50 shadow-sm shrink-0">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profileName}&backgroundColor=e2e8f0`}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-bold text-foreground leading-tight">
                    {profileName}
                  </div>
                  <div className="mt-1 inline-flex rounded-md bg-indigo-500/10 px-1.5 py-0.5 text-[11px] font-bold text-indigo-600 leading-none">
                    {profileTag}
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block transition-transform group-hover:translate-y-0.5 cursor-pointer" />
              </button>
            </div>
          </div>
        </header>
        <main className="min-w-0 flex-1 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
