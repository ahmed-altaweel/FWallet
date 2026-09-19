import { ContainerBox } from "@/shared/utils/ContainerBox";
import { useAuth } from "../../core/auth/AuthContext";
import { LoadingState, ErrorState, EmptyState } from "@/shared/components/states";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/shared/utils/FetchData";
import { formatDate } from "@/shared/utils/FormatFunction";
import "./Transaction.style.css";

export function TransactionsPage() {
    const { token } = useAuth();

    const {
        data: TransactionData = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["transactions", token],
        queryFn: () => fetchData("TransactionTemp.json", token),
        enabled: !!token,
    });

    if (isLoading) {
        return <LoadingState message="جاري تحميل سجل المعاملات..." />;
    }

    if (isError) {
        return (
            <ErrorState
                title="تعذر تحميل المعاملات"
                message={error?.message || "حدث خطأ أثناء جلب سجل المعاملات."}
                onRetry={refetch}
            />
        );
    }

    return (
        <div className="transaction-d-page">
            <ContainerBox>
                <h1>سجل المعاملات</h1>
                <h3>جميع العمليات المالية</h3>
            </ContainerBox>

            {TransactionData.length === 0 ? (
                <EmptyState
                    title="لا توجد معاملات"
                    message="لم يتم تسجيل أي عملية مالية على حساباتك حتى الآن."
                />
            ) : (
                TransactionData.map((transaction) => (
                    <ContainerBox key={transaction.id} className="trans-container">
                        <div className="transaction-header">
                            <h4 className="transaction-title">{transaction.title}</h4>
                            <div className="transaction-amount">
                                {transaction.amount} <span>{transaction.currency}</span>
                            </div>
                        </div>

                        <div className="transaction-details">
                            <div className="transaction-from">
                                <span className="label">من:</span>
                                <span className="value">{transaction.from}</span>
                            </div>
                            <div className="transaction-to">
                                <span className="label">إلى:</span>
                                <span className="value">{transaction.to}</span>
                            </div>
                        </div>

                        <div className="transaction-footer">
                            <div className={`transaction-status status-${transaction.status?.toLowerCase()}`}>
                                {transaction.status}
                            </div>
                            <div className="transaction-date">
                                {formatDate(transaction.date)}
                            </div>
                        </div>
                    </ContainerBox>
                ))
            )}
        </div>
    );
}
