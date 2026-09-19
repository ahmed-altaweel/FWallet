import { StateView } from "./StateView";

export function LoadingState({
    title = "جاري التحميل",
    message = "يرجى الانتظار قليلًا...",
    size = "md"
}) {
    return (
        <StateView
            tone="loading"
            size={size}
            icon={<span className="state-spinner" />}
            title={title}
            message={message}
        />
    );
}
