import type { ComboPackage } from '../types/customer.types';
import styles from '../styles/customer-home.module.css';

interface ComboCardProps {
  combo: ComboPackage;
}

function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ComboCard({ combo }: ComboCardProps) {
  return (
    <div className={styles.packageCard}>
      <h4 className="text-base font-bold">{combo.name}</h4>
      <div className="mt-1 text-xs text-muted-foreground">
        {combo.totalUses} uses &middot; Valid {combo.validDays} days
      </div>
      <div className={styles.packagePrice}>{formatVND(combo.price)}</div>
      <div className={styles.packageDuration}>
        {formatVND(Math.round(combo.price / combo.totalUses))} / use
      </div>
    </div>
  );
}
