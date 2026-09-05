
import { Navigate } from "react-router-dom";
import {useAuth} from '../auth/AuthContext.jsx'
import {AppDataContext} from "./AppDataContext.data.jsx"
import { fetchData } from "../../shared/utils/FetchData.jsx";
import { useQuery } from "@tanstack/react-query";
export function AppDataProvider({children}){
const {isLoggedIn, token} =useAuth()
const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["appData", token],
    queryFn: () => fetchData("appData.json", token),
    enabled: !!token,
  });

if(!isLoggedIn) return <Navigate to='/login' replace/>
if(isLoading==='loading')
  return(<div>
    جاري التحميل    
  </div>)
if(isError==="error")
    return <div>{error}</div>

return (
    <AppDataContext.Provider value={{data}}>
        {children}
    </AppDataContext.Provider>
)

}
