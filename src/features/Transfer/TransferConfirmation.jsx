import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { confirmTransfer } from "./Transfer.Api";
import { useAuth } from "../../core/auth/AuthContext";
import { EmptyState } from "@/shared/components/states";

import "./TransferConfirmation.css";

export  function TransferConfirmation() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const { state } = useLocation();

    const transfer = state?.transfer;

    const mutation = useMutation({
        mutationFn: () => {
            if (transfer.type === "multi") {
                return confirmTransfer(token, {
                    type: "multi",
                    destinationAccountId: transfer.destinationAccount.id,
                    sources: transfer.sources.map(source => ({
                        accountId: source.accountId,
                        amount: Number(source.amount)
                    }))
                });
            }

            return confirmTransfer(token, {
                type: "single",
                sourceAccountId: transfer.sourceAccount.id,
                destinationAccountId: transfer.destinationAccount.id,
                amount: Number(transfer.amount)
            });
        },

        onSuccess: result => {
            navigate("/transfer-status", {
                state: {
                    transferId: result.transfer.id
                }
            });
        }
    });

    if (!transfer) {
        return (
            <EmptyState
                title="لا توجد بيانات للتحويل"
                message="لم يتم العثور على بيانات التحويل المطلوبة، يرجى بدء التحويل من جديد."
                actionLabel="العودة إلى صفحة التحويل"
                onAction={() => navigate("/single-transfer")}
            />
        );
    }

    const isMulti = transfer.type === "multi";

    const source = isMulti
        ? transfer.sources
        : [transfer.sourceAccount];

    const destination = isMulti
        ? transfer.destinationAccount
        : transfer.destinationAccount;

    const amount = isMulti
        ? transfer.totalAmount
        : transfer.amount;

    const currency = isMulti
        ? transfer.destinationAccount.currency
        : transfer.sourceAccount.currency;

    return (
        <div className="transfer-confirmation-page">
            <div className="transfer-confirmation-container">

                <header className="confirmation-header">
                    <h1>تأكيد التحويل</h1>
                    <p>
                        يرجى مراجعة بيانات التحويل بعناية قبل تأكيد العملية.
                    </p>
                </header>

                <div className="confirmation-card">

                    <div className="confirmation-notice">
                        <div className="confirmation-notice-icon">!</div>

                        <div>
                            تأكد من أن بيانات الحسابات والمبالغ صحيحة
                            قبل تنفيذ التحويل.
                        </div>
                    </div>

                    <div className="confirmation-summary">

                        <div className="confirmation-row">
                            <span className="confirmation-label">
                                {isMulti
                                    ? "الحسابات المصدر"
                                    : "الحساب المصدر"}
                            </span>

                            <div className="confirmation-account">
                                {source.map(account => (
                                    <Account
                                        key={account.accountId || account.id}
                                        name={account.name}
                                        id={account.accountId || account.id}
                                        amount={account.amount}
                                        currency={account.currency}
                                        multi={isMulti}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="confirmation-direction">
                            <div className="confirmation-direction-icon">
                                ↓
                            </div>
                        </div>

                        <div className="confirmation-row">
                            <span className="confirmation-label">
                                الحساب الوجهة
                            </span>

                            <Account
                                name={destination.name}
                                id={destination.id}
                            />
                        </div>

                        {isMulti && (
                            <InfoRow
                                label="الإجمالي"
                                value={transfer.totalAmount}
                            />
                        )}

                        {!isMulti && (
                            <InfoRow
                                label="العملة"
                                value={transfer.sourceAccount.currency}
                            />
                        )}

                    </div>

                    <div className="confirmation-amount">
                        <span className="confirmation-amount-label">
                            المبلغ المراد تحويله
                        </span>

                        <span className="confirmation-amount-value">
                            {amount} {currency}
                        </span>
                    </div>

                    {mutation.isError && (
                        <div className="confirmation-error">
                            <strong>فشل تنفيذ التحويل</strong>
                            <br />
                            {mutation.error?.message ||
                                "حدث خطأ أثناء تنفيذ التحويل."}
                        </div>
                    )}

                    <div className="confirmation-actions">

                        <button
                            type="button"
                            className="cancel-transfer-button"
                            onClick={() => navigate(-1)}
                            disabled={mutation.isPending}
                        >
                            إلغاء
                        </button>

                        <button
                            type="button"
                            className="confirm-transfer-button"
                            onClick={() => mutation.mutate()}
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? (
                                <span className="confirm-transfer-loading">
                                    <span className="confirm-transfer-spinner" />
                                    جاري تنفيذ التحويل...
                                </span>
                            ) : (
                                "تأكيد التحويل"
                            )}
                        </button>

                    </div>

                </div>
            </div>
        </div>
    );
}

function Account({
    name,
    id,
    amount,
    currency,
    multi
}) {
    return (
        <div className={multi ? "confirmation-source" : "confirmation-account"}>
            <span className="confirmation-account-name">
                {name}
            </span>

            <span className="confirmation-account-id">
                {multi ? `${amount} ${currency}` : id}
            </span>
        </div>
    );
}


function InfoRow({ label, value }) {
    return (
        <div className="confirmation-row">
            <span className="confirmation-label">
                {label}
            </span>

            <span className="confirmation-value">
                {value}
            </span>
        </div>
    );
}
