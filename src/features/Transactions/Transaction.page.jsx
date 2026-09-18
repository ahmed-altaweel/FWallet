import {ContainerBox} from "@/shared/utils/ContainerBox";
import { useAuth } from "../../core/auth/AuthContext";

import { useQuery } from "@tanstack/react-query";
import {fetchData} from "@/shared/utils/FetchData";
import {formatDate} from "@/shared/utils/FormatFunction";
import "./Transaction.style.css"


export function TransactionsPage(){
    const {token}=useAuth();

    const{data:TransactionData=[],
        isLoading,
        isError,
        error
    }=useQuery({queryKey:["transactions",token],
        queryFn:()=>fetchData('TransactionTemp.json',token),
        enabled:!!token,

    })

    if(isLoading){
        return (<div>
            جاري التحميل ...
        </div>);

    }
    if(isError){
        return ( <div>
            حدث خطأ <br />
            {error?.message}
        </div>
        );
    }

    return(
        <>
       <div className="transaction-d-page">
        <ContainerBox>
                <h1>سجل المعاملات</h1>
                <h3>جميع العمليات المالية</h3>
            </ContainerBox>




 {TransactionData?.map((transaction) => (
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

            ))}       

</div> 
        </>
    );
}

// It must to be Transaction Data but I use {NotificationData } for test 