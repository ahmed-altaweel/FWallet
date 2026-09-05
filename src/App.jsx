import { Route,Routes,BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./core/auth/AuthContext";
import { ProtectedRoute } from "./router/ProtectedRoutes";
import { WelcomePage } from "./features/welcom/welcom.page";
import { AuthLayout } from "./layout/AuthLayout";
import { AppLayout } from "./layout/ApplicationLayout";
import { Dashboard } from "./features/dashboard/dashboard.page";
import { NotificationPage } from "./features/notifications/notification.page";
import { AppDataProvider } from "./core/state/AppDataProvider";
import { LoginPage } from "./features/auth/login.page";
import { SignupPage } from "./features/auth/signup.page";
import {TransactionsPage} from "./features/Transactions/Transaction.page";
import {TransactionDetails} from "./features/TransactionDetails/TransactionDetails.Page";
import "./features/auth/auth.style.css"
import { SettingsPage } from "./features/settings/settings.page";

export default function App(){
  return (
    
    <AuthProvider>
       <BrowserRouter>
      
     
        <Routes>
          <Route element={<AuthLayout/>}>
            <Route path="/login" element={<LoginPage/>}></Route>
            <Route path="/signup" element={<SignupPage/>}/>
              <Route path="/" element={<WelcomePage/>}/>
          </Route>
          <Route element={<ProtectedRoute/>}>
         
            <Route element={<AppDataProvider><AppLayout/></AppDataProvider>}>
            
              <Route path="/dashboard" element={<Dashboard/>}> </Route>
                <Route path="/notifications" element={<NotificationPage/>}> </Route>
                <Route path="/transactions" element={<TransactionsPage/>}></Route>
                 <Route path="/settings" element={<SettingsPage/>}></Route>
                 <Route
            path="/transactions/:id"
            element={<TransactionDetails/>}
        />
            </Route>
             
          </Route>
        </Routes>
   
    
       </BrowserRouter>
    </AuthProvider>
      
  )
}