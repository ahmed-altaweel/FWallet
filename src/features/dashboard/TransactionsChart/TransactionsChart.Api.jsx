
import { httpClient } from "../../../shared/utils/HttClient";
export async function fetchTransactionsData(token){
    try{
        const response =await httpClient.get("/TransactionsData.json",token);
        const user=Array.isArray(response)? response.find(item=>item.token===token):null;
        return user.data;  
    }catch(error){
        console.log(error);
    }

}