// src/features/notifications/notification.page.jsx
import { useEffect, useState } from "react";
import { Inbox } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "../../core/auth/AuthContext";
import { LoadingState, ErrorState, EmptyState } from "@/shared/components/states";
import { Pagination } from "@/shared/components/Pagination";
import { fetchPersistedData } from "@/shared/utils/PersistedData.jsx";
import "./notification.style.css";

const TABS = [
    { id: "all", label: "كافة الإشعارات" },
    { id: "unread", label: "غير المقروءة" },
    { id: "transfer", label: "التحويلات" },
    { id: "webhook", label: "Webhooks" },
    { id: "budget", label: "تنبيهات الموازنة" },
];

const PAGE_SIZE = 6;

export function Button({ children, active = false, onClick }) {
    return (
        <button type="button" className={`notification-tab ${active ? "active" : ""}`} onClick={onClick}>
            {children}
        </button>
    );
}

export function Notification({ notification, onClick }) {
    return (
        <div className="NotificationItem" onClick={onClick}>
            <div className={`notification-icon ${notification.type}`}>
                {notification.icon}
            </div>

            <div className="notification-content">
                <div className="notification-title">
                    {!notification.isRead && <span className="unread-dot" />}
                    {notification.title}
                </div>
                <div className="notification-message">{notification.message}</div>
            </div>

            <div className="notification-date">
                {new Date(notification.date).toLocaleString("ar-SA")}
            </div>
        </div>
    );
}

export function NotificationPage() {
    const navigate = useNavigate();
    const { token } = useAuth();

    const [activeTab, setActiveTab] = useState("all");
    const [page, setPage] = useState(1);

    const {
        data: notifications = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["notifications", token],
        queryFn: () => fetchPersistedData("notifications", "NotificationData.json", token),
        enabled: !!token,
    });

    const filteredData = notifications.filter((notification) => {
        if (activeTab === "all") return true;
        if (activeTab === "unread") return notification.isRead === false;
        return notification.type === activeTab;
    });

    const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
    const pagedData = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    useEffect(() => {
        setPage(1);
    }, [activeTab]);

    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [totalPages, page]);

    if (isLoading) {
        return <LoadingState message="جاري تحميل الإشعارات..." />;
    }

    if (isError) {
        return (
            <ErrorState
                title="تعذر تحميل الإشعارات"
                message={error?.message || "حدث خطأ أثناء جلب الإشعارات."}
                onRetry={refetch}
            />
        );
    }

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <div className="notifications-page" dir="rtl">
            <header className="notifications-header">
                <div>
                    <h1>الإشعارات والتنبيهات</h1>
                    <p>تابع كل ما يخص حسابك وعملياتك المالية أولًا بأول.</p>
                </div>
                <span className="notifications-unread-badge">{unreadCount} غير مقروءة</span>
            </header>

            <div className="notification-tabs">
                {TABS.map((tab) => (
                    <Button key={tab.id} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)}>
                        {tab.label}
                        {tab.id === "all" && ` (${notifications.length})`}
                    </Button>
                ))}
            </div>

            <div className="notifications-card">
                {pagedData.length === 0 ? (
                    <EmptyState
                        icon={<Inbox size={24} />}
                        title="لا توجد إشعارات"
                        message="لا توجد إشعارات ضمن هذا التصنيف حاليًا."
                        size="sm"
                    />
                ) : (
                    pagedData.map((notification) => (
                        <Notification
                            key={notification.userId}
                            notification={notification}
                            onClick={() =>
                                navigate(`/transactions/${notification.userId}`, {
                                    state: { transactionData: notification },
                                })
                            }
                        />
                    ))
                )}
            </div>

            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    );
}