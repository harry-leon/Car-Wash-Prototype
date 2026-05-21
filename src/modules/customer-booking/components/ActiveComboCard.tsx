import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import type { ActiveCombo } from '../types/customer.types';
import styles from '../styles/customer-home.module.css';

interface ActiveComboCardProps {
  combo: ActiveCombo;
}

export function ActiveComboCard({ combo }: ActiveComboCardProps) {
  const navigate = useNavigate();

  const expiresDate = new Date(combo.expiresAt);
  const now = new Date();
  const diffMs = expiresDate.getTime() - now.getTime();
  const daysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

  const usagePercent = ((combo.totalUses - combo.remainingUses) / combo.totalUses) * 100;

  return (
    <div className={styles.comboCard}>
      <div className={styles.comboHeader}>
        <div>
          <h3 className="text-lg font-bold">{combo.comboName}</h3>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-500/30">
            {combo.status}
          </span>
        </div>
        <Button
          size="sm"
          onClick={() => navigate({ to: '/customer/bookings/new' })}
          className="rounded-full"
        >
          Book a wash
        </Button>
      </div>

      <div className={styles.comboUsageBar}>
        <div className={styles.comboUsageFill} style={{ width: `${usagePercent}%` }} />
      </div>
      <p className="text-sm text-muted-foreground">
        <strong>{combo.remainingUses}</strong> of {combo.totalUses} uses remaining
      </p>

      <div className={styles.comboMeta}>
        <div className={styles.comboMetaItem}>
          <div className={styles.comboMetaLabel}>Expires</div>
          <div className="text-sm font-semibold">
            {daysLeft > 0 ? `In ${daysLeft} days` : 'Expired'}
          </div>
        </div>
        <div className={styles.comboMetaItem}>
          <div className={styles.comboMetaLabel}>Valid Until</div>
          <div className="text-sm font-semibold">{combo.validUntil}</div>
        </div>
        <div className={styles.comboMetaItem}>
          <div className={styles.comboMetaLabel}>Vehicle</div>
          <div className="text-sm font-mono font-semibold">{combo.linkedVehiclePlate}</div>
        </div>
      </div>

      <div className={styles.comboCodeBox}>
        <span className="text-xs font-semibold uppercase opacity-60">Combo Code</span>
        <span>{combo.comboCode}</span>
      </div>
    </div>
  );
}
