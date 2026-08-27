import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../core/auth/AuthContext";
export function LoginPage(){
    const {login} =useAuth()
    const navigate=useNavigate()
    const handleSubmit=async (event)=>{
        event.preventDefault();
        const formData=new FormData(event.currentTarget);
        let username=formData.get("username") ||'';
        let password=formData.get("password")||''
        let response;
        try{
           let user= await login(username,password);
           console.log(user)
           if(user)
            navigate('/dashboard')
        }catch(error){
                console.log(error)
        }
    }
    return(
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">اسم المستخدم</label>
            <input  name="username" type="text" />
            <label htmlFor="password">كلمة المرور</label>
            <input name="password" type="password"/>
            <button type="submit">ارسال</button>
        </form>
    )
}