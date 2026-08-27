import { Route,Routes,BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./core/auth/AuthContext";
import { ProtectedRoute } from "./router/ProtectedRoutes";
import { WelcomePage } from "./features/welcom/welcom.page";
import { AuthLayout } from "./layout/AuthLayout";
import { AppLayout } from "./layout/ApplicationLayout";
import { Dashboard } from "./features/dashboard/dashboard.page";
import { NotificationPage } from "./features/notifications/notification.page";
import { AppDataProvider } from "./core/state/AppDataContext";
import { LoginPage } from "./features/auth/login.page";

export default function App(){
  return (
    
    <AuthProvider>
       <BrowserRouter>
      
     
        <Routes>
          <Route element={<AuthLayout/>}>
            <Route path="/login" element={<LoginPage/>}></Route>
            {/* <Route path="/singin" element={<SinginPage/>}/> */}
          </Route>
          <Route element={<AppDataProvider><ProtectedRoute/></AppDataProvider>}>
         
            <Route element={<AppLayout/>}>
              <Route path="/" element={<WelcomePage/>}/>
              <Route path="/dashboard" element={<Dashboard/>}> </Route>
                <Route path="/notifications" element={<NotificationPage/>}> </Route>
            </Route>
             
          </Route>
        </Routes>
   
    
       </BrowserRouter>
    </AuthProvider>
      
  )
}