// src/features/Transactions/Transaction.page.jsx
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";

import { ContainerBox } from "@/shared/utils/ContainerBox";
import { useAuth } from "../../core/auth/AuthContext";
import { LoadingState, ErrorState, EmptyState } from "@/shared/components/states";
import { Pagination } from "@/shared/components/Pagination";
import { CustomSelect } from "@/shared/components/customSelect/CustomSelect";
import { formatDate, formatNumber } from "@/shared/utils/FormatFunction";
import { fetchPersistedData } from "@/shared/utils/PersistedData.jsx";
import "./Transaction.style.css";

const PAGE_SIZE = 5;

const STATUS_LABELS = {
    success: "ناجحة",
    completed: "ناجحة",
    pending: "قيد المعالجة",
    failed: "فشلت",
};

const TYPE_LABELS = {
    transfer: "تحويل مالي",
    deposit: "إيداع مالي",
};

const STATUS_OPTIONS = [
    { value: "ALL", label: "كل الحالات" },
    { value: "success", label: "ناجحة" },
    { value: "pending", label: "قيد المعالجة" },
    { value: "failed", label: "فشلت" },
];

const TYPE_OPTIONS = [
    { value: "ALL", label: "كل الأنواع" },
    { value: "transfer", label: "تحويل مالي" },
    { value: "deposit", label: "إيداع مالي" },
];

export function TransactionsPage() {
    const { token } = useAuth();

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [typeFilter, setTypeFilter] = useState("ALL");

    const {
        data: TransactionData = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["transactions", token],
        queryFn: () => fetchPersistedData("transactionTemp", "TransactionTemp.json", token),
        enabled: !!token,
    });

    const filteredData = useMemo(() => {
        const query = search.trim().toLowerCase();

        return TransactionData.filter((transaction) => {
            const matchesStatus =
                statusFilter === "ALL" ||
                transaction.status?.toLowerCase() === statusFilter;

            const matchesType =
                typeFilter === "ALL" || transaction.type === typeFilter;

            const matchesSearch =
                !query ||
                transaction.title?.toLowerCase().includes(query) ||
                transaction.from?.toLowerCase().includes(query) ||
                transaction.to?.toLowerCase().includes(query);

            return matchesStatus && matchesType && matchesSearch;
        });
    }, [TransactionData, search, statusFilter, typeFilter]);

    const summary = useMemo(
        () => ({
            total: filteredData.length,
            success: filteredData.filter((t) =>
                ["success", "completed"].includes(t.status?.toLowerCase())
            ).length,
            pending: filteredData.filter((t) => t.status?.toLowerCase() === "pending").length,
            failed: filteredData.filter((t) => t.status?.toLowerCase() === "failed").length,
        }),
        [filteredData]
    );

    const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
    const pagedData = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    useEffect(() => {
        setPage(1);
    }, [search, statusFilter, typeFilter]);

    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [totalPages, page]);

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
                <h1> جميع العمليات المالية</h1>
               
            </ContainerBox>

            {TransactionData.length === 0 ? (
                <EmptyState
                    title="لا توجد معاملات"
                    message="لم يتم تسجيل أي عملية مالية على حساباتك حتى الآن."
                />
            ) : (
                <>
                    <div className="transactions-summary-grid">
                        <SummaryCard label="إجمالي المعاملات" value={summary.total} tone="default" />
                        <SummaryCard label="ناجحة" value={summary.success} tone="success" />
                        <SummaryCard label="قيد المعالجة" value={summary.pending} tone="pending" />
                        <SummaryCard label="فشلت" value={summary.failed} tone="failed" />
                    </div>

                    <div className="transactions-filters">
                        <div className="transactions-search">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="ابحث بالعنوان أو الحساب..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="transactions-filter-select">
                            <CustomSelect
                                name="type-filter"
                                options={TYPE_OPTIONS}
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                placeholder="كل الأنواع"
                            />
                        </div>

                        <div className="transactions-filter-select">
                            <CustomSelect
                                name="status-filter"
                                options={STATUS_OPTIONS}
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                placeholder="كل الحالات"
                            />
                        </div>
                    </div>

                    {filteredData.length === 0 ? (
                        <EmptyState
                            title="لا توجد نتائج مطابقة"
                            message="جرّب تعديل كلمة البحث أو الفلاتر المحددة."
                            size="sm"
                        />
                    ) : (
                        <>
                            <div className="transactions-table-card">
                                <div className="transactions-table-scroll">
                                    <table className="transactions-table">
                                        <thead>
                                            <tr>
                                                <th>العملية</th>
                                                <th>من</th>
                                                <th>إلى</th>
                                                <th>المبلغ</th>
                                                <th>الحالة</th>
                                                <th>التاريخ</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {pagedData.map((transaction, idx) => (
                                                <tr key={transaction.id ?? `tr-${idx}`}>
                                                    <td className="cell-title">
                                                        {transaction.title}
                                                        <span className="cell-subtitle">
                                                            {TYPE_LABELS[transaction.type] || transaction.type}
                                                        </span>
                                                    </td>
                                                    <td className="cell-muted">{transaction.from}</td>
                                                    <td className="cell-muted">{transaction.to}</td>
                                                    <td className="cell-amount">
                                                        {transaction.amount}
                                                        <span>{transaction.currency}</span>
                                                    </td>
                                                    <td>
                                                        <span
                                                            className={`transaction-status status-${transaction.status?.toLowerCase()}`}
                                                        >
                                                            {STATUS_LABELS[transaction.status?.toLowerCase()] ||
                                                                transaction.status}
                                                        </span>
                                                    </td>
                                                    <td className="cell-date">{formatDate(transaction.date)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                        </>
                    )}
                </>
            )}
        </div>
    );
}

function SummaryCard({ label, value, tone = "default" }) {
    return (
        <div className={`transactions-summary-card tone-${tone}`}>
            <span className="transactions-summary-label">{label}</span>
            <strong className="transactions-summary-value">{formatNumber(value)}</strong>
        </div>
    );
}