import {Outlet,Navigate} from 'react-router-dom'
import {useAuth} from '../core/auth/AuthContext.jsx'
export function ProtectedRoute(){
    const {isLoggedIn}=useAuth()
    if(!isLoggedIn){
        return <Navigate to="/login" replace></Navigate>
    }
    return <Outlet></Outlet>
}