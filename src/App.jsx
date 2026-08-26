import { Route,Routes,BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./core/auth/AuthContext";
import { ProtectedRoute } from "./router/ProtectedRoutes";
import { WelcomePage } from "./features/welcom/welcom.page";
import { AuthLayout } from "./layout/AuthLayout";
import { AppLayout } from "./layout/ApplicationLayout";

export default function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout/>}>
            {/* <Route path="/login" element={<LoginPage/>}></Route>
            <Route path="/singin" element={<SinginPage/>}/> */}
          </Route>
          <Route element={<ProtectedRoute/>}>
            <Route element={<AppLayout/>}>
              <Route path="/" element={<WelcomePage/>}/>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}