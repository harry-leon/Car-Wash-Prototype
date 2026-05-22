import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { Booking, BookingSelection, PaymentMethod } from "../types/booking.types";
import { getUsableVouchers, useCustomerBooking } from "../routes";
import { BookingTimePicker } from "./BookingTimePicker";
import styles from "../styles/booking.module.css";

function getTomorrowDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

const paymentMethods: Array<{
  value: PaymentMethod;
  label: string;
  description: string;
}> = [
  {
    value: "CASH_AT_COUNTER",
    label: "Cash at counter",
    description: "Pay when you arrive. Booking status stays confirmed.",
  },
  {
    value: "BANK_TRANSFER",
    label: "Bank transfer",
    description: "Mock online payment. Marked as paid immediately.",
  },
  {
    value: "E_WALLET",
    label: "E-wallet mock",
    description: "Demo wallet payment without a real gateway.",
  },
];

const singleSteps = ["Vehicle", "Package", "Schedule", "Voucher", "Payment", "Summary"] as const;
const comboSteps = ["Combo", "Schedule", "Summary"] as const;

export function BookingForm() {
  const {
    activeCombo,
    bookingDraft,
    bookings,
    clearBookingDraft,
    comboPackages,
    confirmBooking,
    customer,
    language,
    serviceAddons,
    servicePackages,
    vehicles,
    vouchers,
  } = useCustomerBooking();
  const defaultVehicle = vehicles.find((vehicle) => vehicle.isDefault) ?? vehicles[0];
  const activeComboPackage = activeCombo
    ? comboPackages.find((comboPackage) => comboPackage.id === activeCombo.comboPackageId)
    : undefined;
  const comboVehicle = activeCombo
    ? vehicles.find((vehicle) => vehicle.id === activeCombo.linkedVehicleId)
    : undefined;
  const comboPackage =
    activeComboPackage?.packageIds
      .map((packageId) => servicePackages.find((servicePackage) => servicePackage.id === packageId))
      .find(Boolean) ?? servicePackages[0];
  const initialMode =
    bookingDraft.useActiveCombo || bookingDraft.mode === "COMBO" ? "COMBO" : "SINGLE_PACKAGE";
  const [selection, setSelection] = useState<BookingSelection>({
    mode: initialMode,
    vehicleId:
      initialMode === "COMBO"
        ? (comboVehicle?.id ?? defaultVehicle?.id ?? "")
        : (bookingDraft.vehicleId ?? defaultVehicle?.id ?? ""),
    packageId:
      initialMode === "COMBO"
        ? (comboPackage?.id ?? "")
        : (bookingDraft.packageId ?? servicePackages[0]?.id ?? ""),
    scheduledDate: bookingDraft.scheduledDate ?? getTomorrowDate(),
    scheduledTime: bookingDraft.scheduledTime ?? "10:30",
    voucherId: bookingDraft.voucherId ?? "",
    addonIds: bookingDraft.addonIds ?? [],
    comboUpgradePackageId: bookingDraft.comboUpgradePackageId,
    comboUpgradeAmount: bookingDraft.comboUpgradeAmount,
    paymentMethod: bookingDraft.paymentMethod ?? "",
    useActiveCombo: initialMode === "COMBO",
  });
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [manualVoucherCode, setManualVoucherCode] = useState("");
  const [error, setError] = useState("");
  const copy =
    language === "vi"
      ? {
          single: "Đặt gói lẻ",
          combo: "Đặt bằng combo",
          selectVehicle: "Chọn xe",
          vehicle: "Xe",
          ready: "sẵn sàng đặt lịch",
          selectPackage: "Chọn gói rửa và dịch vụ thêm",
          package: "Gói rửa",
          addons: "Dịch vụ đã chọn",
          voucher: "Áp dụng một voucher",
          manualVoucher: "Mã voucher",
          enterVoucher: "Nhập mã voucher",
          applyCode: "Áp dụng",
          noVoucher: "Không dùng voucher",
          noVoucherHint: "Thanh toán theo số tiền tiêu chuẩn.",
          payment: "Chọn phương thức thanh toán",
          summary: "Tóm tắt đặt lịch",
          confirm: "Xác nhận đặt lịch",
          success: "Thanh toán thành công",
          history: "Xem lịch sử",
          home: "Về trang chủ",
          none: "Không có",
          comboCredit: "Lượt combo",
          activeCombo: "Đặt bằng combo đang dùng",
          noCombo: "Không có combo hợp lệ.",
          emptyTitle: "Chưa có xe",
          emptyText: "Thêm xe trước khi tạo lịch rửa.",
          addVehicle: "Thêm xe",
        }
      : {
          single: "Single wash booking",
          combo: "Book with active combo",
          selectVehicle: "Select vehicle",
          vehicle: "Vehicle",
          ready: "ready for booking",
          selectPackage: "Select wash package and add-ons",
          package: "Wash package",
          addons: "Selected add-ons",
          voucher: "Apply one voucher",
          manualVoucher: "Manual voucher code",
          enterVoucher: "Enter voucher code",
          applyCode: "Apply code",
          noVoucher: "No voucher",
          noVoucherHint: "Use the standard checkout amount.",
          payment: "Select payment method",
          summary: "Booking summary",
          confirm: "Confirm booking",
          success: "Payment success",
          history: "View booking history",
          home: "Back home",
          none: "None",
          comboCredit: "Combo credit",
          activeCombo: "Active combo booking",
          noCombo: "No eligible active combo is available.",
          emptyTitle: "No vehicles yet",
          emptyText: "Add a vehicle before creating a booking.",
          addVehicle: "Add vehicle",
        };

  const isComboBooking = selection.mode === "COMBO";
  const selectedVehicle = isComboBooking
    ? comboVehicle
    : vehicles.find((vehicle) => vehicle.id === selection.vehicleId);
  const selectedPackage = isComboBooking
    ? comboPackage
    : (servicePackages.find((servicePackage) => servicePackage.id === selection.packageId) ??
      servicePackages[0]);
  const selectedAddons = useMemo(
    () =>
      isComboBooking ? [] : serviceAddons.filter((addon) => selection.addonIds.includes(addon.id)),
    [isComboBooking, selection.addonIds, serviceAddons],
  );
  const availableVouchers = isComboBooking ? [] : getUsableVouchers(vouchers, customer);
  const selectedVoucher = availableVouchers.find((voucher) => voucher.id === selection.voucherId);
  const addOnTotal = selectedAddons.reduce((total, addon) => total + addon.price, 0);
  const addOnDuration = selectedAddons.reduce((total, addon) => total + addon.durationMinutes, 0);
  const comboUpgradeAmount = isComboBooking ? 0 : (selection.comboUpgradeAmount ?? 0);
  const comboUpgradeName =
    !isComboBooking && selection.comboUpgradePackageId
      ? comboPackages.find(
          (comboPackageItem) => comboPackageItem.id === selection.comboUpgradePackageId,
        )?.name
      : undefined;
  const baseTotal = (selectedPackage?.price ?? 0) + addOnTotal + comboUpgradeAmount;
  const voucherDiscount =
    selectedVoucher && !isComboBooking ? Math.min(selectedVoucher.discountAmount, baseTotal) : 0;
  const finalAmount = isComboBooking ? 0 : Math.max(0, baseTotal - voucherDiscount);
  const paymentStatus =
    finalAmount === 0 ||
    selection.paymentMethod === "BANK_TRANSFER" ||
    selection.paymentMethod === "E_WALLET"
      ? "PAID"
      : "PAY_AT_COUNTER";

  const summary = useMemo(() => {
    if (!selectedVehicle || !selectedPackage) {
      return null;
    }

    return {
      vehicleLabel: `${selectedVehicle.licensePlate} / ${selectedVehicle.brand} ${selectedVehicle.model}`,
      package: selectedPackage,
      scheduledDate: selection.scheduledDate,
      scheduledTime: selection.scheduledTime,
      originalPrice: isComboBooking ? 0 : selectedPackage.price,
      addOns: selectedAddons.map((addon) => ({
        addonId: addon.id,
        name: addon.name,
        price: addon.price,
        durationMinutes: addon.durationMinutes,
      })),
      addOnTotal,
      comboUpgradeAmount,
      comboUpgradeName,
      voucherId: selectedVoucher?.id,
      voucherCode: selectedVoucher?.code,
      voucherLabel: selectedVoucher?.label,
      voucherDiscount,
      paymentMethod: finalAmount > 0 ? selection.paymentMethod || undefined : undefined,
      paymentStatus,
      paidViaCombo: isComboBooking,
      finalAmount,
    };
  }, [
    addOnTotal,
    comboUpgradeAmount,
    comboUpgradeName,
    finalAmount,
    isComboBooking,
    paymentStatus,
    selectedAddons,
    selectedPackage,
    selectedVehicle,
    selectedVoucher,
    selection.paymentMethod,
    selection.scheduledDate,
    selection.scheduledTime,
    voucherDiscount,
  ]);

  const updateSelection = (patch: Partial<BookingSelection>) => {
    setSelection((current) => ({ ...current, ...patch }));
    setError("");
  };

  const selectMode = (mode: BookingSelection["mode"]) => {
    const nextCombo = mode === "COMBO";

    updateSelection({
      mode,
      useActiveCombo: nextCombo,
      vehicleId: nextCombo ? (comboVehicle?.id ?? "") : (defaultVehicle?.id ?? ""),
      packageId: nextCombo ? (comboPackage?.id ?? "") : (servicePackages[0]?.id ?? ""),
      voucherId: "",
      addonIds: [],
      paymentMethod: nextCombo ? "" : selection.paymentMethod,
    });
  };

  const toggleAddon = (addonId: string) => {
    setSelection((current) => {
      const selected = current.addonIds.includes(addonId);

      return {
        ...current,
        addonIds: selected
          ? current.addonIds.filter((currentAddonId) => currentAddonId !== addonId)
          : [...current.addonIds, addonId],
      };
    });
    setError("");
  };

  const applyManualVoucher = () => {
    const normalizedCode = manualVoucherCode.trim().toUpperCase();
    const voucher = availableVouchers.find((item) => item.code.toUpperCase() === normalizedCode);

    if (!voucher) {
      setError(
        "Voucher code is invalid, expired, already used, or not eligible for this customer.",
      );
      return;
    }

    updateSelection({ voucherId: voucher.id });
  };

  const handleConfirm = () => {
    if (
      !summary ||
      !selection.vehicleId ||
      !selection.packageId ||
      !selection.scheduledDate ||
      !selection.scheduledTime
    ) {
      setError("Please complete the booking details before confirming.");
      return;
    }

    if (isComboBooking && (!activeCombo || activeCombo.remainingUses <= 0)) {
      setError("Active combo is not eligible for booking.");
      return;
    }

    if (!isComboBooking && summary.finalAmount > 0 && !selection.paymentMethod) {
      setError("Please select one payment method before confirming.");
      return;
    }

    const result = confirmBooking(selection, summary);
    clearBookingDraft();
    setConfirmedBooking(result.booking);
  };

  const completedSteps = isComboBooking
    ? [
        Boolean(activeCombo && selectedVehicle && selectedPackage),
        Boolean(selection.scheduledDate && selection.scheduledTime),
        Boolean(summary),
      ]
    : [
        Boolean(selection.vehicleId),
        Boolean(selection.packageId),
        Boolean(selection.scheduledDate && selection.scheduledTime),
        true,
        finalAmount === 0 || Boolean(selection.paymentMethod),
        Boolean(summary),
      ];
  const stepLabels = isComboBooking ? comboSteps : singleSteps;
  const occupiedSlotKeys = bookings
    .filter((booking) => ["CONFIRMED", "CHECKED_IN", "IN_PROGRESS"].includes(booking.status))
    .map((booking) => `${booking.scheduledDate}|${booking.scheduledTime}`);

  if (confirmedBooking) {
    return (
      <section className={styles.successScreen}>
        <span>{copy.success}</span>
        <h1>{confirmedBooking.bookingCode}</h1>
        <div className={styles.successDetails}>
          <p>
            <b>Vehicle:</b> {confirmedBooking.vehicle.licensePlate}
          </p>
          <p>
            <b>Service:</b> {confirmedBooking.package.name}
          </p>
          <p>
            <b>Schedule:</b> {confirmedBooking.scheduledDate} {confirmedBooking.scheduledTime}
          </p>
          <p>
            <b>Voucher:</b>{" "}
            {confirmedBooking.payment.voucherCode
              ? `${confirmedBooking.payment.voucherCode} (-${confirmedBooking.payment.voucherDiscount.toLocaleString()} VND)`
              : copy.none}
          </p>
          <p>
            <b>Payment:</b> {confirmedBooking.payment.paymentMethod ?? copy.comboCredit} /{" "}
            {confirmedBooking.payment.paymentStatus}
          </p>
          <p>
            <b>Status:</b> {confirmedBooking.status}
          </p>
          <p>
            <b>Final amount:</b> {confirmedBooking.payment.finalAmount.toLocaleString()} VND
          </p>
        </div>
        <div className={styles.successActions}>
          <Link to="/customer/bookings">{copy.history}</Link>
          <Link to="/customer/home">{copy.home}</Link>
        </div>
      </section>
    );
  }

  if (vehicles.length === 0) {
    return (
      <section className={styles.emptyState}>
        <h1>{copy.emptyTitle}</h1>
        <p>{copy.emptyText}</p>
        <Link to="/customer/vehicles">{copy.addVehicle}</Link>
      </section>
    );
  }

  return (
    <div className={styles.bookingLayout}>
      <section className={styles.bookingPanel}>
        <div className={styles.modeSwitch} aria-label="Booking type">
          <button
            type="button"
            className={!isComboBooking ? styles.modeActive : styles.modeButton}
            onClick={() => selectMode("SINGLE_PACKAGE")}
          >
            {copy.single}
          </button>
          <button
            type="button"
            className={isComboBooking ? styles.modeActive : styles.modeButton}
            onClick={() => selectMode("COMBO")}
            disabled={!activeCombo || activeCombo.remainingUses <= 0}
          >
            {copy.combo}
          </button>
        </div>

        <div className={styles.stepper} aria-label="Booking progress">
          {stepLabels.map((step, index) => (
            <span
              key={step}
              className={completedSteps[index] ? styles.stepperDone : styles.stepperItem}
            >
              <b>{index + 1}</b>
              {step}
            </span>
          ))}
        </div>

        {isComboBooking ? (
          <div className={styles.stepBlock}>
            <span className={styles.stepLabel}>Step 1</span>
            <h2>{copy.activeCombo}</h2>
            {activeCombo && selectedVehicle && selectedPackage ? (
              <div className={styles.comboBookingBox}>
                <strong>{activeCombo.comboName}</strong>
                <span>{selectedVehicle.licensePlate}</span>
                <p>
                  Includes {activeComboPackage?.packageIds.length ?? 1} service option(s),{" "}
                  {activeCombo.remainingUses} of {activeCombo.totalUses} uses remaining. Valid until{" "}
                  {activeCombo.validUntil}.
                </p>
                <small>{selectedPackage.name} / Final amount 0 VND</small>
              </div>
            ) : (
              <p className={styles.warningText}>{copy.noCombo}</p>
            )}
          </div>
        ) : (
          <>
            <div className={styles.stepBlock}>
              <span className={styles.stepLabel}>Step 1</span>
              <h2>{copy.selectVehicle}</h2>
              <label className={styles.field}>
                <span>{copy.vehicle}</span>
                <select
                  value={selection.vehicleId}
                  onChange={(event) => updateSelection({ vehicleId: event.target.value })}
                >
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.licensePlate} - {vehicle.brand} {vehicle.model}
                      {vehicle.isDefault ? " (default)" : ""}
                    </option>
                  ))}
                </select>
                {selectedVehicle ? (
                  <small>
                    {selectedVehicle.vehicleType} / {selectedVehicle.color} / {copy.ready}
                  </small>
                ) : null}
              </label>
            </div>

            <div className={styles.stepBlock}>
              <span className={styles.stepLabel}>Step 2</span>
              <h2>{copy.selectPackage}</h2>
              <label className={styles.field}>
                <span>{copy.package}</span>
                <select
                  value={selection.packageId}
                  onChange={(event) => updateSelection({ packageId: event.target.value })}
                >
                  {servicePackages.map((servicePackage) => (
                    <option key={servicePackage.id} value={servicePackage.id}>
                      {servicePackage.name} - {servicePackage.price.toLocaleString()} VND /{" "}
                      {servicePackage.durationMinutes} min
                    </option>
                  ))}
                </select>
                {selectedPackage ? (
                  <small>
                    {selectedPackage.recommendedFor}. {selectedPackage.description}
                  </small>
                ) : null}
              </label>
              <div className={styles.addonList}>
                {serviceAddons.map((addon) => {
                  const checked = selection.addonIds.includes(addon.id);

                  return (
                    <label
                      key={addon.id}
                      className={checked ? styles.addonOptionSelected : styles.addonOption}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAddon(addon.id)}
                      />
                      <span>
                        <b>{addon.name}</b>
                        <small>{addon.description}</small>
                      </span>
                      <em>
                        +{addon.price.toLocaleString()} VND / {addon.durationMinutes}m
                      </em>
                    </label>
                  );
                })}
              </div>
              <div className={styles.addonTotal}>
                <span>{copy.addons}</span>
                <strong>
                  {addOnTotal.toLocaleString()} VND / +{addOnDuration} min
                </strong>
              </div>
            </div>
          </>
        )}

        <div className={styles.stepBlock}>
          <span className={styles.stepLabel}>{isComboBooking ? "Step 2" : "Step 3"}</span>
          <BookingTimePicker
            date={selection.scheduledDate}
            occupiedSlotKeys={occupiedSlotKeys}
            time={selection.scheduledTime}
            onDateChange={(scheduledDate) => updateSelection({ scheduledDate })}
            onTimeChange={(scheduledTime) => updateSelection({ scheduledTime })}
          />
        </div>

        {!isComboBooking ? (
          <>
            <div className={styles.stepBlock}>
              <span className={styles.stepLabel}>Step 4</span>
              <h2>{copy.voucher}</h2>
              <div className={styles.manualVoucher}>
                <label className={styles.field}>
                  <span>{copy.manualVoucher}</span>
                  <input
                    value={manualVoucherCode}
                    onChange={(event) => setManualVoucherCode(event.target.value)}
                    placeholder={copy.enterVoucher}
                  />
                </label>
                <button type="button" onClick={applyManualVoucher}>
                  {copy.applyCode}
                </button>
              </div>
              <div className={styles.promoGrid}>
                <button
                  type="button"
                  className={!selection.voucherId ? styles.promoCardActive : styles.promoCard}
                  onClick={() => updateSelection({ voucherId: "" })}
                >
                  <strong>{copy.noVoucher}</strong>
                  <span>{copy.noVoucherHint}</span>
                </button>
                {availableVouchers.map((voucher) => {
                  const selected = selection.voucherId === voucher.id;

                  return (
                    <button
                      key={voucher.id}
                      type="button"
                      className={selected ? styles.promoCardActive : styles.promoCard}
                      onClick={() => updateSelection({ voucherId: voucher.id })}
                    >
                      <strong>{voucher.code}</strong>
                      <span>{voucher.label}</span>
                      <small>
                        -{voucher.discountAmount.toLocaleString()} VND / until {voucher.expiresAt}
                      </small>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={styles.stepBlock}>
              <span className={styles.stepLabel}>Step 5</span>
              <h2>{copy.payment}</h2>
              <div className={styles.paymentGrid}>
                {paymentMethods.map((method) => (
                  <button
                    key={method.value}
                    type="button"
                    className={
                      selection.paymentMethod === method.value
                        ? styles.paymentCardActive
                        : styles.paymentCard
                    }
                    onClick={() => updateSelection({ paymentMethod: method.value })}
                  >
                    <strong>{method.label}</strong>
                    <span>{method.description}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </section>

      <aside className={styles.summaryPanel}>
        <span className={styles.stepLabel}>{isComboBooking ? "Step 3" : "Step 6"}</span>
        <h2>{copy.summary}</h2>
        {summary ? (
          <dl className={styles.summaryList}>
            <div>
              <dt>Booking type</dt>
              <dd>{summary.paidViaCombo ? "Active combo" : "Single wash"}</dd>
            </div>
            <div>
              <dt>Vehicle</dt>
              <dd>{summary.vehicleLabel}</dd>
            </div>
            <div>
              <dt>Package</dt>
              <dd>{summary.package.name}</dd>
            </div>
            <div>
              <dt>Date & time</dt>
              <dd>
                {summary.scheduledDate} {summary.scheduledTime}
              </dd>
            </div>
            <div>
              <dt>Package price</dt>
              <dd>{summary.originalPrice.toLocaleString()} VND</dd>
            </div>
            <div>
              <dt>Add-ons</dt>
              <dd>
                {summary.addOns.length > 0
                  ? `${summary.addOns.length} selected / ${summary.addOnTotal.toLocaleString()} VND`
                  : copy.none}
              </dd>
            </div>
            {summary.comboUpgradeAmount > 0 ? (
              <div>
                <dt>Combo upgrade</dt>
                <dd>
                  {summary.comboUpgradeName ?? "Selected combo"} /{" "}
                  {summary.comboUpgradeAmount.toLocaleString()} VND
                </dd>
              </div>
            ) : null}
            <div>
              <dt>Voucher</dt>
              <dd>
                {summary.voucherCode
                  ? `${summary.voucherCode} / -${summary.voucherDiscount.toLocaleString()} VND`
                  : "None"}
              </dd>
            </div>
            <div>
              <dt>Payment method</dt>
              <dd>{summary.paymentMethod ?? copy.comboCredit}</dd>
            </div>
            <div>
              <dt>Payment status</dt>
              <dd>{summary.paymentStatus}</dd>
            </div>
            <div className={styles.finalAmount}>
              <dt>Final Amount</dt>
              <dd>{summary.finalAmount.toLocaleString()} VND</dd>
            </div>
          </dl>
        ) : null}
        {error ? <p className={styles.warningText}>{error}</p> : null}
        <button className={styles.confirmButton} type="button" onClick={handleConfirm}>
          {copy.confirm}
        </button>
      </aside>
    </div>
  );
}
