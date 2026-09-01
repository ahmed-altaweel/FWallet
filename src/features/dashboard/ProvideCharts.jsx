
import { useMemo } from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";
import "./dashboard.style.css";

const DEFAULT_COLORS = [
  "#6b8aab",
  "#4A6FA5",
  "#8FA7C4",
  "#324A66",
  "#B9C6D6",
];

const DEFAULT_DATA = [
  { name: "الكريمي", value: 1200 },
  { name: "جيب", value: 600 },
  { name: "كاش", value: 200 },
];

function withColors(data, palette) {
  return data.map((entry, index) => ({
    ...entry,
    fill: entry.fill ?? palette[index % palette.length],
  }));
}

function formatPercent(value, total) {
  return total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
}

function CustomTooltip({ active, payload, total }) {
  if (!active || !payload?.length) return null;

  const { name, value, fill } = payload[0].payload;

  return (
    <div className="provider-chart__tooltip">
      <span
        className="provider-chart__dot"
        style={{ backgroundColor: fill }}
      />

      <span className="provider-chart__tooltip-name">
        {name}
      </span>

      <span className="provider-chart__tooltip-value">
        {value.toLocaleString()} · {formatPercent(value, total)}%
      </span>
    </div>
  );
}
function renderCustomLabel({ cx, cy, midAngle, outerRadius, percent }) {
  const RADIAN = Math.PI / 180;
  const labelRadius = outerRadius + 18; // نفس منطقك الأصلي: نصف قطر أبعد من الحلقة

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
export function ProviderChart({
  data: rawData = DEFAULT_DATA,
  colors = DEFAULT_COLORS,
  title = "Provider distribution",
}) {
  const data = useMemo(
    () => withColors(rawData, colors),
    [rawData, colors]
  );

  const total = useMemo(
    () => data.reduce((sum, item) => sum + item.value, 0),
    [data]
  );

  const summary = data
    .map((item) => `${item.name} ${formatPercent(item.value, total)}%`)
    .join(", ");

  return (
    <div className="provider-chart">
      {title && (
        <h3 className="provider-chart__title">
          {title}
        </h3>
      )}

      <div className="provider-chart__body">
        <div
          className="provider-chart__chart-wrap"
          role="img"
          aria-label={`Pie chart of provider distribution: ${summary}`}
        >
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={95}
                paddingAngle={2}
                stroke="none"
                labelLine={false}
                label={renderCustomLabel}
  isAnimationActive={false}
              
              />
 
              <Tooltip
                content={
                  <CustomTooltip total={total} />
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <ul className="provider-chart__legend">
          {data.map((item) => (
            <li
              key={item.name}
              className="provider-chart__legend-item"
            >
              <span
                className="provider-chart__dot"
                style={{ backgroundColor: item.fill }}
              />

              <span className="provider-chart__legend-name">
                {item.name}
              </span>

              <span className="provider-chart__legend-value">
                {item.value.toLocaleString()}
              </span>

              <span className="provider-chart__legend-percent">
                {formatPercent(item.value, total)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

