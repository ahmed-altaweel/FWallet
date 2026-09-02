export function Calculate(data){
    const balance=[]
    let d={}
    data.array.forEach(element => {
        element.accounts.forEach(e=>{
          d[e.currency]=  d[e.currency]?[...d[e.currency],
          {providerName:element.ProviderName,balance:e.balance}]:
          [{providerName:element.ProviderName,balance:e.balance}]
        })
    });
   
}