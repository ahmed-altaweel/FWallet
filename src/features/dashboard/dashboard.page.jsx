import { useAuth } from "../../core/auth/AuthContext";
import {TotalBalanceCard} from "./Card/totalCard.jsx"
import {TransactionChart} from "./TransactionsChart/TransactionsChart.jsx"
import "./dashboard.style.css"
export function Dashboard(){
    const{token}=useAuth()


    return(
        <>
        <div className="dashboard">
            <div className="staticts-balance">
                <p>إجمالي الرصيد حسب العملة</p>
                <hr />
                <div className="total-card">
                    <TotalBalanceCard token={token}/>
                </div>
            </div>
            <div className="transactions-chart">
                 <p className="transaction-chart-title">
                    التدفقات المالية
                </p>
                <hr />
                <TransactionChart token={token}/>
            </div>
        </div>
         </>
    )
}