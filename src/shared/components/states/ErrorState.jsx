import { TriangleAlert } from "lucide-react";
import { StateView } from "./StateView";

export function ErrorState({
    title = "حدث خطأ",
    message = "تعذر إتمام العملية، يرجى المحاولة مرة أخرى.",
    size = "md",
    actionLabel = "إعادة المحاولة",
    onRetry
}) {
    return (
        <StateView
            tone="error"
            size={size}
            icon={<TriangleAlert size={24} />}
            title={title}
            message={message}
            actionLabel={onRetry ? actionLabel : undefined}
            onAction={onRetry}
        />
    );
}
