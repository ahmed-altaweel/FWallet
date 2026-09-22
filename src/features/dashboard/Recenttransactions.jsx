import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { fetchPersistedData } from "@/shared/utils/PersistedData.jsx";
import { formatDate } from "@/shared/utils/FormatFunction";
import { LoadingState, ErrorState, EmptyState } from "@/shared/components/states";

const STATUS_LABELS = {
    success: "ناجحة",
    completed: "ناجحة",
    pending: "قيد المعالجة",
    failed: "فشلت",
};

export function RecentTransactions({ token }) {
    const navigate = useNavigate();

    const {
        data: transactions = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["dashboard_recent_transactions", token],
        queryFn: () => fetchPersistedData("transactionTemp", "TransactionTemp.json", token),
        enabled: !!token,
    });

    const recent = useMemo(
        () =>
            [...transactions]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5),
        [transactions]
    );

    return (
        <div className="dashboard-panel">
            <div className="dashboard-panel-header">
                <h3>آخر المعاملات</h3>
                <button type="button" onClick={() => navigate("/transactions")}>
                    عرض الكل
                    <ChevronLeft size={14} />
                </button>
            </div>

            {isLoading && (
                <LoadingState message="جاري تحميل المعاملات..." size="sm" />
            )}

            {isError && (
                <ErrorState
                    title="تعذر تحميل المعاملات"
                    message={error?.message || "حدث خطأ أثناء جلب المعاملات."}
                    size="sm"
                    onRetry={refetch}
                />
            )}

            {!isLoading && !isError && recent.length === 0 && (
                <EmptyState
                    title="لا توجد معاملات"
                    message="لم يتم تسجيل أي معاملة بعد."
                    size="sm"
                />
            )}

            {!isLoading && !isError && recent.length > 0 && (
                <div className="dashboard-transactions-list">
                    {recent.map((transaction, idx) => (
                        <div className="dashboard-transaction-row" key={transaction.id ?? idx}>
                            <div className="dashboard-transaction-main">
                                <strong>{transaction.title}</strong>
                                <span>{formatDate(transaction.date)}</span>
                            </div>

                            <div className="dashboard-transaction-meta">
                                <span className="dashboard-transaction-amount">
                                    {transaction.amount} {transaction.currency}
                                </span>

                                <span
                                    className={`dashboard-status-pill status-${transaction.status?.toLowerCase()}`}
                                >
                                    {STATUS_LABELS[transaction.status?.toLowerCase()] || transaction.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}