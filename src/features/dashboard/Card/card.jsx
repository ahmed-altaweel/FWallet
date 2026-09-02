export function TotalBalanceCard(token){
     const [status,setStatus]=useState("Loading");
          const [data,setData]=useState([]);
          const loadData=async ()=>{
            fetchData("TransactionsData.json",token).then((res)=>{
                setData(res);
                setStatus("Done")
            }).catch((error)=>{
                setStatus(`Error:${error}`);
            })
          }
    
          useEffect(()=>{
            loadData();
    
          },[token]);
    return(
         <div className="total-balance-card">
                {balance.map((x,i)=>{
                  return  <TotalCard 
                  key={i}
                    currency={x.currency}
                    balance={x.balance}
                    accounts={x.accountsCount}
                    />
                })}
            <ProviderChart title={"حصة كل محفظة"}/>
         </div>
    )
}