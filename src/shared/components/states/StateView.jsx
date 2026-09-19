import "./state.style.css";

export function StateView({
    icon,
    title,
    message,
    tone = "default",
    size = "md",
    actionLabel,
    onAction,
    children
}) {
    return (
        <div
            className={`state-view state-view-${tone} state-view-${size}`}
            dir="rtl"
            role="status"
        >
            {icon && <div className="state-view-icon">{icon}</div>}

            {title && <h3 className="state-view-title">{title}</h3>}

            {message && <p className="state-view-message">{message}</p>}

            {actionLabel && onAction && (
                <button
                    type="button"
                    className="state-view-button"
                    onClick={onAction}
                >
                    {actionLabel}
                </button>
            )}

            {children}
        </div>
    );
}
