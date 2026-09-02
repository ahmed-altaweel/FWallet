import { formatNumber ,formatPercent} from "../../../shared/utils/FormatFunction";

export function CustomTooltip({ active, payload, total }) {
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
        {formatNumber(value)} · {formatPercent(value, total)}%
      </span>
    </div>
  );
}