
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAccounts, validateSingleTransfer } from "./Transfer.Api";
import { useAuth } from "../../core/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { LoadingState, ErrorState, EmptyState } from "@/shared/components/states";
import { CustomSelect } from "@/shared/components/customSelect/CustomSelect";
import "./SingleTransfer.css";

export function SingleTransfer() {
    const navigate = useNavigate();
    const { token } = useAuth();

    const [sourceAccountId, setSourceAccountId] = useState("");
    const [destinationAccountId, setDestinationAccountId] = useState("");
    const [amount, setAmount] = useState("");
    const [validationError, setValidationError] = useState(null);

    const {
        data: accounts = [],
        isLoading,
        isError,
        error,
        refetch
    } = useQuery({
        queryKey: ["accounts", token],

        queryFn: () =>
            getAccounts(token),

        enabled: !!token
    });

    async function handleSubmit(event) {
        event.preventDefault();

        setValidationError(null);

        const result = await validateSingleTransfer(
            token,
            {
                sourceAccountId,
                destinationAccountId,
                amount: Number(amount)
            }
        );

        if (!result.valid) {
            setValidationError(result.message);
            return;
        }

        navigate(
            "/transfer-confirmation",
            {
                state: {
                    transfer: {
                        type: "single",

                        sourceAccount:
                            result.sourceAccount,

                        destinationAccount:
                            result.destinationAccount,

                        amount:
                            result.amount
                    }
                }
            }
        );
    }

    if (isLoading) {
        return (
            <LoadingState
                title="جاري تحميل الحسابات"
                message="يرجى الانتظار قليلًا..."
            />
        );
    }

    if (isError) {
        return (
            <ErrorState
                title="تعذر تحميل الحسابات"
                message={error?.message || "حدث خطأ أثناء جلب حساباتك."}
                onRetry={refetch}
            />
        );
    }

    if (accounts.length < 2) {
        return (
            <EmptyState
                title="لا توجد حسابات كافية"
                message="يجب أن يكون لديك حسابان على الأقل لإجراء تحويل داخلي."
            />
        );
    }

    const sourceAccount =
        accounts.find(
            account =>
                String(account.id) ===
                String(sourceAccountId)
        );

    const destinationAccount =
        accounts.find(
            account =>
                String(account.id) ===
                String(destinationAccountId)
        );

    const sourceAccountOptions =
        accounts.map(account => ({
            value: account.id,
            label: `${account.name} — ${account.balance} ${account.currency}`
        }));

    const destinationAccountOptions =
        accounts.map(account => ({
            value: account.id,
            label: `${account.name} — ${account.currency}`
        }));

    return (
        <div className="single-transfer-page">

            <div className="single-transfer-container">

                <header className="transfer-header">

                    <h1>
                        تحويل مالي جديد
                    </h1>

                    <p>
                        تحويل الأموال بين حساباتك
                    </p>

                </header>

                <div className="transfer-card">

                    <form
                        className="transfer-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="form-group">

                            <label
                                className="form-label"
                                htmlFor="source-account"
                            >
                                الحساب المصدر
                            </label>

                            <CustomSelect
                                id="source-account"
                                name="sourceAccountId"
                                options={sourceAccountOptions}
                                value={sourceAccountId}
                                onChange={event =>
                                    setSourceAccountId(
                                        event.target.value
                                    )
                                }
                                placeholder="اختر الحساب الذي سيتم الخصم منه"
                                required
                            />

                        </div>

                        <div className="transfer-direction">

                            <div className="transfer-arrow">
                                ↓
                            </div>

                        </div>

                        <div className="form-group">

                            <label
                                className="form-label"
                                htmlFor="destination-account"
                            >
                                الحساب الوجهة
                            </label>

                            <CustomSelect
                                id="destination-account"
                                name="destinationAccountId"
                                options={destinationAccountOptions}
                                value={destinationAccountId}
                                onChange={event =>
                                    setDestinationAccountId(
                                        event.target.value
                                    )
                                }
                                placeholder="اختر الحساب الذي سيتم التحويل إليه"
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label
                                className="form-label"
                                htmlFor="transfer-amount"
                            >
                                المبلغ
                            </label>

                            <div className="amount-wrapper">

                                <input
                                    dir="ltr"
                                    id="transfer-amount"
                                    className="form-input"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={event =>
                                        setAmount(
                                            event.target.value
                                        )
                                    }
                                    required
                                />

                                {sourceAccount && (
                                    <span
                                        dir="ltr"
                                        className="amount-currency"
                                    >
                                        {sourceAccount.currency}
                                    </span>
                                )}

                            </div>

                        </div>

                        {validationError && (
                            <div className="validation-error">
                                {validationError}
                            </div>
                        )}

                        <button
                            className="review-button"
                            type="submit"
                        >
                            مراجعة التحويل
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}

