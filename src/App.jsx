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
import {AccountsPage} from "./features/accounts/accounts.page";
import "./features/auth/login.style.css";
import MultiSourceTransfer from "./features/Transfer/MultiSourceTransfer.jsx";
import SingleTransfer from "./features/Transfer/SingleTransfer.jsx";
import TransferConfirmation from "./features/Transfer/TransferConfirmation.jsx";
import TransferStatus from "./features/Transfer/TransferStatus.jsx";

import { SettingsPage } from "./features/settings/settings.page";

export default function App(){
  return (
    
    <AuthProvider>
       <BrowserRouter>
      
      
        <Routes>
           <Route path="/" element={<WelcomePage/>}/>
            <Route element={<AuthLayout/>}>
            <Route path="/login" element={<LoginPage/>}></Route>
            <Route path="/signup" element={<SignupPage/>}/>
              
          </Route>
          <Route element={<ProtectedRoute/>}>
         
            <Route element={<AppDataProvider><AppLayout/></AppDataProvider>}>
            
              <Route path="/dashboard" element={<Dashboard/>}> </Route>
                <Route path="/notifications" element={<NotificationPage  />}> </Route>
                <Route path="/transactions" element={<TransactionsPage/>}></Route>
                 <Route path="/settings" element={<SettingsPage/>}></Route>
                 <Route
            path="/transactions/:id"
            element={<TransactionDetails/>}
        />
        <Route path="/single-transfer" element={<SingleTransfer/>}></Route>
        <Route path="/multi-transfer" element={<MultiSourceTransfer/>}></Route>
        <Route path="/transfer-confirmation" element={<TransferConfirmation/>}></Route>
        <Route path="/transfer-status" element={<TransferStatus/>}></Route>
            </Route>
            
             <Route path="/accounts" element={<AccountsPage/>}>  </Route>
          </Route>
        </Routes>
   
    
       </BrowserRouter>
    </AuthProvider>
      
  )
}