import * as React from "react";

export type Tier = "Gold" | "Silver" | "Guest";

export interface Customer {
  id: string;
  name: string;
  tier: Tier;
  discountPct: number;
  points: number;
}

export interface Service {
  id: string;
  name: string;
  price: number;
}

export interface VehicleType {
  id: string;
  name: string;
}

export interface Transaction {
  id: string;
  date: string;
  customer: Customer;
  vehicleType: string;
  plate: string;
  services: Service[];
  subtotal: number;
  tierDiscount: number;
  promoDiscount: number;
  promoCode?: string;
  pointsRedeemed: number;
  pointsValue: number;
  finalAmount: number;
  pointsEarned: number;
  paymentMethod: string;
}

export interface DraftSession {
  customer: Customer;
  vehicleType: string;
  plate: string;
  services: Service[];
}

export const SERVICES: Service[] = [
  { id: "basic", name: "Basic Wash", price: 15 },
  { id: "premium", name: "Premium Detail", price: 40 },
  { id: "vacuum", name: "Interior Vacuum", price: 10 },
  { id: "ceramic", name: "Ceramic Coating", price: 80 },
];

export const PROMOS: Record<string, { type: "pct" | "flat"; value: number; label: string }> = {
  WELCOME20: { type: "pct", value: 20, label: "20% off" },
  WASH5: { type: "flat", value: 5, label: "$5 flat off" },
};

export const GUEST: Customer = {
  id: "guest",
  name: "Guest",
  tier: "Guest",
  discountPct: 0,
  points: 0,
};

const INITIAL_CUSTOMERS: Customer[] = [
  { id: "john", name: "John Doe", tier: "Gold", discountPct: 10, points: 450 },
  { id: "jane", name: "Jane Smith", tier: "Silver", discountPct: 5, points: 120 },
];

interface StoreCtx {
  customers: Customer[];
  draft: DraftSession | null;
  setDraft: (d: DraftSession | null) => void;
  lastTransaction: Transaction | null;
  transactions: Transaction[];
  commitTransaction: (t: Transaction) => void;
  updateCustomerPoints: (id: string, newPoints: number) => void;
}

const Ctx = React.createContext<StoreCtx | null>(null);

export function WashStoreProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = React.useState<Customer[]>(INITIAL_CUSTOMERS);
  const [draft, setDraft] = React.useState<DraftSession | null>(null);
  const [lastTransaction, setLastTransaction] = React.useState<Transaction | null>(null);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);

  const commitTransaction = (t: Transaction) => {
    setTransactions((prev) => [t, ...prev]);
    setLastTransaction(t);
  };

  const updateCustomerPoints = (id: string, newPoints: number) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, points: newPoints } : c)));
  };

  return (
    <Ctx.Provider
      value={{
        customers,
        draft,
        setDraft,
        lastTransaction,
        transactions,
        commitTransaction,
        updateCustomerPoints,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useWashStore() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useWashStore must be used inside WashStoreProvider");
  return ctx;
}

export function fmtMoney(n: number) {
  return `$${n.toFixed(2)}`;
}