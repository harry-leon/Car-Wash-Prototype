import { Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomerHomeHeader } from '../components/CustomerHomeHeader';
import { ActiveComboCard } from '../components/ActiveComboCard';
import { PackageCard } from '../components/PackageCard';
import { ComboCard } from '../components/ComboCard';
import { useCustomerBooking } from '../context/CustomerBookingContext';
import styles from '../styles/customer-home.module.css';

function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount);
}

export function CustomerHomePage() {
  const { customer, activeCombo, servicePackages, comboPackages } = useCustomerBooking();

  return (
    <div className={`p-4 md:p-8 lg:p-10 ${styles.page}`}>
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Breadcrumb tag */}
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary shadow-sm backdrop-blur-md">
          <Home className="h-3.5 w-3.5" /> Customer Home
        </div>

        {/* BR-HOME-01: Customer header */}
        <CustomerHomeHeader customer={customer} />

        {/* BR-HOME-01: Points */}
        <div className={styles.pointsBanner}>
          <div className={styles.pointCard} style={{ color: 'hsl(var(--primary))' }}>
            <div className={styles.pointValue}>{formatVND(customer.availablePoints)}</div>
            <div className={styles.pointLabel}>Available Points</div>
          </div>
          <div className={styles.pointCard} style={{ color: 'hsl(43 96% 56%)' }}>
            <div className={styles.pointValue}>{formatVND(customer.lifetimePoints)}</div>
            <div className={styles.pointLabel}>Lifetime Points</div>
          </div>
        </div>

        {/* BR-HOME-02, BR-COMBO-01..05: Active Combo */}
        {activeCombo && activeCombo.status === 'ACTIVE' && (
          <ActiveComboCard combo={activeCombo} />
        )}

        {/* Service Packages */}
        <div>
          <h3 className={styles.sectionTitle}>Service Packages</h3>
          <div className={styles.packageGrid}>
            {servicePackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>

        {/* Combo Packages */}
        <div>
          <h3 className={styles.sectionTitle}>Combo Packages</h3>
          <div className={styles.packageGrid}>
            {comboPackages.map((combo) => (
              <ComboCard key={combo.id} combo={combo} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
