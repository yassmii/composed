// Illustrative requirement REQ-EX-CANCEL-001: at least 24 hours remain before the booking.
export function canCancel(hoursBeforeStart) {
  return Number.isFinite(hoursBeforeStart) && hoursBeforeStart >= 24;
}
