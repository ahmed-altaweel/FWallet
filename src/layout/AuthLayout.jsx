import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="auth-shell">
      <div className="auth-box">
       
        <div className="auth-page-content">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
}
