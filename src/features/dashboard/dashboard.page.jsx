import { useNavigate } from "react-router-dom";
import { ArrowLeftRight, CirclePlus } from "lucide-react";
import { useAuth } from "../../core/auth/AuthContext";
import { useAppData } from "../../core/state/useAppData.jsx";
import { TotalBalanceCard } from "./Card/card.jsx"
import { TransactionChart } from "./TransactionsChart/TransactionsChart.jsx"
import { DashboardKPIs } from "./DashboardKPIs.jsx"
import { RecentTransactions } from "./RecentTransactions.jsx"
import { RecentNotifications } from "./RecentNotifications.jsx"
import "./dashboard.style.css"

export function Dashboard(){
    const { token } = useAuth();
    const { data } = useAppData();
    const navigate = useNavigate();

    return(
        <div className="dashboard">

            <div className="dashboard-welcome">
                <div className="dashboard-welcome-text">
                    <h1>مرحبًا، {data.name}</h1>
                    <p>هذه نظرة عامة على وضعك المالي اليوم</p>
                </div>

                <div className="dashboard-quick-actions">
                    <button type="button" onClick={() => navigate("/single-transfer")}>
                        <ArrowLeftRight size={16} />
                        تحويل جديد
                    </button>

                    <button type="button" className="ghost" onClick={() => navigate("/add-account")}>
                        <CirclePlus size={16} />
                        إضافة حساب
                    </button>
                </div>
            </div>

            <DashboardKPIs token={token} />

            <div className="staticts-balance">
                <p>إجمالي الرصيد حسب العملة</p>
                <hr />
                <div className="total-card">
                    <TotalBalanceCard token={token}/>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="transactions-chart">
                    <p className="transaction-chart-title">
                        التدفقات المالية
                    </p>
                    <hr />
                    <TransactionChart token={token}/>
                </div>

                <div className="dashboard-side">
                    <RecentTransactions token={token} />
                    <RecentNotifications token={token} />
                </div>
            </div>

        </div>
    )
}