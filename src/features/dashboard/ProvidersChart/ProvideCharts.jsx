
import { useMemo } from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";
import { formatPercent } from "../../../shared/utils/FormatFunction";
import { CustomTooltip } from "./CustomTootlip";
import { renderCustomLabel } from "./CustomLabel";
const DEFAULT_COLORS = [
  "#6b8aab",
  "#4A6FA5",
  "#8FA7C4",
  "#324A66",
  "#B9C6D6",
];



function withColors(data, palette) {
  return data.map((entry, index) => ({
    ...entry,
    fill: entry.fill ?? palette[index % palette.length],
  }));
}




export function ProviderChart({
  colors = DEFAULT_COLORS,
  title = "Provider distribution",
  token
}) {
  
   const [status,setStatus]=useState("Loading");
        const [rowdata,setData]=useState([]);
        const loadData=async ()=>{
          fetchData("TransactionsData.json",token).then((res)=>{
              setData(res);
              setStatus("Done")
          }).catch((error)=>{
              setStatus(`Error:${error}`);
          })
        }
  
        useEffect(()=>{
          loadData();
  
        },[token]);
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

