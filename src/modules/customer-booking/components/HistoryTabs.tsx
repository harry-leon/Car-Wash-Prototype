import { useLocation, Link } from '@tanstack/react-router';
import styles from '../styles/history.module.css';

const TABS = [
  { label: 'Bookings', path: '/customer/transactions' },
  { label: 'Wash History', path: '/customer/transactions' },
  { label: 'Points', path: '/customer/transactions' },
] as const;

interface HistoryTabsProps {
  activeTab: 'bookings' | 'washes' | 'points';
  onTabChange: (tab: 'bookings' | 'washes' | 'points') => void;
}

const TAB_KEYS: Array<'bookings' | 'washes' | 'points'> = ['bookings', 'washes', 'points'];
const TAB_LABELS: Record<string, string> = {
  bookings: 'Bookings',
  washes: 'Wash History',
  points: 'Points',
};

export function HistoryTabs({ activeTab, onTabChange }: HistoryTabsProps) {
  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabsList}>
        {TAB_KEYS.map((key) => (
          <button
            key={key}
            className={`${styles.tabItem} ${activeTab === key ? styles.tabItemActive : ''}`}
            onClick={() => onTabChange(key)}
          >
            {TAB_LABELS[key]}
          </button>
        ))}
      </div>
    </div>
  );
}
