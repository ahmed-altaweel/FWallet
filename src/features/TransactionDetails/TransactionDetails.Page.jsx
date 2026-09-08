import {useParams,useLocation} from "react-router-dom";
import {ContainerBox} from "@/shared/utils/ContainerBox";
import "./TransactionDetails.style.css"


export function TransactionDetails() {
    const { id } = useParams();
    const location=useLocation();
  


const Data=location.state?.transactionData;


    return (
        <div className="transaction-d-page" >
        
      <ContainerBox className="box">
      <h2>معرف العملية: {id}</h2>
                {Data ? (
                    <div>
                        <h3>العنوان: {Data.title}</h3>
                        <p>الرسالة: {Data.message}</p>
                        <p>التاريخ: {Data.date}</p>
                    </div>
                ) : (
                    <h3>تفاصيل العملية</h3>
                )}

      </ContainerBox>

       
         </div >
    );
}