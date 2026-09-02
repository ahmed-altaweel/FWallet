import { useState } from "react";
import {ContainerBox} from "../../shared/utils/ContainerBox";

import { useNavigate } from "react-router-dom";
import "./notification.style.css";

const today = new Date().toLocaleString("ar-SA");

const Data = [
    {
        userId: "usr_fwallet_01",
        title: "اكتمال التحويل بنجاح",
        message:
            "تم تحويل مبلغ 2,500.00 ريال بنجاح من حساب الأهلي إلى حساب الراجحي الجاري.",
        IsRead: false,
        date: today,
        type: "transfer",
        icon: "↔",
    },

    {
        userId: "usr_fwallet_02",
        title: "تأكيد مزامنة المزودات",
        message:
            "تمت مزامنة جميع الحسابات المربوطة بنجاح.",
        IsRead: true,
        date: today,
        type: "sync",
        icon: "↻",
    },

    {
        userId: "usr_fwallet_03",
        title: "إيداع مالي جديد عبر Webhook",
        message:
            "استقبل النظام إشعار إيداع 1,250.00 USD.",
        IsRead: false,
        date: today,
        type: "webhook",
        icon: "⚡",
    },

    {
        userId: "usr_fwallet_04",
        title: "تنبيه الموازنة",
        message:
            "اقترب الإنفاق من الحد المحدد للموازنة.",
        IsRead: true,
        date: today,
        type: "budget",
        icon: "⚠",
    },
];



export function Button({
    children,
    active = false,
    onClick,
}) {
    return (
        <button
            className={`notification-tab ${active ? "active" : ""}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}




export function Notification({ notification }) {

    return (
        <div className="NotificationItem">

            <div
                className={`notification-icon ${notification.type}`}
            >
                {notification.icon}
            </div>


            <div className="notification-content">

                <div className="notification-title">

                    {!notification.IsRead && (
                        <span className="unread-dot"></span>
                    )}

                    {notification.title}

                </div>


                <div className="notification-message">
                    {notification.message}
                </div>

            </div>


            <div className="notification-date">
                {notification.date}
            </div>

        </div>
    );
}




export function NotificationPage() {
   const navigate=useNavigate();

    const [activeTab, setActiveTab] = useState("all");


  

    const filteredData = Data.filter((notification) => {

        if (activeTab === "all") {
            return true;
        }

        if (activeTab === "unread") {
            return notification.IsRead === false;
        }

        if (activeTab === "transfer") {
            return notification.type === "transfer";
        }

        if (activeTab === "webhook") {
            return notification.type === "webhook";
        }

        if (activeTab === "budget") {
            return notification.type === "budget";
        }

        return true;
    });


   
    return (
<>
    

        <div
            className="notifications-page"
            dir="rtl"
        >
         
   <ContainerBox>
     <h1> الاشعارات 
</h1>
<h3> الاشعارات زززززز </h3>
   </ContainerBox>
            

            <div className="notification-tabs">

                <Button
                    active={activeTab === "all"}
                    onClick={() => setActiveTab("all")}
                >
                    كافة الإشعارات ({Data.length})
                </Button>


                <Button
                    active={activeTab === "unread"}
                    onClick={() => setActiveTab("unread")}
                >
                    غير المقروءة (
                    {
                        Data.filter(
                            notification => !notification.IsRead
                        ).length
                    }
                    )
                </Button>


                <Button
                    active={activeTab === "transfer"}
                    onClick={() => setActiveTab("transfer")}
                >
                    التحويلات
                </Button> 
                <Button
                    active={activeTab === "webhook"}
                    onClick={() => setActiveTab("webhook")}
                >
                    Webhooks
                </Button>
                <Button
                    active={activeTab === "budget"}
                    onClick={() => setActiveTab("budget")}
                >
                    تنبيهات الموازنة
                </Button>

            </div>



            <div className="notifications-card">

                {filteredData.map((notification) => (

                    <Notification
                        key={notification.userId}
                        notification={notification}
                        onClick={() => navigate(`/transactions/${notification.userId}`)}
                    />

                ))}

            </div>

        </div>
   </> );
}
