import { useCarwashStore, Reward, Tier, TierRule } from "@/lib/carwash-store";

export type TierName = Tier;
export type { Reward };

export function useLoyalty() {
  const store = useCarwashStore();
  return {
    tiers: store.tiers.map((tier) => ({
      name: tier.name,
      threshold: tier.minPoints,
      multiplier: tier.multiplier,
      perks: tier.perks,
    })),
    customers: store.customers.map((customer) => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      points: customer.points,
      tier: customer.tier,
    })),
    rewards: store.rewards,
    ledger: store.ledger,
    promotions: store.promotions,
    audit: store.tierHistory,
    activeCustomerId: store.currentCustomerId,
    setActiveCustomerId: store.setCurrentCustomerId,
    updateTiers: (next: Array<{ name: TierName; threshold: number; multiplier: number; perks: string }>) =>
      store.updateTiers(
        next.map((tier) => {
          const current = store.tiers.find((item) => item.name === tier.name);
          return {
            name: tier.name,
            minPoints: tier.threshold,
            multiplier: tier.multiplier,
            perks: tier.perks,
            bookingWindowDays: current?.bookingWindowDays ?? 7,
            discountPercent: current?.discountPercent ?? 0,
          };
        }) satisfies TierRule[],
      ),
    redeemReward: store.redeemReward,
    addPromotion: (promotion: {
      code: string;
      discountType: "Percentage" | "Flat";
      amount: number;
      tiers: TierName[];
      active: boolean;
    }) =>
      store.addPromotion({
        ...promotion,
        startDate: "2026-05-18",
        endDate: "2026-12-31",
        stackable: false,
      }),
    togglePromotion: store.togglePromotion,
    computeTier: (points: number) =>
      [...store.tiers].sort((a, b) => b.minPoints - a.minPoints).find((tier) => points >= tier.minPoints)?.name ?? "Member",
  };
}

export function tierGradient(tier: TierName) {
  switch (tier) {
    case "Platinum":
      return "from-sky-400 via-indigo-500 to-fuchsia-600 text-white";
    case "Gold":
      return "from-amber-400 via-yellow-500 to-amber-600 text-amber-50";
    case "Silver":
      return "from-slate-300 via-zinc-400 to-slate-500 text-slate-50";
    case "Member":
    default:
      return "from-orange-700 via-amber-800 to-orange-900 text-amber-50";
  }
}

export function tierBadgeClass(tier: TierName) {
  switch (tier) {
    case "Platinum":
      return "bg-gradient-to-r from-sky-400 to-fuchsia-600 text-white border-fuchsia-400/50";
    case "Gold":
      return "bg-gradient-to-r from-amber-400 to-yellow-600 text-amber-50 border-amber-500/40";
    case "Silver":
      return "bg-gradient-to-r from-slate-300 to-zinc-500 text-slate-50 border-slate-400/40";
    case "Member":
    default:
      return "bg-gradient-to-r from-orange-600 to-amber-800 text-amber-50 border-amber-700/40";
  }
}
