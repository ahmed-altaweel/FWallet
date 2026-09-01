import { useAuth } from "../../core/auth/AuthContext";
import {TotalBalanceCard} from "./totalCard.jsx"
import {TransactionChart} from "./TransactionsChart.jsx"
import "./dashboard.style.css"
export function Dashboard(){
    const{token}=useAuth()
    const balance=[
        {"currency":"ر.س",
            "balance":200000,
            "accountsCount":4
        },
        {"currency":"دولار امريكي",
            "balance":200000,
            "accountsCount":4
        }
        ,{"currency":"ر.ي",
            "balance":200000,
            "accountsCount":4
        }

    ]

    const providers=[
        {
          "currency":"ر.ي"
        }
    ]

    return(
        <>
        <div className="dashboard">
            <div className="staticts-balance">
                <p>إجمالي الرصيد حسب العملة</p>
                <hr />
                <div className="total-card">
                {balance.map((x,i)=>{
                  return  <TotalBalanceCard 
                  key={i}
                    currency={x.currency}
                    balance={x.balance}
                    accounts={x.accountsCount}
                    />
                })}
                </div>
            </div>
            <div className="transactions-chart">
                 <p className="transaction-chart-title">
                    التدفقات المالية
                </p>
                <hr />
                <TransactionChart/>
            </div>
        </div>
         </>
    )
}