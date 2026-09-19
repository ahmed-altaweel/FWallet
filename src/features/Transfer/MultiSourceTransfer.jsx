import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import {
    getAccounts,
    validateMultiSourceTransfer
} from "./Transfer.Api";

import { useAuth } from "../../core/auth/AuthContext";
import { LoadingState, ErrorState, EmptyState } from "@/shared/components/states";

import "./MultiSourceTransfer.css";

export  function MultiSourceTransfer() {

    const navigate = useNavigate();
    const { token } = useAuth();

    const [destinationAccountId, setDestinationAccountId] =
        useState("");

    const [sources, setSources] = useState([
        { accountId: "", amount: "" }
    ]);

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
        queryFn: () => getAccounts(token),
        enabled: !!token
    });
    function handleSourceChange(index, field, value) {

        const updated = [...sources];

        updated[index] = {
            ...updated[index],
            [field]: value
        };

        setSources(updated);
        setValidationError(null);
    }

  function addSource() {

        setSources([
            ...sources,
            { accountId: "", amount: "" }
        ]);
    }

    function removeSource(index) {
        if (sources.length === 1) return;
        setSources(sources.filter((_, i) => i !== index)
        );
    }

async function handleSubmit(event) {

    event.preventDefault();

    setValidationError(null);

    const result =
        await validateMultiSourceTransfer(
            token,
            {
                destinationAccountId,

                sources: sources.map(source => ({
                    accountId: source.accountId,
                    amount: Number(source.amount)
                }))
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
                    type: "multi",

                    destinationAccount:
                        result.destinationAccount,

                    sources:
                        result.sources.map(source => ({
                            accountId:
                                source.account.id,

                            name:
                                source.account.name,

                            amount:
                                source.amount,

                            currency:
                                source.account.currency,

                            balance:
                                source.account.balance
                        })),

                    totalAmount:
                        result.totalAmount
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
                message="يجب أن يكون لديك حسابان على الأقل لإجراء تحويل."
            />
        );
    }
    const totalAmount = sources.reduce(
        (total, source) =>
            total + (Number(source.amount) || 0),
        0
    );

    return (
        <div className="multi-transfer-page">
            <div className="multi-transfer-container">

                <header className="transfer-header">
                    <h1>تحويل من عدة حسابات</h1>
                    <p>
                        تجميع الأموال من عدة حسابات وتحويلها
                        إلى حساب واحد
                    </p>
                </header>

                <div className="transfer-card">

                    <form className="transfer-form" onSubmit={handleSubmit}>

                        <div className="form-group">

                               <h3>الحساب الوجهة</h3> 
                            

                            <select
                                className="form-select"
                                value={destinationAccountId}
                                onChange={event => {
                                    setDestinationAccountId(
                                        event.target.value
                                    );

                                    setValidationError(null);
                                    setValidatedTransfer(null);
                                }}
                                required
                            >
                                <option value="">
                                    اختر الحساب الوجهة
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

                        <div className="sources-header">

                            <h3>الحسابات المصدر</h3>

                            <button
                                type="button"
                                className="add-source-button"
                                onClick={addSource}
                            >
                                + إضافة حساب
                            </button>

                        </div>
                        {sources.map((source, index) => {

                            const account =
                                accounts.find(
                                    item =>
                                        String(item.id) ===
                                        String(source.accountId)
                                );

                            return (
                                <div
                                    className="source-row"
                                    key={index}
                                >

                                    <div className="form-group">

                                        <label className="form-label">
                                            المصدر {index + 1}
                                        </label>

                                        <select
                                            className="form-select"
                                            value={source.accountId}
                                            onChange={event =>
                                                handleSourceChange(
                                                    index,
                                                    "accountId",
                                                    event.target.value
                                                )
                                            }
                                            required
                                        >
                                            <option value="">
                                                اختر الحساب
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

                                    <div className="form-group">

                                        <label className="form-label">
                                            المبلغ
                                        </label>

                                        <div className="amount-wrapper">

                                            <input
                                                className="form-input"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                placeholder="0.00"
                                                value={source.amount}
                                                onChange={event =>
                                                    handleSourceChange(
                                                        index,
                                                        "amount",
                                                        event.target.value
                                                    )
                                                }
                                                required
                                            />

                                            {account && (
                                                <span className="amount-currency">
                                                    {account.currency}
                                                </span>
                                            )}

                                        </div>

                                    </div>

                                    {sources.length > 1 && (
                                        <button
                                            type="button"
                                            className="remove-source-button"
                                            onClick={() =>
                                                removeSource(index)
                                            }
                                        >
                                            حذف
                                        </button>
                                    )}

                                </div>
                            );
                        })}

                        <div className="transfer-total">

                            <span>
                                إجمالي التحويل
                            </span>

                            <strong>
                                {totalAmount}
                                {" "}
                                {sources[0]?.accountId &&
                                    accounts.find(
                                        account =>
                                            String(account.id) ===
                                            String(
                                                sources[0].accountId
                                            )
                                    )?.currency
                                }
                            </strong>

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

