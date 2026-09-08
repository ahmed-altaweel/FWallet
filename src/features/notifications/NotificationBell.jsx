import { useNavigate } from "react-router-dom";
import { useAuth } from "../../core/auth/AuthContext";
import { useQuery } from "@tanstack/react-query";
import {fetchData} from "@/shared/utils/FetchData"


import "./NotificationBell.style.css";

export function NotificationBell({ children }) {

    const navigate = useNavigate();
    const{token}=useAuth();

     const {
        data:notificationData=[],
        isLoading,
        isError,
        error
    }=useQuery({queryKey:["notifications",token],
   queryFn:()=>fetchData("NotificationData.json",token),
   enabled:!!token,


    })  

    const notifications = Array.isArray(notificationData) ? notificationData : [];
    const unreadCount = notifications.filter(
        notification => !notification.isRead
    ).length;

    const latestNotifications = notifications.slice(0, 3);


    const handleNotificationClick = (notification) => {

        navigate(
            `/transactions/${notification.userId}`,
            {
                state: {
                    transactionData: notification
                }
            }
        );

    };


    return (
        <div className="notification-bell-container">

           

            {children}


      

            <div className="notification-dropdown">

            

                <div className="notification-dropdown-header">

                    <h3>
                        الإشعارات والتنبيهات
                    </h3>

                    <span>
                        {unreadCount} غير مقروءة
                    </span>

                </div>



                <div className="notification-dropdown-list">

                    {latestNotifications.map((notification) => (

                        <div
                            key={notification.userId}
                            className="notification-preview"
                            onClick={() =>
                                handleNotificationClick(notification)
                            }
                        >

                            <div
                                className={`notification-preview-icon ${notification.type}`}
                            >
                                {notification.icon}
                            </div>


                            <div className="notification-preview-content">

                                <div className="notification-preview-title">

                                    {!notification.isRead && (
                                        <span className="preview-unread-dot"></span>
                                    )}

                                    {notification.title}

                                </div>


                                <div className="notification-preview-message">
                                    {notification.message}
                                </div>


                                <div className="notification-preview-date">
                                    {notification.date}
                                </div>

                            </div>

                        </div>

                    ))}

                </div>


              

                <div className="notification-dropdown-footer">

                    <button
                        type="button"
                        onClick={() => navigate("/notifications")}
                    >
                        عرض جميع الإشعارات
                    </button>

                </div>

            </div>

        </div>
    );
}