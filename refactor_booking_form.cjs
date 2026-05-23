const fs = require("fs");

const file = "src/modules/customer-booking/components/BookingForm.tsx";
let content = fs.readFileSync(file, "utf8");

// 1. Add currentStep state
content = content.replace(
  "const [selection, setSelection] = useState<BookingSelection>({",
  "const [currentStep, setCurrentStep] = useState(0);\n  const [selection, setSelection] = useState<BookingSelection>({",
);

// 2. Change stepLabels and singleSteps/comboSteps
content = content.replace(
  'const singleSteps = ["Vehicle", "Package", "Schedule", "Voucher", "Payment", "Summary"] as const;\nconst comboSteps = ["Combo", "Schedule", "Summary"] as const;',
  'const stepLabels = ["Type", "Information", "Summary", "Confirm"];',
);

// 3. Remove completedSteps and stepLabels dynamic assignments
content = content.replace(
  /const completedSteps = isComboBooking[\s\S]*?const stepLabels = isComboBooking \? comboSteps : singleSteps;/m,
  `
  const completedSteps = [
    true, // Type is always selected
    isComboBooking
      ? Boolean(activeCombo && selectedVehicle && selectedPackage && selection.scheduledDate && selection.scheduledTime)
      : Boolean(selection.vehicleId && selection.packageId && selection.scheduledDate && selection.scheduledTime && (finalAmount === 0 || selection.paymentMethod)),
    Boolean(summary),
    Boolean(confirmedBooking)
  ];
`,
);

// 4. Update the render logic:
// We need to change the UI to show steps one by one.
const oldRenderMatch = content.match(
  /<div className=\{styles\.bookingLayout\}>[\s\S]*?<\/div>\n  \);\n}/,
);
if (oldRenderMatch) {
  let newRender = `
    <div className={styles.bookingLayout} style={{ display: 'block', maxWidth: '800px', margin: '0 auto' }}>
      <div className={styles.stepper} aria-label="Booking progress" style={{ marginBottom: '24px' }}>
        {stepLabels.map((step, index) => (
          <span
            key={step}
            className={currentStep === index ? styles.stepperActive || styles.stepperDone : (completedSteps[index] ? styles.stepperDone : styles.stepperItem)}
            onClick={() => {
              if (completedSteps[index] || index <= currentStep) setCurrentStep(index);
            }}
            style={{ cursor: (completedSteps[index] || index <= currentStep) ? 'pointer' : 'default', opacity: (index > currentStep && !completedSteps[index]) ? 0.5 : 1 }}
          >
            <b>{index + 1}</b>
            {step}
          </span>
        ))}
      </div>

      <section className={styles.bookingPanel} style={{ border: 'none', boxShadow: 'none', background: 'transparent' }}>
        {currentStep === 0 && (
          <div className={styles.stepBlock} style={{ background: 'var(--cb-surface)', borderRadius: '16px', border: '1px solid var(--cb-border)', padding: '24px', boxShadow: 'var(--cb-shadow)' }}>
            <h2 style={{ marginBottom: '16px' }}>{copy.single ? "Chọn loại booking" : "Select booking type"}</h2>
            <div className={styles.modeSwitch} aria-label="Booking type" style={{ border: 'none', padding: 0 }}>
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
            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <button className={styles.confirmButton} style={{ width: 'auto', padding: '0 24px', minHeight: '44px' }} type="button" onClick={() => setCurrentStep(1)}>
                Next
              </button>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div style={{ display: 'grid', gap: '16px' }}>
            {isComboBooking ? (
              <div className={styles.stepBlock} style={{ background: 'var(--cb-surface)', borderRadius: '16px', border: '1px solid var(--cb-border)', padding: '24px' }}>
                <h2>{copy.activeCombo}</h2>
                {activeCombo && selectedVehicle && selectedPackage ? (
                  <div className={styles.comboBookingBox} style={{ marginTop: '16px' }}>
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
                  <p className={styles.warningText} style={{ marginTop: '16px' }}>{copy.noCombo}</p>
                )}
              </div>
            ) : (
              <>
                <div className={styles.stepBlock} style={{ background: 'var(--cb-surface)', borderRadius: '16px', border: '1px solid var(--cb-border)', padding: '24px' }}>
                  <h2>{copy.selectVehicle}</h2>
                  <label className={styles.field} style={{ marginTop: '16px' }}>
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

                <div className={styles.stepBlock} style={{ background: 'var(--cb-surface)', borderRadius: '16px', border: '1px solid var(--cb-border)', padding: '24px' }}>
                  <h2>{copy.selectPackage}</h2>
                  <label className={styles.field} style={{ marginTop: '16px' }}>
                    <span>{copy.package}</span>
                    <select
                      value={selection.packageId}
                      onChange={(event) => updateSelection({ packageId: event.target.value })}
                    >
                      {activeServicePackages.map((servicePackage) => (
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
                  <div className={styles.addonList} style={{ marginTop: '16px' }}>
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
                  <div className={styles.addonTotal} style={{ marginTop: '16px' }}>
                    <span>{copy.addons}</span>
                    <strong>
                      {addOnTotal.toLocaleString()} VND / +{addOnDuration} min
                    </strong>
                  </div>
                </div>
              </>
            )}

            <div className={styles.stepBlock} style={{ background: 'var(--cb-surface)', borderRadius: '16px', border: '1px solid var(--cb-border)', padding: '24px' }}>
              <h2 style={{ marginBottom: '16px' }}>Pick Date & Time</h2>
              <BookingTimePicker
                date={selection.scheduledDate}
                occupiedSlotKeys={occupiedSlotKeys}
                time={selection.scheduledTime}
                onDateChange={(scheduledDate) => updateSelection({ scheduledDate })}
                onTimeChange={(scheduledTime) => updateSelection({ scheduledTime })}
              />
            </div>

            {!isComboBooking && (
              <>
                <div className={styles.stepBlock} style={{ background: 'var(--cb-surface)', borderRadius: '16px', border: '1px solid var(--cb-border)', padding: '24px' }}>
                  <h2>{copy.voucher}</h2>
                  <div className={styles.manualVoucher} style={{ marginTop: '16px', marginBottom: '16px' }}>
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

                <div className={styles.stepBlock} style={{ background: 'var(--cb-surface)', borderRadius: '16px', border: '1px solid var(--cb-border)', padding: '24px' }}>
                  <h2>{copy.payment}</h2>
                  <div className={styles.paymentGrid} style={{ marginTop: '16px' }}>
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
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
              <button className={styles.modeButton} style={{ width: 'auto', padding: '0 24px' }} type="button" onClick={() => setCurrentStep(0)}>
                Back
              </button>
              <button 
                className={styles.confirmButton} 
                style={{ width: 'auto', padding: '0 24px', minHeight: '44px', opacity: !completedSteps[1] ? 0.5 : 1 }} 
                type="button" 
                onClick={() => { if(completedSteps[1]) setCurrentStep(2); }}
                disabled={!completedSteps[1]}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <aside className={styles.summaryPanel} style={{ border: 'none', padding: 0 }}>
            <div style={{ background: 'var(--cb-surface)', borderRadius: '16px', border: '1px solid var(--cb-border)', padding: '24px', boxShadow: 'var(--cb-shadow)' }}>
              <h2 style={{ marginBottom: '24px' }}>{copy.summary}</h2>
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
                        ? \`\${summary.addOns.length} selected / \${summary.addOnTotal.toLocaleString()} VND\`
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
                        ? \`\${summary.voucherCode} / -\${summary.voucherDiscount.toLocaleString()} VND\`
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
              {error ? <p className={styles.warningText} style={{ marginTop: '16px' }}>{error}</p> : null}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                <button className={styles.modeButton} style={{ width: 'auto', padding: '0 24px' }} type="button" onClick={() => setCurrentStep(1)}>
                  Back
                </button>
                <button className={styles.confirmButton} style={{ width: 'auto', padding: '0 24px' }} type="button" onClick={() => {
                  handleConfirm();
                  if (!error) setCurrentStep(3);
                }}>
                  {copy.confirm}
                </button>
              </div>
            </div>
          </aside>
        )}
      </section>
    </div>
  );
}`;
  content = content.replace(oldRenderMatch[0], newRender);
}

fs.writeFileSync(file, content);
console.log("Successfully refactored BookingForm.tsx");
