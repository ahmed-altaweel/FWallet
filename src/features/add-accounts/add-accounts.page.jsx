import { useMemo, useState } from "react";
import {
    useMutation,
    useQuery,
    useQueryClient
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CircleCheck } from "lucide-react";

import { useAuth } from "@/core/auth/AuthContext";
import { Icon } from "@/shared/components/Icon";
import { LuxField } from "@/shared/components/LuxField";
import { FieldWrapper } from "@/shared/components/FieldWrapper";
import { CustomSelect } from "@/shared/components/customSelect/CustomSelect";
import { LoadingState, ErrorState, EmptyState } from "@/shared/components/states";

import { getProviders, connectAccount, CURRENCIES } from "./AddAccounts.Api";

import "./add-accounts.style.css";

const initialForm = {
    accountNumber: "",
    iban: "",
    currency: ""
};

const CURRENCY_OPTIONS = CURRENCIES.map(currency => ({
    value: currency.code,
    label: currency.name
}));

export function AddAccountsPage() {

    const { token } = useAuth();
    const navigate = useNavigate();
   const queryClient = useQueryClient();
    const [step, setStep] = useState(1);
    const [selectedProviderId, setSelectedProviderId] = useState("");
    const [form, setForm] = useState(initialForm);
    const [formError, setFormError] = useState("");


    const {
        data: providers = [],
        isLoading: isLoadingProviders,
        isError: isErrorProviders,
        error: providersError,
        refetch: refetchProviders
    } = useQuery({
        queryKey: ["connect-providers"],
        queryFn: getProviders
    });


    const selectedProvider = useMemo(
        () =>
            providers.find(
                provider => provider.id === selectedProviderId
            ),
        [providers, selectedProviderId]
    );


    const mutation = useMutation({
        mutationFn: () =>
            connectAccount(token, {
                providerId: selectedProviderId,
                accountNumber: form.accountNumber.trim(),
                iban: form.iban.trim(),
                currency: form.currency
            }),
        onSuccess: () => {
                queryClient.invalidateQueries({
                queryKey: ["accounts"]
        });
                queryClient.invalidateQueries({
                queryKey: ["providers"]
        });
    }
    });


    function setField(key, value) {
        setForm(prev => ({ ...prev, [key]: value }));
        setFormError("");
    }


    function goToDetails() {

        if (!selectedProviderId) {
            setFormError("يرجى اختيار المزود المالي أولًا.");
            return;
        }

        setFormError("");
        setStep(2);
    }


    function backToProviders() {
        mutation.reset();
        setFormError("");
        setStep(1);
    }


    function handleSubmit(event) {

        event.preventDefault();

        if (!form.accountNumber.trim()) {
            setFormError("يرجى إدخال رقم الحساب.");
            return;
        }

        if (!form.currency) {
            setFormError("يرجى اختيار عملة الحساب.");
            return;
        }

        setFormError("");
        mutation.mutate();
    }


    function connectAnother() {
        mutation.reset();
        setForm(initialForm);
        setSelectedProviderId("");
        setFormError("");
        setStep(1);
    }


    return (
        <div className="add-account-page">
            <div className="add-account-container">

                <header className="add-account-header">
                    <h1>ربط حساب مالي جديد</h1>
                    <p>
                        اختر المزود المالي، ثم أدخل بيانات الحساب لربطه بمحفظتك.
                    </p>
                </header>

                <div className="add-account-card">

                    {mutation.isSuccess ? (

                        <SuccessState
                            account={mutation.data}
                            onConnectAnother={connectAnother}
                            onGoToAccounts={() => navigate("/accounts")}
                        />

                    ) : (

                        <>
                            <div className="add-account-toolbar">

                                <div className="add-account-step-badge">
                                    الخطوة {step} من 2
                                </div>

                                {step === 2 && (
                                    <button
                                        type="button"
                                        className="add-account-back-button"
                                        onClick={backToProviders}
                                    >
                                        <ArrowRight size={16} />
                                        تغيير المزود
                                    </button>
                                )}

                            </div>


                            {step === 1 && (

                                <section className="add-account-step">

                                    <h3 className="add-account-step-title">
                                        اختر المزود المالي
                                    </h3>


                                    {isLoadingProviders && (
                                        <LoadingState
                                            message="جاري تحميل المزودين الماليين..."
                                            size="sm"
                                        />
                                    )}


                                    {isErrorProviders && (
                                        <ErrorState
                                            title="تعذر تحميل المزودين"
                                            message={
                                                providersError?.message ||
                                                "تعذر تحميل قائمة المزودين الماليين."
                                            }
                                            size="sm"
                                            onRetry={refetchProviders}
                                        />
                                    )}


                                    {!isLoadingProviders &&
                                        !isErrorProviders &&
                                        providers.length === 0 && (
                                            <EmptyState
                                                title="لا توجد جهات مالية"
                                                message="لا توجد جهات مالية متاحة للربط في الوقت الحالي."
                                                size="sm"
                                            />
                                        )}


                                    {!isLoadingProviders &&
                                        !isErrorProviders &&
                                        providers.length > 0 && (
                                            <div className="provider-grid">

                                                {providers.map(provider => (

                                                    <button
                                                        type="button"
                                                        key={provider.id}
                                                        className={`provider-card ${selectedProviderId === provider.id
                                                                ? "selected"
                                                                : ""
                                                            }`}
                                                        onClick={() =>
                                                            setSelectedProviderId(provider.id)
                                                        }
                                                    >

                                                        <span className="provider-card-icon">
                                                            <Icon name={provider.icon} />
                                                        </span>

                                                        <span className="provider-card-body">
                                                            <strong>{provider.name}</strong>
                                                            <span>{provider.description}</span>
                                                        </span>

                                                        {selectedProviderId === provider.id && (
                                                            <span className="provider-card-check">
                                                                <CircleCheck size={20} />
                                                            </span>
                                                        )}

                                                    </button>

                                                ))}

                                            </div>
                                        )}


                                    {formError && (
                                        <div className="add-account-error">
                                            {formError}
                                        </div>
                                    )}


                                    <button
                                        type="button"
                                        className="add-account-primary-button"
                                        onClick={goToDetails}
                                        disabled={
                                            isLoadingProviders ||
                                            providers.length === 0
                                        }
                                    >
                                        متابعة
                                    </button>

                                </section>
                            )}


                            {step === 2 && (

                                <section className="add-account-step">

                                    <div className="add-account-selected-provider">
                                        <span className="provider-card-icon">
                                            <Icon name={selectedProvider?.icon} />
                                        </span>
                                        <strong>{selectedProvider?.name}</strong>
                                    </div>


                                    <h3 className="add-account-step-title">
                                        بيانات الحساب
                                    </h3>


                                    <form
                                        className="add-account-form"
                                        onSubmit={handleSubmit}
                                    >

                                        <LuxField
                                            icon="id"
                                            label="رقم الحساب"
                                            value={form.accountNumber}
                                            onChange={v => setField("accountNumber", v)}
                                            placeholder="أدخل رقم الحساب"
                                            dir="ltr"
                                        />

                                        <LuxField
                                            icon="id"
                                            label="رقم الآيبان (IBAN)"
                                            value={form.iban}
                                            onChange={v => setField("iban", v)}
                                            placeholder="اختياري"
                                            dir="ltr"
                                        />

                                        <FieldWrapper label="عملة الحساب">
                                            <CustomSelect
                                                name="currency"
                                                options={CURRENCY_OPTIONS}
                                                value={form.currency}
                                                onChange={e =>
                                                    setField("currency", e.target.value)
                                                }
                                                placeholder="اختر عملة الحساب"
                                            />
                                        </FieldWrapper>


                                        {(formError || mutation.isError) && (
                                            <div className="add-account-error">
                                                {formError ||
                                                    mutation.error?.message ||
                                                    "تعذر ربط الحساب."}
                                            </div>
                                        )}


                                        <button
                                            type="submit"
                                            className="add-account-primary-button"
                                            disabled={mutation.isPending}
                                        >
                                            {mutation.isPending ? (
                                                <span className="add-account-loading">
                                                    <span className="add-account-spinner" />
                                                    جاري ربط الحساب...
                                                </span>
                                            ) : (
                                                "ربط الحساب"
                                            )}
                                        </button>

                                    </form>

                                </section>
                            )}
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}


function SuccessState({ account, onConnectAnother, onGoToAccounts }) {
    return (
        <section className="add-account-success">

            <span className="add-account-success-icon">
                <CircleCheck size={26} />
            </span>

            <h2>تم ربط الحساب بنجاح</h2>
            <p>تمت إضافة الحساب إلى قائمة حساباتك المرتبطة.</p>

            <div className="add-account-summary">

                <div className="add-account-summary-row">
                    <span>المزود</span>
                    <strong>{account?.provider}</strong>
                </div>

                <div className="add-account-summary-row">
                    <span>رقم الحساب</span>
                    <strong dir="ltr">{account?.accountNumber}</strong>
                </div>

                <div className="add-account-summary-row">
                    <span>العملة</span>
                    <strong>{account?.currency}</strong>
                </div>

            </div>

            <div className="add-account-success-actions">

                <button
                    type="button"
                    className="add-account-ghost-button"
                    onClick={onConnectAnother}
                >
                    ربط حساب آخر
                </button>

                <button
                    type="button"
                    className="add-account-primary-button"
                    onClick={onGoToAccounts}
                >
                    الذهاب إلى الحسابات
                </button>

            </div>

        </section>
    );
}