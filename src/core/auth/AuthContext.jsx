import {createContext,useState,useContext} from 'react'


const AuthContext=createContext(null)
export function AuthProvider({children}){
    const [isLoggedIn,setIsLoggedIn]=useState(true);
    async function login(username,password){
        setIsLoggedIn(true);
    }
    function logout(){
        setIsLoggedIn(false);
    }

    return (
        <AuthContext.Provider value={{isLoggedIn,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}


export function useAuth(){
    return useContext(AuthContext);
}