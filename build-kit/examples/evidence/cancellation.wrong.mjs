// Plausible boundary defect: an exact 24-hour cancellation is incorrectly refused.
export function canCancel(hoursBeforeStart) {
  return Number.isFinite(hoursBeforeStart) && hoursBeforeStart > 24;
}
