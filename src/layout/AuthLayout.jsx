import { Outlet } from "react-router-dom";
export function AuthLayout() {
  return (
    <div className="auth-shell">
      <div className="auth-box">
        <h1 className="auth-logo">💳 FWallet</h1>
        <div id="page-content">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
}
