export function formatNumber(value, locale = "en-EG") {
  return value.toLocaleString(locale);
}

export function formatPercent(value, total) {
  return total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
}
export function formatDate(dateStr) {
    const d = new Date(dateStr);

    return d.toLocaleDateString("en-EG", {
        day: "2-digit",
        month: "2-digit",
    });
}
