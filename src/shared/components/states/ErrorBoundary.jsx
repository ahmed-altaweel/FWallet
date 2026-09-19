import { Component } from "react";
import { ErrorState } from "./ErrorState";

export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, message: "" };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, message: error?.message ?? "" };
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <ErrorState
                    title="حدث خطأ غير متوقع"
                    message={this.state.message || "تعذر عرض هذه الصفحة."}
                    actionLabel="إعادة تحميل الصفحة"
                    onRetry={this.handleReload}
                />
            );
        }

        return this.props.children;
    }
}
