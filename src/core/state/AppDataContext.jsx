import { createContext,useState,useContext,useEffect } from "react"
import { Navigate } from "react-router-dom";
import {useAuth} from '../auth/AuthContext.jsx'
import { fetchAppData } from "./AppDataApi";
const AppDataContext=createContext(null)
export function AppDataProvider({children}){
const {isLoggedIn} =useAuth()
const [data,setData]=useState(null);
const [status,setStatus]=useState("loading");
const loadData=()=>{
   fetchAppData()
    .then((res)=>{setData(res)
       ;setStatus("success")})
    .catch(()=>setStatus("error"))
}
useEffect(()=>{
    if(!isLoggedIn) return
    loadData();
},[isLoggedIn]);

if(!isLoggedIn) return <Navigate to='/login' replace/>
if(status==='loading')
  return(<div>
    جاري التحميل    
  </div>)
if(status=="error")
    return <div>حصل خطاء</div>

return (
    <AppDataContext.Provider value={{data,status,refetch:loadData}}>
        {children}
    </AppDataContext.Provider>
)

}
export function useAppData(){
    const  ctx=useContext(AppDataContext);
    if (!ctx) throw new Error('useAppData must be used inside AppDataProvider');
  return ctx;
}