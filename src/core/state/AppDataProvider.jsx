import { useState,useEffect } from "react"
import { Navigate } from "react-router-dom";
import {useAuth} from '../auth/AuthContext.jsx'
import { fetchAppData } from "./AppDataApi.jsx";
import {AppDataContext} from "./AppDataContext.data.jsx"
import { fetchData } from "../../shared/utils/FetchData.jsx";

export function AppDataProvider({children}){
const {isLoggedIn, token} =useAuth()
const [data,setData]=useState(null);
const [status,setStatus]=useState("loading");
console.log("Hello");
const loadData=()=>{
    fetchData("appData.json",token)
    .then((res)=>{setData(res)
       ;setStatus("success")})
    .catch((error)=>{
 console.log(`in error:${error}`);
        setStatus("error")
    })
}
useEffect(()=>{
    if(!isLoggedIn) return
    loadData();
    console.log("after load Data");
},[isLoggedIn]);

if(!isLoggedIn) return <Navigate to='/login' replace/>
if(status==='loading')
  return(<div>
    جاري التحميل    
  </div>)
if(status==="error")
    return <div>حصل خطاء</div>

return (
    <AppDataContext.Provider value={{data,status,refetch:loadData}}>
        {children}
    </AppDataContext.Provider>
)

}
