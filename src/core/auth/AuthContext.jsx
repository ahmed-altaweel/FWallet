import {createContext,useState,useContext} from 'react'
import { httpClient } from '../../shared/utils/HttClient';


const AuthContext=createContext(null)
export function AuthProvider({children}){
  
    
     const [token, setToken] = useState(
        () => sessionStorage.getItem("token")
    );
    const [isLoggedIn,setIsLoggedIn]=useState(!!token);
    async function login(username,password){
        const users = await httpClient.get("usersData.json");
        const user = Array.isArray(users) ? users.find(item => item.userName === username && item.password === password) : null;
        if(user){
            setIsLoggedIn(true);
               sessionStorage.setItem("token", user.token);
        setToken(user.token);
            return user;
        }
        throw { message: "بيانات الدخول غير صحيحة" };
    }
    function logout(){
        setIsLoggedIn(false);
    }

    return (
        <AuthContext.Provider value={{isLoggedIn,token,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}


export function useAuth(){
    return useContext(AuthContext);
}