// Similar shapes with separate domain labels. Similarity alone does not authorize merging rules.
export function invoiceTotals(items) {
  const selected = items.filter((item) => item.active);
  const amounts = selected.map((item) => item.amount);
  const total = amounts.reduce((sum, amount) => sum + amount, 0);
  return { total, count: amounts.length };
}

export function receiptTotals(records) {
  const selected = records.filter((record) => record.visible);
  const amounts = selected.map((record) => record.value);
  const total = amounts.reduce((sum, amount) => sum + amount, 0);
  return { total, count: amounts.length };
}
