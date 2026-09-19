import { Inbox } from "lucide-react";
import { StateView } from "./StateView";

export function EmptyState({
    title = "لا توجد بيانات",
    message = "لا توجد بيانات لعرضها في الوقت الحالي.",
    size = "md",
    icon,
    actionLabel,
    onAction
}) {
    return (
        <StateView
            tone="empty"
            size={size}
            icon={icon ?? <Inbox size={24} />}
            title={title}
            message={message}
            actionLabel={actionLabel}
            onAction={onAction}
        />
    );
}
