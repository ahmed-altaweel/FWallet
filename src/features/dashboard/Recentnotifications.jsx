import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { fetchPersistedData } from "@/shared/utils/PersistedData.jsx";
import { LoadingState, ErrorState, EmptyState } from "@/shared/components/states";

export function RecentNotifications({ token }) {
    const navigate = useNavigate();

    const {
        data: notifications = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["dashboard_recent_notifications", token],
        queryFn: () => fetchPersistedData("notifications", "NotificationData.json", token),
        enabled: !!token,
    });

    const recent = useMemo(() => notifications.slice(0, 4), [notifications]);

    return (
        <div className="dashboard-panel">
            <div className="dashboard-panel-header">
                <h3>آخر الإشعارات</h3>
                <button type="button" onClick={() => navigate("/notifications")}>
                    عرض الكل
                    <ChevronLeft size={14} />
                </button>
            </div>

            {isLoading && (
                <LoadingState message="جاري تحميل الإشعارات..." size="sm" />
            )}

            {isError && (
                <ErrorState
                    title="تعذر تحميل الإشعارات"
                    message={error?.message || "حدث خطأ أثناء جلب الإشعارات."}
                    size="sm"
                    onRetry={refetch}
                />
            )}

            {!isLoading && !isError && recent.length === 0 && (
                <EmptyState
                    title="لا توجد إشعارات"
                    message="لا توجد إشعارات جديدة حاليًا."
                    size="sm"
                />
            )}

            {!isLoading && !isError && recent.length > 0 && (
                <div className="dashboard-notifications-list">
                    {recent.map(notification => (
                        <div className="dashboard-notification-row" key={notification.userId}>
                            <span className={`dashboard-notification-icon ${notification.type}`}>
                                {notification.icon}
                            </span>

                            <div className="dashboard-notification-body">
                                <div className="dashboard-notification-title">
                                    {!notification.isRead && (
                                        <span className="dashboard-unread-dot" />
                                    )}
                                    {notification.title}
                                </div>
                                <span>{notification.message}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}