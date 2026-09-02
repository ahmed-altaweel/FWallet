import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ChartColumn,
  WalletCards,
  CirclePlus,
  ReceiptText,
  ArrowLeftRight,
  Layers,
  Bell,
  RotateCw,
  Settings,
  LogOut,
} from "lucide-react";
import reactLogo from "../assets/hero.png";

import { useAppData } from "../core/state/useAppData.jsx";
import { useAuth } from "../core/auth/AuthContext";
import { useNavigate } from "react-router-dom";
const MENU_SECTIONS = [
  {
    title: "الرئيسية",
    items: [
      { to: "/Dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
      { to: "/analytics", label: "التحليلات والتدفقات", icon: ChartColumn },
    ],
  },
  {
    title: "الحسابات والمزودون",
    items: [
      {
        to: "/accounts",
        label: "الحسابات المربوطة",
        icon: WalletCards,
        badgeKey: "accounts_count",
      },
      { to: "/add-account", label: "إضافة حساب جديد", icon: CirclePlus },
      { to: "/transactions", label: "سجل المعاملات", icon: ReceiptText },
    ],
  },
  {
    title: "التحويلات المالية",
    items: [
      {
        to: "/single-transfer",
        label: "تحويل فردي بين حسابين",
        icon: ArrowLeftRight,
      },
      { to: "/multi-transfer", label: "تحويل متعدد المصادر", icon: Layers },
    ],
  },
  {
    title: "النظام والمزامنة",
    items: [
      {
        to: "/notifications",
        label: "الإشعارات والتنبيهات",
        icon: Bell,
        badgeKey: "unread_notifications",
      },
      { to: "/sync-status", label: "حالة مزامنة المزودين", icon: RotateCw },
      { to: "/settings", label: "إعدادات الحساب والربط", icon: Settings },
    ],
  },
];


function navLinkClassName({ isActive }) {
  return isActive ? "nav-item active" : "nav-item";
}

function MenuItem({ to, label, icon: Icon, badgeValue }) {

  return (
    <li>
      <NavLink className={navLinkClassName} to={to}>
        <div className="nav-container">
          <Icon size={20} />
          <p>{label}</p>
        </div>
        {!!badgeValue && <p className="badge">{badgeValue}</p>}
      </NavLink>
    </li>
  );
}

export function SideBar() {
  const { data } = useAppData();
  const {logout}=useAuth()
  const navigate=useNavigate();

  return (
    <>
      <button className="logo-container">
        <img src="/fwallet-icon.svg"alt="logo" className="logo" />
        <h2>FWallet</h2>
        <p>تحكم مالي شامل من مكان واحد</p>
      </button>

      <hr />

      {MENU_SECTIONS.map((section) => (
        <section className="menu-group" key={section.title}>
          <p>{section.title}</p>
          <ul>
            {section.items.map((item) => (
              <MenuItem
                key={item.to}
                to={item.to}
                label={item.label}
                icon={item.icon}
                badgeValue={item.badgeKey ? data[item.badgeKey] : null}
              />
            ))}
          </ul>
        </section>
      ))}

      <hr />

      <div>
        <button className="profile">
          <div className="profile-img">
            <img src={reactLogo} alt="صورة المستخدم" />
          </div>
          <div className="profile-title">
            <p>أحمد الطويل</p>
            <h6>جلسة نشطة</h6>
          </div>
        </button>
        <button className="logout-sidebar"  onClick={()=>{logout() ;navigate("/login")}}>
          <LogOut size={18} />
          <p>تسجيل الخروج</p>
        </button>
      </div>
    </>
  );
}