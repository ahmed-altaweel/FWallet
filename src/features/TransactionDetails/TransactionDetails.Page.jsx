import {useParams} from "react-router-dom";
import {Header} from  "../../layout/Header";



export function TransactionDetails() {
    const { id } = useParams();

    return (
        <>
       <Header/>
        <div>
            <h2>تفاصيل العملية</h2>
            <p>رقم العملية: {id}</p>
        </div>
         </>
    );
}