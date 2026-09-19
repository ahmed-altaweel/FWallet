import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAccounts, validateSingleTransfer } from "./Transfer.Api";
import { useAuth } from "../../core/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { LoadingState, ErrorState, EmptyState } from "@/shared/components/states";
import "./SingleTransfer.css";

export  function SingleTransfer() {

    const navigate = useNavigate();
    const { token } = useAuth();

    const [sourceAccountId, setSourceAccountId] =
        useState("");

    const [destinationAccountId, setDestinationAccountId] =
        useState("");

    const [amount, setAmount] =
        useState("");

    const [validationError, setValidationError] =
        useState(null);

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

    const result =
        await validateSingleTransfer(
            token,
            {
                sourceAccountId,
                destinationAccountId,
                amount: Number(amount)
            }
        );

    if (!result.valid) {

        setValidationError(
            result.message
        );

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

                            <select
                                id="source-account"
                                className="form-select"
                                value={sourceAccountId}
                                onChange={event =>
                                    setSourceAccountId(
                                        event.target.value
                                    )
                                }
                                required
                            >

                                <option value="">
                                    اختر الحساب الذي سيتم الخصم منه
                                </option>

                                {accounts.map(account => (

                                    <option
                                        key={account.id}
                                        value={account.id}
                                    >

                                        {account.name}
                                        {" — "}
                                        {account.balance}
                                        {" "}
                                        {account.currency}

                                    </option>

                                ))}

                            </select>

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

                            <select
                                id="destination-account"
                                className="form-select"
                                value={destinationAccountId}
                                onChange={event =>
                                    setDestinationAccountId(
                                        event.target.value
                                    )
                                }
                                required
                            >

                                <option value="">
                                    اختر الحساب الذي سيتم التحويل إليه
                                </option>

                                {accounts.map(account => (

                                    <option
                                        key={account.id}
                                        value={account.id}
                                    >

                                        {account.name}
                                        {" — "}
                                        {account.currency}

                                    </option>

                                ))}

                            </select>

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

                                    <span dir="ltr" className="amount-currency">

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

