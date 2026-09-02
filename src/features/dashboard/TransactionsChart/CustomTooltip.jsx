import { formatNumber, formatDate } from "../../../shared/utils/FormatFunction";
export function CustomTooltip({ active, payload, label }) {
    if (!active || !payload || !payload.length) {
        return null;
    }

    return (
        <div className="transaction-tooltip">

            <div className="transaction-tooltip-date">
                {formatDate(label)}
            </div>

            {payload.map((entry) => (
                <div
                    key={entry.dataKey}
                    className="transaction-tooltip-row"
                >

                    <span className="transaction-tooltip-name">

                        <span
                            className="transaction-tooltip-dot"
                            style={{
                                background: entry.color,
                            }}
                        />

                        {entry.name}

                    </span>

                    <span className="transaction-tooltip-value">
                        {formatNumber(entry.value)}
                    </span>

                </div>
            ))}

        </div>
    );
}
