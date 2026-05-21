import type { Customer } from '../types/customer.types';
import styles from '../styles/customer-home.module.css';

interface CustomerHomeHeaderProps {
  customer: Customer;
}

export function CustomerHomeHeader({ customer }: CustomerHomeHeaderProps) {
  const initials = customer.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const tierClass = styles[`tier${customer.tier}` as keyof typeof styles] ?? '';

  return (
    <div className={styles.header}>
      <div className={styles.avatarPlaceholder}>{initials}</div>
      <div>
        <h2 className="text-xl font-bold tracking-tight">{customer.name}</h2>
        <span className={`${styles.tierBadge} ${tierClass}`}>{customer.tier}</span>
      </div>
    </div>
  );
}
