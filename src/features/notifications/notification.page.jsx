import { useState } from "react";
import {ContainerBox} from "@/shared/utils/ContainerBox";
import { useAuth } from "../../core/auth/AuthContext";
import { useQuery } from "@tanstack/react-query";
import {fetchData} from "@/shared/utils/FetchData";

import { useNavigate } from "react-router-dom";
import "./notification.style.css";





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




export function Notification({ notification,onClick }) {

    return (
        <div className="NotificationItem"
        
        
        onClick={onClick}>

            <div
                className={`notification-icon ${notification.type}`}
            >
                {notification.icon}
            </div>


            <div className="notification-content">

                <div className="notification-title">

                    {!notification.isRead && (
                        <span className="unread-dot"></span>
                    )}

                    {notification.title}

                </div>


                <div className="notification-message">
                    {notification.message}
                </div>

            </div>


            <div className="notification-date">
                  {new Date().toLocaleString("ar-SA")}
            </div>

        </div>
    );
}




export function NotificationPage () {
   const navigate=useNavigate();
  const {token}=useAuth();

    const [activeTab, setActiveTab] = useState("all");
  

    const {
        data:notifications=[],
        isLoading,
        isError,
        error
    }=useQuery({queryKey:["notifications",token],
   queryFn:()=>fetchData("NotificationData.json",token),
   enabled:!!token,


    })


    if(isLoading){
        return (   <div>
            جاري التحميل ...
        </div>
        );
    }
    if(isError){
        return(  <div>
            خكأ 
            {error?.message}

        </div> );
    }
  

    const filteredData = notifications?.filter((notification) => {

        if (activeTab === "all") {
            return true;
        }

        if (activeTab === "unread") {
            return notification.isRead === false;
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
<h3> الاشعارات ............ </h3>
   </ContainerBox>
            

            <div className="notification-tabs">

                <Button
                    active={activeTab === "all"}
                    onClick={() => setActiveTab("all")}
                >
                    كافة الإشعارات ({notifications.length})
                </Button>


                <Button
                    active={activeTab === "unread"}
                    onClick={() => setActiveTab("unread")}
                >
                    غير المقروءة (
                    {
                        notifications?.filter(
                            notification => !notification.isRead
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
                        onClick={() => navigate(`/transactions/${notification.userId}`,{state:{transactionData:notification}})}
                    />

                ))}

            </div>

        </div>
   </> );
}
