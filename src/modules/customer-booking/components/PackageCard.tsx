import type { ServicePackage } from '../types/customer.types';
import styles from '../styles/customer-home.module.css';

interface PackageCardProps {
  pkg: ServicePackage;
}

function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function PackageCard({ pkg }: PackageCardProps) {
  return (
    <div className={styles.packageCard}>
      <h4 className="text-base font-bold">{pkg.name}</h4>
      <p className={styles.packageDesc}>{pkg.description}</p>
      <div className={styles.packagePrice}>{formatVND(pkg.price)}</div>
      <div className={styles.packageDuration}>~{pkg.durationMinutes} min</div>
    </div>
  );
}
