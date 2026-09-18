

import { useParams, useLocation } from "react-router-dom";
import { ContainerBox } from "@/shared/utils/ContainerBox";
import "./TransactionDetails.style.css";

export function TransactionDetails() {
    const { id } = useParams();
    const location = useLocation();

    const data = location.state?.transactionData;

    return (
        <div className="custom-details-wrapper" dir="rtl">
            <ContainerBox className="custom-card-box">
               
                <div className="custom-card-header">
                    <div className="custom-amount-group">
                        <span className="custom-amount-val">
                            {data?.amount || "2,500.00"}
                        </span>
                        <span className="custom-currency-badge">
                            {data?.currency || "SAR"}
                        </span>
                    </div>
                    <h3 className="custom-title">
                        {data?.title || "تحويل مالی"}
                    </h3>
                </div>


                <div className="custom-card-body">
                    <div className="custom-field-col">
                        <span className="custom-label">إلى:</span>
                        <strong className="custom-value">
                            {data?.to || "حساب الراجحي الجاري"}
                        </strong>
                    </div>
                    <div className="custom-field-col">
                        <span className="custom-label">من:</span>
                        <strong className="custom-value">
                            {data?.from || "حساب الأهلي"}
                        </strong>
                    </div>
                </div>

                
                <div className="custom-card-footer">
                    <span className="custom-date-val">
                        {data?.date || "08/25"}
                    </span>
                    <span className={`custom-status-pill status-${(data?.status || "success").toLowerCase()}`}>
                        {data?.status || "Success"}
                    </span>
                </div>

            </ContainerBox>
        </div>
    );
}