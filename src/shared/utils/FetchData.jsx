import { httpClient } from "./HttClient";
export async function fetchData(url,token){
    try{
        const response =await httpClient.get(url,token);
        const user=Array.isArray(response)? response.find(item=>item.token===token):null;
        return user.data;  
    }catch(error){
        console.log(error)
        return null;
    }
}