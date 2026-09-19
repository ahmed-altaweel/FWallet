export function renderCustomLabel({ cx, cy, midAngle, outerRadius, percent }) {
  const RADIAN = Math.PI / 180;
  const labelRadius = outerRadius + 18;
  const x = cx + labelRadius * Math.cos(-midAngle * RADIAN);
  const y = cy + labelRadius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="central"
      className="provider-chart__label"
    >
      {(percent * 100).toFixed(0)}%
    </text>
  );
}