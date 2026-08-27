import { httpClient } from "../../shared/utils/HttClient";
export async function fetchAppData(){
    const token="ahmed";
  

    try{
        //  return httpClient.post("get-data",token)
         return {accounts:4,notifications_unread:10}
    }catch(error){
        console.log(error)
    }
}