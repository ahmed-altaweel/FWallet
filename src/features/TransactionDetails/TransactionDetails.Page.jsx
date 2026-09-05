import {useParams} from "react-router-dom";
import {ContainerBox} from "../../shared/utils/ContainerBox";
import "./TransactionDetails.style.css"


export function TransactionDetails() {
    const { id } = useParams();

    return (
        <div className="transaction-d-page" >
        
      <ContainerBox className="box">
       <h2>{id}</h2>
<h3>العملية </h3>

      </ContainerBox>

        <ContainerBox className="box">
       <h2>{id}</h2>
<h3>العملية </h3>

      </ContainerBox>

        <ContainerBox className="box">
       <h2>{id}</h2>
<h3>العملية </h3>

      </ContainerBox>
       
         </div >
    );
}