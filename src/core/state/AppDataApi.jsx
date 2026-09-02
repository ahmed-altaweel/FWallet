import { httpClient } from "../../shared/utils/HttClient";

export async function fetchAppData(token){
    console.log("Hello From fetch");
    try{
        console.log("Hello");
        const response = await httpClient.get("appData.json", token);
        const data = Array.isArray(response) ? response.find(item => item.token === token) : null;
        return data;
    }catch(error){
        console.log("error")
        console.log(error)
        return null;
    }
}