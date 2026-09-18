import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { NotificationBell } from "../features/notifications/NotificationBell.jsx";
import { useAppData } from "../core/state/useAppData.jsx";
import {Bell} from "lucide-react"
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
    const { data } = useAppData(); 
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
  
    <button  className="transfer" onClick={()=>{navigate("/single-transfer")}}>
    <span>تحويل مالي جديد</span>
    <i className="fa-regular fa-paper-plane"></i>
  </button>
    <NotificationBell>

    <button
        className="notification"
        onClick={() => {
            navigate("/notifications");
        }}
    >
        {/* <i className="fa-regular fa-bell"></i> */}
        <Bell size={22}/>
    </button>

</NotificationBell>
     <div className="header-profile">
    <div className="profile-head-img profile-image">
        <img  src={data.img}></img>  
    </div>
    </div>
  </div>  

    </div>
  
  </div>);
}
