import { SideBar } from "./Sidebar.jsx";
import { Header } from "./Header.jsx";
import { Outlet } from "react-router-dom";
import './layout.css'
export function AppLayout() {
  return (
    <div className="app-shell">
      <div className="app-main">
          <header className="app-header" id="header">
          <Header></Header>
        </header>
           <aside className="app-sidebar" id="sidebar">
          <SideBar></SideBar>
        </aside>
           <main  id="page-content">
            <Outlet></Outlet>
        </main>
        <footer>جميع الحقوق محفوظة لدى SmartSegmmaSoft</footer>
      </div>
    </div>
  );
}
