import { useNavigate, useLocation } from "react-router-dom";
import { ContainerBox } from "@/shared/utils/ContainerBox";
import { EmptyState } from "@/shared/components/states";
import "./TransactionDetails.style.css";

export function TransactionDetails() {
    const navigate = useNavigate();
    const location = useLocation();

    const data = location.state?.transactionData;

    if (!data) {
        return (
            <EmptyState
                title="لا توجد بيانات للمعاملة"
                message="لم يتم العثور على تفاصيل هذه المعاملة، يرجى فتحها من سجل المعاملات."
                actionLabel="الذهاب إلى سجل المعاملات"
                onAction={() => navigate("/transactions")}
            />
        );
    }

    return (
        <div className="custom-details-wrapper" dir="rtl">
            <ContainerBox className="custom-card-box">

                <div className="custom-card-header">
                    <div className="custom-amount-group">
                        <span className="custom-amount-val">
                            {data.amount}
                        </span>
                        <span className="custom-currency-badge">
                            {data.currency}
                        </span>
                    </div>
                    <h3 className="custom-title">
                        {data.title}
                    </h3>
                </div>

                <div className="custom-card-body">
                    <div className="custom-field-col">
                        <span className="custom-label">إلى:</span>
                        <strong className="custom-value">
                            {data.to}
                        </strong>
                    </div>
                    <div className="custom-field-col">
                        <span className="custom-label">من:</span>
                        <strong className="custom-value">
                            {data.from}
                        </strong>
                    </div>
                </div>

                <div className="custom-card-footer">
                    <span className="custom-date-val">
                        {data.date}
                    </span>
                    <span className={`custom-status-pill status-${(data.status || "success").toLowerCase()}`}>
                        {data.status}
                    </span>
                </div>

            </ContainerBox>
        </div>
    );
}
