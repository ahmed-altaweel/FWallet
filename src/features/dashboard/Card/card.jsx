import { useState,useEffect, useMemo } from "react";
import { Calculate } from "./Calcualte";
import { fetchData } from "../../../shared/utils/FetchData";
import {TotalCard} from "./totalCard.jsx"
import { ProviderChart } from "../ProvidersChart/ProvideCharts.jsx";
export function TotalBalanceCard({token}){
     const [status,setStatus]=useState("Loading");
          const [data,setData]=useState([]);
          const loadData=async ()=>{
            fetchData("providersData.json",token).then((res)=>{
                setData(res);
                setStatus("Done")
            }).catch((error)=>{
                setStatus(`Error:${error}`);
            })
          }
    
          useEffect(()=>{
            loadData();
    
          },[token]);
      const Data=useMemo(()=>{
          return Calculate(data);
      },[data])

      const balance =useMemo(()=>{
        let d=[]
        Object.entries(Data).forEach(([currencyName,accounts])=>{
        let dict={"accountsCount":accounts.length,"providers":{}}
         accounts.forEach((element)=>{
          dict.providers[element.providerName]=
          (dict.providers[element.providerName]||0)+
          element.balance;
         })
         dict["currency"]=currencyName
         dict["balance"]=Object.values(dict["providers"]).reduce((sum,item)=> sum+item,0)
         d.push(dict)
        });
        return d;
      },[Data])
    return(
      <>
        {balance.map((x,i)=>{
          return (
         <div key={i}  className="total-balance-card">
              
                 <TotalCard 
                 
                    currency={x.currency}
                    balance={x.balance}
                    accounts={x.accountsCount}
                    />
               
            <ProviderChart data={x.providers} title={"حصة كل محفظة"}/>
           
         </div>)

        })

      
}
</>

    )}