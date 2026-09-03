import { httpClient } from "./HttClient";
export async function fetchData(url,token){
    try{
        const response =await httpClient.get(url,token);
        console.log(`ItemToken:${token}`)
        console.log(response)
        console.log(`url:${url}`)
        console.log(Array.isArray(response))
        console.log(response.find(item=>item.token===token))
        const user=Array.isArray(response)? response.find(item=>item.token===token):null;
        console.log(user)
        return user.data;  
    }catch(error){
        console.log(error)
        return null;
    }
}