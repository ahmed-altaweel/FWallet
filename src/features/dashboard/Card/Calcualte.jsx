export function Calculate(data){
   
    let d={}
    data.forEach(element => {
        element.accounts.forEach(e=>{
            if (!d[e.currency]) d[e.currency] = [];
      d[e.currency].push({
        providerName: element.ProviderName,
        balance: e.balance
      });
        })

    });
return d;
}