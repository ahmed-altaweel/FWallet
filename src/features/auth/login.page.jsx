
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../core/auth/AuthContext";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import {  ArrowLeft } from 'lucide-react';
export function LoginPage(){
    const {login} =useAuth()
    const navigate=useNavigate()
        const [error,setError]=useState("")
    const handleSubmit=async (event)=>{
        event.preventDefault();
        const formData=new FormData(event.currentTarget);
        let username=formData.get("username") ||'';
        let password=formData.get("password")||''
      
        try{
           let user= await login(username,password);
           console.log(user)
           if(user)
            navigate('/dashboard')
        }catch(error){
            setError(error.message);
        }
    }
        function showUserNameError(error){
        return (
            <div className="username-error error-message">
              <span>⚠</span>  {error}    
            </div>
        );
     }
    return(
        <div className="form">
               <div className="form-logo">
                <img src="/fwallet-icon.svg" alt="" />
                <p>FWallet</p>
            </div>
            <div className="form-title">سجل الدخول لأستخدام حسابك</div>
        <form onSubmit={handleSubmit} className="login-form">
         
               <div className="user-name input">
              <label htmlFor="username">اسم المستخدم</label>
            <input className={error && "input-error"} name="username" type="text" />
            {error &&showUserNameError(error)}
         </div>
                
         <div className="user-name input">
            <label htmlFor="password">كلمة المرور</label>
            <input className={error && "input-error"} name="password" type="password"/>
            {error &&showUserNameError(error)}
         </div>
                        <button className="submit" type="submit"> إرسال <ArrowLeft/>    </button>
        </form>
        <div className="create-account-link">
           <p>  ليس لدي حساب؟</p>
           <NavLink className="link" to="/signup">إنشاء حساب </NavLink>
        </div>
        </div>
    )
}