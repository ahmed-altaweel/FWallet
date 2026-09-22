import { useQuery } from "@tanstack/react-query";
import { Wallet, CircleCheck, Clock, Bell } from "lucide-react";
import { useAppData } from "@/core/state/useAppData";
import { fetchPersistedData } from "@/shared/utils/PersistedData.jsx";

export function DashboardKPIs({ token }) {
    const { data } = useAppData();

    const { data: accounts = [] } = useQuery({
        queryKey: ["dashboard_kpi_accounts", token],
        queryFn: () => fetchPersistedData("accountsList", "accounts.json", token),
        enabled: !!token,
    });

    const { data: transactions = [] } = useQuery({
        queryKey: ["dashboard_kpi_transactions", token],
        queryFn: () => fetchPersistedData("transactionTemp", "TransactionTemp.json", token),
        enabled: !!token,
    });

    const activeAccounts = accounts.filter(
        account => account.status === "active"
    ).length;

    const pendingTransactions = transactions.filter(
        transaction => transaction.status?.toLowerCase() === "pending"
    ).length;

    const items = [
        {
            icon: <Wallet size={18} />,
            label: "الحسابات المرتبطة",
            value: data.accounts_count ?? accounts.length,
        },
        {
            icon: <CircleCheck size={18} />,
            label: "حسابات نشطة",
            value: activeAccounts,
        },
        {
            icon: <Clock size={18} />,
            label: "معاملات قيد المعالجة",
            value: pendingTransactions,
        },
        {
            icon: <Bell size={18} />,
            label: "إشعارات غير مقروءة",
            value: data.unread_notifications ?? 0,
        },
    ];

    return (
        <div className="dashboard-kpi-row">
            {items.map(item => (
                <div key={item.label} className="dashboard-kpi-card">
                    <span className="dashboard-kpi-icon">{item.icon}</span>
                    <div className="dashboard-kpi-body">
                        <strong>{item.value}</strong>
                        <span>{item.label}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}