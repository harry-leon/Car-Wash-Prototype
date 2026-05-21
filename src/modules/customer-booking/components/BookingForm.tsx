import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCustomerBooking } from '../context/CustomerBookingContext';
import { mockPromotions } from '../mock/booking.mock';
import type { BookingFormState, Booking, Promotion } from '../types/booking.types';
import type { Vehicle } from '../types/vehicle.types';
import type { ServicePackage, MembershipTier } from '../types/customer.types';
import styles from '../styles/booking.module.css';

/* ── helpers ── */
function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 8; h <= 18; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    if (h < 18) slots.push(`${String(h).padStart(2, '0')}:30`);
  }
  return slots;
}

function getTomorrowISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function isPromoApplicable(promo: Promotion, tier: MembershipTier): boolean {
  if (promo.applicableTiers === 'ALL') return true;
  if (promo.applicableTiers === 'NEW_CUSTOMER') return false;
  return promo.applicableTiers.includes(tier);
}

/* ── Main Component ── */
export function BookingForm() {
  const navigate = useNavigate();
  const { customer, setCustomer, activeCombo, vehicles, servicePackages, addBooking } =
    useCustomerBooking();

  const [step, setStep] = useState(1);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  const [form, setForm] = useState<BookingFormState>({
    vehicleId: '',
    packageId: '',
    scheduledDate: '',
    scheduledTime: '',
    promotionId: undefined,
    useCombo: false,
    redeemPoints: 0,
  });

  const timeSlots = useMemo(generateTimeSlots, []);
  const minDate = useMemo(getTomorrowISO, []);

  const selectedVehicle = vehicles.find((v) => v.id === form.vehicleId);
  const selectedPackage = servicePackages.find((p) => p.id === form.packageId);

  const applicablePromotions = useMemo(
    () => mockPromotions.filter((p) => isPromoApplicable(p, customer.tier)),
    [customer.tier],
  );
  const selectedPromo = applicablePromotions.find((p) => p.id === form.promotionId);

  const comboEligible = useMemo(() => {
    if (!activeCombo) return false;
    if (activeCombo.status !== 'ACTIVE') return false;
    if (activeCombo.remainingUses <= 0) return false;
    if (!selectedVehicle) return false;
    return selectedVehicle.licensePlate === activeCombo.linkedVehiclePlate;
  }, [activeCombo, selectedVehicle]);

  /* ── calculations ── */
  const promoDiscount = useMemo(() => {
    if (!selectedPromo || !selectedPackage) return 0;
    if (selectedPromo.discountType === 'PERCENT') {
      return Math.round(selectedPackage.price * (selectedPromo.discountValue / 100));
    }
    return selectedPromo.discountValue;
  }, [selectedPromo, selectedPackage]);

  const pointsDiscount = form.redeemPoints * 100; // 1 point = 100 VND
  const finalAmount = Math.max(
    0,
    (selectedPackage?.price ?? 0) - promoDiscount - pointsDiscount,
  );

  /* ── step validation ── */
  const canProceed = useCallback((): boolean => {
    switch (step) {
      case 1: return !!form.vehicleId;
      case 2: return !!form.packageId;
      case 3: return !!form.scheduledDate && !!form.scheduledTime;
      case 4: return true; // optional
      case 5: return true; // optional
      case 6: return true;
      default: return false;
    }
  }, [step, form]);

  const handleNext = () => {
    if (canProceed() && step < 6) setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleConfirm = () => {
    if (!selectedVehicle || !selectedPackage) return;
    const bookingId = `BK-${Date.now().toString(36).toUpperCase()}`;
    const scheduledAt = `${form.scheduledDate}T${form.scheduledTime}:00`;

    const booking: Booking = {
      id: bookingId,
      customerId: customer.id,
      vehicleId: selectedVehicle.id,
      vehiclePlate: selectedVehicle.licensePlate,
      packageId: selectedPackage.id,
      packageName: selectedPackage.name,
      packagePrice: selectedPackage.price,
      scheduledAt,
      status: 'CONFIRMED',
      promotionId: selectedPromo?.id,
      promotionName: selectedPromo?.name,
      promotionDiscount: promoDiscount,
      redeemPoints: form.redeemPoints,
      pointsDiscount,
      usedComboId: form.useCombo ? activeCombo?.id : undefined,
      usedComboName: form.useCombo ? activeCombo?.comboName : undefined,
      finalAmount,
      createdAt: new Date().toISOString(),
    };

    addBooking(booking);

    // BR-POINT-02/03: Decrement available points only (not lifetime)
    if (form.redeemPoints > 0) {
      setCustomer((prev) => ({
        ...prev,
        availablePoints: prev.availablePoints - form.redeemPoints,
      }));
    }

    setConfirmedBookingId(bookingId);
  };

  /* ── STEP INDICATOR ── */
  const renderStepIndicator = () => (
    <div className={styles.stepIndicator}>
      {[1, 2, 3, 4, 5, 6].map((n, idx) => (
        <div key={n} style={{ display: 'flex', alignItems: 'center', flex: idx < 5 ? 1 : 'none' }}>
          <div
            className={`${styles.stepDot} ${
              step === n ? styles.stepDotActive : n < step ? styles.stepDotCompleted : ''
            }`}
          >
            {n < step ? '✓' : n}
          </div>
          {idx < 5 && (
            <div className={`${styles.stepLine} ${n < step ? styles.stepLineCompleted : ''}`} />
          )}
        </div>
      ))}
    </div>
  );

  /* ── SUCCESS SCREEN ── */
  if (confirmedBookingId) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successIcon}>✓</div>
        <h2 className={styles.successTitle}>Booking Confirmed!</h2>
        <p className="text-muted-foreground">Your booking has been created successfully.</p>
        <div className={styles.successBookingId}>{confirmedBookingId}</div>
        <Button className="mt-4" onClick={() => navigate({ to: '/customer/overview' })}>
          Back to Home
        </Button>
      </div>
    );
  }

  /* ── STEP RENDERERS ── */
  const renderSelectVehicle = () => (
    <div>
      <h3 className={styles.stepTitle}>Select Vehicle</h3>
      <div className={styles.selectableGrid}>
        {vehicles.map((v) => (
          <div
            key={v.id}
            className={`${styles.selectableCard} ${form.vehicleId === v.id ? styles.selectableCardSelected : ''}`}
            onClick={() => setForm((f) => ({ ...f, vehicleId: v.id }))}
          >
            {form.vehicleId === v.id && <div className={styles.selectableCardCheck}>✓</div>}
            <div className="font-mono font-bold text-sm">{v.licensePlate}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {v.brand} {v.model}
            </div>
            {v.isDefault && (
              <Badge variant="outline" className="mt-2 text-xs border-primary/40 text-primary">
                Default
              </Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderSelectPackage = () => (
    <div>
      <h3 className={styles.stepTitle}>Select Service Package</h3>
      <div className={styles.selectableGrid}>
        {servicePackages.map((pkg: ServicePackage) => (
          <div
            key={pkg.id}
            className={`${styles.selectableCard} ${form.packageId === pkg.id ? styles.selectableCardSelected : ''}`}
            onClick={() => setForm((f) => ({ ...f, packageId: pkg.id }))}
          >
            {form.packageId === pkg.id && <div className={styles.selectableCardCheck}>✓</div>}
            <div className="font-bold">{pkg.name}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{pkg.description}</div>
            <div className="text-base font-extrabold text-primary mt-2">{formatVND(pkg.price)}</div>
            <div className="text-xs text-muted-foreground">~{pkg.durationMinutes} min</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDateTime = () => (
    <div>
      <h3 className={styles.stepTitle}>Select Date &amp; Time</h3>
      <div className={styles.dateTimeGrid}>
        <div className={styles.dateTimeField}>
          <label htmlFor="bk-date">Date</label>
          <input
            id="bk-date"
            type="date"
            min={minDate}
            value={form.scheduledDate}
            onChange={(e) => setForm((f) => ({ ...f, scheduledDate: e.target.value }))}
            required
          />
        </div>
        <div className={styles.dateTimeField}>
          <label htmlFor="bk-time">Time</label>
          <select
            id="bk-time"
            value={form.scheduledTime}
            onChange={(e) => setForm((f) => ({ ...f, scheduledTime: e.target.value }))}
            required
          >
            <option value="">Select time…</option>
            {timeSlots.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const renderPromotion = () => (
    <div>
      <h3 className={styles.stepTitle}>Select Promotion (Optional)</h3>
      {applicablePromotions.length === 0 && (
        <p className="text-sm text-muted-foreground">No promotions available for your tier.</p>
      )}
      <div className={styles.selectableGrid}>
        {applicablePromotions.map((promo) => (
          <div
            key={promo.id}
            className={`${styles.selectableCard} ${form.promotionId === promo.id ? styles.selectableCardSelected : ''}`}
            onClick={() =>
              setForm((f) => ({
                ...f,
                promotionId: f.promotionId === promo.id ? undefined : promo.id,
              }))
            }
          >
            {form.promotionId === promo.id && <div className={styles.selectableCardCheck}>✓</div>}
            <div className="font-bold">{promo.name}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {promo.discountType === 'PERCENT'
                ? `${promo.discountValue}% off`
                : `${formatVND(promo.discountValue)} off`}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Valid until {promo.validUntil}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderComboAndPoints = () => (
    <div>
      <h3 className={styles.stepTitle}>Use Combo / Redeem Points (Optional)</h3>

      {comboEligible && activeCombo && (
        <div className={styles.optionRow}>
          <input
            id="bk-combo"
            type="checkbox"
            checked={form.useCombo}
            onChange={(e) => setForm((f) => ({ ...f, useCombo: e.target.checked }))}
          />
          <label htmlFor="bk-combo" className="text-sm font-medium">
            Use my active combo — <strong>{activeCombo.comboName}</strong>{' '}
            ({activeCombo.remainingUses} uses left)
          </label>
        </div>
      )}

      <div className={styles.optionRow}>
        <label htmlFor="bk-points" className="text-sm font-medium">
          Redeem points (max {customer.availablePoints})
        </label>
        <input
          id="bk-points"
          type="number"
          className={styles.pointsInput}
          min={0}
          max={customer.availablePoints}
          value={form.redeemPoints}
          onChange={(e) => {
            const val = Math.min(
              Math.max(0, parseInt(e.target.value) || 0),
              customer.availablePoints,
            );
            setForm((f) => ({ ...f, redeemPoints: val }));
          }}
        />
        {form.redeemPoints > 0 && (
          <span className="text-xs text-muted-foreground">
            = {formatVND(form.redeemPoints * 100)} discount
          </span>
        )}
      </div>
    </div>
  );

  const renderSummary = () => (
    <div>
      <h3 className={styles.stepTitle}>Booking Summary</h3>
      <div className={styles.summaryCard}>
        <div className={styles.summaryRow}>
          <span className="text-muted-foreground">Vehicle</span>
          <span className="font-mono font-semibold">{selectedVehicle?.licensePlate}</span>
        </div>
        <div className={styles.summaryRow}>
          <span className="text-muted-foreground">Package</span>
          <span className="font-semibold">{selectedPackage?.name}</span>
        </div>
        <div className={styles.summaryRow}>
          <span className="text-muted-foreground">Date &amp; Time</span>
          <span className="font-semibold">
            {form.scheduledDate} at {form.scheduledTime}
          </span>
        </div>
        <div className={styles.summaryRow}>
          <span className="text-muted-foreground">Package Price</span>
          <span className="font-semibold">{formatVND(selectedPackage?.price ?? 0)}</span>
        </div>
        {selectedPromo && (
          <div className={styles.summaryRow}>
            <span className="text-muted-foreground">
              Promotion: {selectedPromo.name}
            </span>
            <span className={`font-semibold ${styles.summaryDiscount}`}>
              -{formatVND(promoDiscount)}
            </span>
          </div>
        )}
        {form.redeemPoints > 0 && (
          <div className={styles.summaryRow}>
            <span className="text-muted-foreground">
              Points Redeemed ({form.redeemPoints} pts)
            </span>
            <span className={`font-semibold ${styles.summaryDiscount}`}>
              -{formatVND(pointsDiscount)}
            </span>
          </div>
        )}
        {form.useCombo && activeCombo && (
          <div className={styles.summaryRow}>
            <span className="text-muted-foreground">Combo Used</span>
            <span className="font-semibold">{activeCombo.comboName}</span>
          </div>
        )}
        <div className={`${styles.summaryRow} ${styles.summaryRowTotal}`}>
          <span>Total</span>
          <span>{formatVND(finalAmount)}</span>
        </div>
      </div>
    </div>
  );

  const stepContent: Record<number, () => React.ReactNode> = {
    1: renderSelectVehicle,
    2: renderSelectPackage,
    3: renderDateTime,
    4: renderPromotion,
    5: renderComboAndPoints,
    6: renderSummary,
  };

  return (
    <div>
      {renderStepIndicator()}
      <p className="text-sm text-muted-foreground mb-4 text-center">Step {step} of 6</p>
      <div className={styles.stepContent}>{stepContent[step]?.()}</div>
      <div className={styles.navRow} style={{ maxWidth: 640, margin: '2rem auto 0' }}>
        <Button variant="outline" onClick={handleBack} disabled={step === 1}>
          Back
        </Button>
        {step < 6 ? (
          <Button onClick={handleNext} disabled={!canProceed()}>
            {step === 4 || step === 5 ? 'Next (or Skip)' : 'Next'}
          </Button>
        ) : (
          <Button onClick={handleConfirm}>Confirm Booking</Button>
        )}
      </div>
    </div>
  );
}
