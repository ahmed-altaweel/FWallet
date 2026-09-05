
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";
import { CustomTooltip } from "./CustomTooltip";
import { formatNumber, formatDate } from "../../../shared/utils/FormatFunction";
import { fetchData } from "../../../shared/utils/FetchData";

export function TransactionChart({ token }) {
    const {
        data=[],
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ["transactions", token],
        queryFn: () => fetchData("TransactionsData.json", token),
        enabled: !!token,
    });
    console.log(data)
      const chartData = useMemo(() => {

        const grouped = {};

        data.forEach((d) => {

            const {
                date,
                amount,
                type,
            } = d;

            if (!grouped[date]) {

                grouped[date] = {
                    date,
                    income: 0,
                    expense: 0,
                };

            }

            if (type === "income") {
                grouped[date].income += Number(amount);
            }

            if (type === "expense") {
                grouped[date].expense += Number(amount);
            }

        });

        return Object.values(grouped).sort(
            (a, b) =>
                new Date(a.date) -
                new Date(b.date)
        );

    }, [data]);


    // حساب الإجماليات
    const totals = useMemo(() => {

        const income = chartData.reduce(
            (sum, item) =>
                sum + item.income,
            0
        );

        const expense = chartData.reduce(
            (sum, item) =>
                sum + item.expense,
            0
        );

        return {
            income,
            expense,
            net: income - expense,
        };

    }, [chartData]);
    if(isLoading)
        return <div>Loading</div>
    if (isError)
        return <div>{error}</div>
    // تجهيز بيانات المخطط
  


    return (

        <div className="transaction-chart">
            {/* رأس البطاقة */}
            <div className="transaction-chart-header">
                <div className="transaction-net">

                    <div className="transaction-net-label">
                        صافي التدفق
                    </div>

                    <div
                        className={`transaction-net-value ${totals.net >= 0
                                ? "positive"
                                : "negative"
                            }`}
                    >
                        {totals.net >= 0 ? "+" : ""}
                        {formatNumber(totals.net)}

                    </div>

                </div>

            </div>


            {/* الإحصائيات */}

            <div className="transaction-legend">

                {/* الدخل */}

                <div className="transaction-legend-item">

                    <span className="transaction-legend-dot income-dot" />

                    <span className="transaction-legend-label">
                        المعاملات الداخلة
                    </span>

                    <span className="transaction-legend-value">
                        {formatNumber(totals.income)}
                    </span>

                </div>
                {/* المصروف */}
                <div className="transaction-legend-item">

                    <span className="transaction-legend-dot expense-dot" />

                    <span className="transaction-legend-label">
                        المعاملات الخارجة
                    </span>

                    <span className="transaction-legend-value">

                        {formatNumber(totals.expense)}
                    </span>

                </div>

            </div>


            {/* المخطط */}

            <div className="transaction-chart-container">

                <ResponsiveContainer
                    width="100%"
                    height={320}
                >

                    <LineChart
                        data={chartData}
                        margin={{
                            top: 10,
                            right: 10,
                            left: 0,
                            bottom: 10,
                        }}
                    >

                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#0d2a4a91"
                            vertical={true}
                        />


                        <XAxis
                            dataKey="date"
                            tickFormatter={formatDate}
                            stroke="#0d2a4a"
                            tick={{
                                fill: "#031b34fc",
                                fontSize: 12,
                            }}
                            tickLine={false}
                            axisLine={{
                                stroke: "#0d2a4a",
                            }}

                        />


                        <YAxis
                            stroke="#000000"
                            tick={{
                                fill: "#0d2a4a",
                                fontSize: 12,
                                padding: 10,
                            }}
                            tickLine={false}
                            axisLine={true}
                            tickMargin={20}

                        />


                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{
                                stroke: "#0d2a4a",
                            }}
                        />


                        {/* خط المعاملات الداخلة */}

                        <Line
                            type="monotone"
                            dataKey="income"
                            name="المعاملات الداخلة"
                            stroke="#2dd4bf"
                            strokeWidth={3}
                            dot={{
                                r: 4,
                                fill: "#2dd4bf",
                                strokeWidth: 0,
                            }}
                            activeDot={{
                                r: 6,
                                fill: "#2dd4bf",
                                stroke: "#0e1836",
                                strokeWidth: 2,
                            }}
                        />


                        {/* خط المعاملات الخارجة */}

                        <Line
                            type="monotone"
                            dataKey="expense"
                            name="المعاملات الخارجة"
                            stroke="#fb7185"
                            strokeWidth={3}
                            dot={{
                                r: 4,
                                fill: "#fb7185",
                                strokeWidth: 0,
                            }}
                            activeDot={{
                                r: 6,
                                fill: "#fb7185",
                                stroke: "#0e1836",
                                strokeWidth: 2,
                            }}
                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>

        </div>
    );
}

