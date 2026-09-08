import {ContainerBox} from "@/shared/utils/ContainerBox";
import { useAuth } from "../../core/auth/AuthContext";

import { useQuery } from "@tanstack/react-query";
import {fetchData} from "@/shared/utils/FetchData";

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
                <ContainerBox key={transaction.id} className="trans-container" >

                    <div className="transaction-title">
                        {transaction.title}
                    </div>

                    <div className="transaction-amount">
                        {transaction.amount} {transaction.currency}
                    </div>

                    <div className="transaction-from">
                        من: {transaction.from}
                    </div>

                    <div className="transaction-to">
                        إلى: {transaction.to}
                    </div>

                    <div className="transaction-status">
                        {transaction.status}
                    </div>

                    <div className="transaction-date">
                              {new Date(transaction.date).toLocaleString("ar-SA")}
                    </div>

                </ContainerBox>
            ))}       

</div> 
        </>
    );
}

// It must to be Transaction Data but I use {NotificationData } for test 