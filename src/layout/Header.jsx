import reactLogo from "../assets/hero.png"
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const pageTitles = {
  "/Dashboard": "لوحة التحكم",
  "/analytics": "التحليلات والتدفقات",
  "/accounts": "الحسابات المربوطة",
  "/add-account": "إضافة حساب جديد",
  "/transactions": "سجل المعاملات",
  "/single-transfer": "تحويل فردي بين حسابين",
  "/multi-transfer": "تحويل متعدد المصادر",
  "/notifications": "الإشعارات والتنبيهات",
  "/sync-status": "حالة مزامنة المزودين",
  "/settings": "إعدادات الحساب والربط",
};
export function Header() {
  const navigate=useNavigate();
    const location = useLocation();
    const pageTitle = pageTitles[location.pathname] || "لوحة التحكم"
  return (
  <div className="header">
    <div className="header-container">
      <div className="right-side">
       
        <h3>FWallet/</h3>
        <h3>{pageTitle}</h3>
          </div>
  <div className="left-side ">
   <button className="sync">
    <span>مزامنة الحسابات</span>
    <i className="fa-solid fa-rotate"></i>
   </button>
    <button  className="transfer" onClick={()=>{navigate("/single-transfer")}}>
    <span>تحويل مالي جديد</span>
    <i className="fa-regular fa-paper-plane"></i>
  </button>
      <button className="notification" onClick={()=>{navigate("/notifications")}}>
      <i className="fa-regular fa-bell"></i>
    </button>
     <div className="header-profile">
    <div className="profile-head-img">
        <img  src={reactLogo}></img>  
    </div>
    </div>
  </div>  

    </div>
  
  </div>);
}
