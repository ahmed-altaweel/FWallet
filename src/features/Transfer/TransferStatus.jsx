import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getTransferStatus } from "./Transfer.Api";
import { useAuth } from "../../core/auth/AuthContext";
import { LoadingState, ErrorState, EmptyState } from "@/shared/components/states";

import "./TransferStatus.css";

export  function TransferStatus() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const { state } = useLocation();

    const transferId = state?.transferId;

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["transfer-status", token, transferId],
        queryFn: () => getTransferStatus(token, transferId),
        enabled: !!token && !!transferId
    });

    const goToTransfer = () => navigate("/single-transfer");

    if (!transferId)
        return (
            <EmptyState
                title="لا توجد عملية تحويل"
                message="لا توجد عملية تحويل لعرض حالتها."
                actionLabel="العودة للتحويل"
                onAction={goToTransfer}
            />
        );

    if (isLoading)
        return (
            <LoadingState
                title="حالة التحويل"
                message="جاري الحصول على حالة التحويل..."
            />
        );

    if (isError)
        return (
            <ErrorState
                title="تعذر الحصول على حالة التحويل"
                message={error?.message || "حدث خطأ أثناء الحصول على بيانات العملية."}
                onRetry={refetch}
            />
        );

    if (!data?.found)
        return (
            <EmptyState
                title="التحويل غير موجود"
                message="لم يتم العثور على عملية تحويل بهذا المعرف."
                actionLabel="تحويل جديد"
                onAction={goToTransfer}
            />
        );

    const transfer = data.transfer;
    const transactions = data.transactions || [];

    const completed = transfer.status === "completed";
    const pending = transfer.status === "pending";

    const statusClass = completed
        ? "status-success"
        : pending
            ? "status-pending"
            : "status-failed";

    const statusText = completed
        ? "تم التحويل بنجاح"
        : pending
            ? "التحويل قيد المعالجة"
            : "التحويل لم يكتمل";

    return (
        <div className="transfer-status-page">
            <div className="transfer-status-container">

                <header className="status-header">
                    <div>
                        <h1>حالة التحويل</h1>
                        <p>متابعة نتيجة عملية التحويل وتفاصيلها</p>
                    </div>
                </header>

                <section className="status-main-card">
                    <div className={`transfer-status-badge ${statusClass}`}>
                        <span className="status-badge-icon">
                            {completed ? "✓" : pending ? "..." : "!"}
                        </span>
                        {statusText}
                    </div>

                    <div className="status-main-info">
                        <span>رقم العملية</span>
                        <strong>{transfer.id}</strong>
                    </div>
                </section>

                <section className="status-card">
                    <div className="status-card-header">
                        <h2>معلومات العملية</h2>
                    </div>

                    <div className="status-info-grid">
                        <Info
                            label="نوع العملية"
                            value={
                                transfer.type === "single"
                                    ? "تحويل فردي"
                                    : transfer.type
                            }
                        />

                        <Info
                            label="المبلغ"
                            value={
                                <strong className="status-amount">
                                    {transfer.requestedAmount}
                                    <small>{transfer.requestedCurrency}</small>
                                </strong>
                            }
                        />

                        <Info
                            label="الحالة"
                            value={
                                <strong className={statusClass}>
                                    {transfer.status}
                                </strong>
                            }
                        />
                    </div>
                </section>

                {transfer.type === "single" && (
                    <section className="status-card">
                        <div className="status-card-header">
                            <h2>تفاصيل التحويل</h2>
                        </div>

                        <div className="transfer-route">
                            <Account
                                label="الحساب المصدر"
                                value={transfer.source?.accountId}
                            />

                            <div className="route-arrow">←</div>

                            <Account
                                label="الحساب الوجهة"
                                value={transfer.destination?.accountId}
                            />
                        </div>
                    </section>
                )}

                <section className="status-card">
                    <div className="status-card-header">
                        <div>
                            <h2>العمليات الناتجة</h2>
                            <p>العمليات التي تم إنشاؤها نتيجة التحويل</p>
                        </div>

                        <span className="transaction-count">
                            {transactions.length}
                        </span>
                    </div>

                    {transactions.length ? (
                        <div className="transactions-list">
                            {transactions.map(transaction => (
                                <div
                                    className="transaction-item"
                                    key={transaction.id}
                                >
                                    <div className="transaction-header">
                                        <span>رقم العملية</span>
                                        <strong>{transaction.id}</strong>
                                    </div>

                                    <div className="transaction-grid">
                                        <Info
                                            label="المصدر"
                                            value={transaction.sourceAccountId}
                                        />

                                        <Info
                                            label="الوجهة"
                                            value={transaction.destinationAccountId}
                                        />

                                        <Info
                                            label="المبلغ"
                                            value={`${transaction.amount} ${transaction.currency}`}
                                        />

                                        <Info
                                            label="الحالة"
                                            value={transaction.status}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            title="لا توجد عمليات"
                            message="لم يتم تسجيل أي عملية ضمن هذا التحويل."
                            size="sm"
                        />
                    )}
                </section>

                <section className="status-actions">
                    <button
                        className="status-secondary-button"
                        onClick={() => navigate(-1)}
                    >
                        العودة
                    </button>

                    <button
                        className="status-primary-button"
                        onClick={goToTransfer}
                    >
                        تحويل جديد
                    </button>
                </section>

            </div>
        </div>
    );
}

function Info({ label, value }) {
    return (
        <div className="status-info-item">
            <span>{label}</span>
            <strong>{value}</strong>
        </div>
    );
}

function Account({ label, value }) {
    return (
        <div className="route-account">
            <span className="route-label">{label}</span>
            <strong>{value}</strong>
        </div>
    );
}
