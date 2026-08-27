import {  NavLink } from "react-router-dom";
import reactLogo from "../assets/hero.png"
import logo from "../assets/fwallet-icon.svg"
import { useAppData } from "../core/state/AppDataContext";
const isActive=false
export function SideBar() {
  const {data,status}=useAppData()
 
  return (
    <>
    <button className="logo-container">
              <img src={logo} alt="logo" className="logo"/>
              <h2>FWallet</h2>
              <p>تحكم مالي شامل من مكان واحد</p>
            </button>

      <hr></hr>
    <section className="menu-group">
      <p>الرئيسية</p>
      <ul>
        <li>
          < NavLink className={({isActive})=>
          isActive? "nav-item active" :"nav-item"} to='/Dashboard'>
            <div className="nav-container">
 <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-dashboard-icon lucide-layout-dashboard"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            <p>لوحة التحكم</p>
            </div>
           
            
            </NavLink>
        </li>
        <li>
          < NavLink className={({isActive})=>
          isActive? "nav-item active" :"nav-item"} to='/analytics'>
       
             <div className="nav-container">
                       <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chart-column-icon lucide-chart-column"><path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
            <p>التحليلات والتدفقات</p>
            </div>
</NavLink>
        </li>
      </ul>
    </section><section className="menu-group">
        <p>الحسابات والمزودون</p>
        <ul>
          <li>
            < NavLink className={({isActive})=>
            isActive? "nav-item active" :"nav-item"} to='/accounts'>
             
                   <div className="nav-container">
               <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wallet-cards-icon lucide-wallet-cards"><path d="M3 11h3.75a2 2 0 0 1 1.6.8l.45.6a4 4 0 0 0 6.4 0l.45-.6a2 2 0 0 1 1.6-.8H21"/><path d="M3 7h18"/><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                  <p>الحسابات المربوطة</p>
            </div>
                  {data.accounts!==0 &&<p className="badge">{data.accounts}</p>}
</NavLink>
          </li>
          <li>
            < NavLink className={({isActive})=>
            isActive? "nav-item active" :"nav-item"} to='/add-account'>
              
                 <div className="nav-container">
  <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-plus-icon lucide-circle-plus"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
                <p>إضافة حساب جديد</p>
            </div>
</NavLink>
          </li>
          <li>
            < NavLink className={({isActive})=>
            isActive? "nav-item active" :"nav-item"} to='/transactions'>
             
               <div className="nav-container">
 <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-receipt-text-icon lucide-receipt-text"><path d="M13 16H8"/><path d="M14 8H8"/><path d="M16 12H8"/><path d="M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z"/></svg>
              <p>سجل المعاملا</p>
            </div>
</NavLink>
          </li>
        </ul>
      </section><section className="menu-group">
        <p>التحويلات المالية</p>
        
        <ul>
          <li>
            < NavLink className={({isActive})=>
            isActive? "nav-item active" :"nav-item"} to='/single-transfer'>
            
             <div className="nav-container">
<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left-right-icon lucide-arrow-left-right"><path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/></svg>
            <p>تحويل فردي بين حسابين</p>
            </div>
</NavLink>
          </li>
          <li>
            < NavLink className={({isActive})=>
            isActive? "nav-item active" :"nav-item"} to='/multi-transfer'>
            
             <div className="nav-container">
<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layers-icon lucide-layers"><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/></svg>
            <p>تحويل متعدد المصادر</p>
            </div>
</NavLink>
          </li>

        </ul>
      </section><section className="menu-group">
        <p> النظام والمزامنة</p>
        <ul>
          <li>
            < NavLink className={({isActive})=>
            isActive? "nav-item active" :"nav-item"} to='/notifications'>
           
               <div className="nav-container">
   <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell-icon lucide-bell"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg>
              <p>الإشعارت والتنبيهات</p>
            </div>
               {data.notifications_unread!==0 && (
    <p className="badge">{data.notifications_unread}</p>
  
)}
</NavLink>
          </li>
          <li>
            < NavLink className={({isActive})=>
            isActive? "nav-item active" :"nav-item"} to='/sync-status'>
             
              
                <div className="nav-container">
 <i className="fa-solid fa-rotate"></i>
               <p>حالة مزامنة المزودين</p>
            </div>
</NavLink>
          </li>
          <li>
            < NavLink className={({isActive})=>
            isActive? "nav-item active" :"nav-item"} to='/settings'>
         
             <div className="nav-container">
   <i className="fa-solid fa-gear"></i>
            <p>إعدادات الحساب والربط</p>
            </div>
</NavLink>
          </li>
        </ul>
      </section>

<hr></hr>
<div>
          <button className="profile">
        <div className="profile-img">
            <img  src={reactLogo}></img>  
        </div>
        <div className="profile-title">
          <p>أحمد الطويل</p>
        <h6>جلسة نشطة</h6>
        </div>
    </button>
    <button className="logout-sidebar">
      <i className="fa-solid fa-arrow-right-from-bracket"></i>
       <p>تسجيل الخروج</p></button>
    </div>
      </>);
}
