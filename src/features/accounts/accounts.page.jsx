import { useState, useMemo } from "react";
import {
  Funnel,
  CirclePlus,
  Search,
  SquareArrowOutUpRight,
  ArrowRight,
  Wallet,
} from "lucide-react";
import { ContainerBox } from "../../shared/utils/ContainerBox";
import { useNavigate } from "react-router-dom";
import "./search.style.css";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../core/auth/AuthContext";
import { fetchData } from "../../shared/utils/FetchData";
import { CustomSelect } from "@/shared/components/customSelect/CustomSelect";
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "@/shared/components/states";

export function AccountsPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("ALL");

  const HandleSelectedAccount = (account) => {
    setSelectedAccount(account);
  };

  const HandleBackToList = () => {
    setSelectedAccount(null);
  };

  const {
    data: accounts = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["accounts", token],
    queryFn: () => fetchData("accounts.json", token),
    enabled: !!token,
  });

  const {
    data: accountsDetails = [],
    isLoading: isLoadingDetails,
    isError: isErrorDetails,
    error: errorDetails,
    refetch: refetchDetails,
  } = useQuery({
    queryKey: ["accounts_details", token],
    queryFn: () => fetchData("accountsDetails.json", token),
    enabled: !!token,
  });

  const {
    data: transactions = [],
    isLoading: isLoadingTransactions,
    isError: isErrorTransactions,
    error: errorTransactions,
    refetch: refetchTransactions,
  } = useQuery({
    queryKey: ["accounts", token],
    queryFn: () => fetchData("TransactionTemp.json", token),
    enabled: !!token,
  });

  const accountDetails = useMemo(() => {
    if (!selectedAccount || !Array.isArray(accountsDetails)) {
      return null;
    }

    return (
      accountsDetails.find((account) => account.id === selectedAccount.id) ??
      null
    );
  }, [accountsDetails, selectedAccount]);

  const accountTransactions = useMemo(() => {
    if (!selectedAccount || !Array.isArray(transactions)) {
      return [];
    }

    return transactions.filter(
      (transaction) => transaction.accountId === selectedAccount.id,
    );
  }, [transactions, selectedAccount]);

  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      const matchesProvider =
        selectedProvider === "ALL" || account.provider === selectedProvider;

      const query = searchQuery.trim().toLowerCase();

      const matchesProviderName = account.provider
        ? String(account.provider).toLowerCase().includes(query)
        : false;

      const matchesAccountNumber = account.accountNumber
        ? String(account.accountNumber).toLowerCase().includes(query)
        : false;

      return matchesProvider && (matchesProviderName || matchesAccountNumber);
    });
  }, [accounts, searchQuery, selectedProvider]);

  return (
    <div>
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedProvider={selectedProvider}
        setSelectedProvider={setSelectedProvider}
      />

      <div>
        {selectedAccount ? (
          <div className="account-details-page" dir="rtl">
            <ContainerBox>
              <button onClick={HandleBackToList} className="back-btn">
                <ArrowRight size={20} />
                <span>رجوع</span>
              </button>

              <div className="details-container">
                {isLoadingDetails ? (
                  <LoadingState
                    message="جاري تحميل تفاصيل الحساب..."
                    size="sm"
                  />
                ) : isErrorDetails ? (
                  <ErrorState
                    title="تعذر تحميل تفاصيل الحساب"
                    message={
                      errorDetails?.message ||
                      "حدث خطأ أثناء جلب تفاصيل الحساب."
                    }
                    size="sm"
                    onRetry={refetchDetails}
                  />
                ) : accountDetails ? (
                  <>
                    <h2>{accountDetails.provider}</h2>

                    <div className="details-grid">
                      <div className="detail-card">
                        <span className="label">معرف الحساب</span>
                        <span className="value">{accountDetails.id}</span>
                      </div>

                      <div className="detail-card">
                        <span className="label">رقم الحساب</span>
                        <span className="value">
                          {accountDetails.accountNumber}
                        </span>
                      </div>

                      <div className="detail-card">
                        <span className="label">العملة</span>
                        <span className="value">{accountDetails.currency}</span>
                      </div>

                      <div className="detail-card">
                        <span className="label">الرصيد</span>
                        <span className="value amount">
                          {accountDetails.amount}
                        </span>
                      </div>

                      <div className="detail-card">
                        <span className="label">الحالة</span>
                        <span className="value status-badge">
                          {accountDetails.status}
                        </span>
                      </div>

                      <div className="detail-card">
                        <span className="label">المزامنة</span>
                        <span className="value">
                          {accountDetails.synchrouns ? "مفعلة" : "غير مفعلة"}
                        </span>
                      </div>

                      <div className="detail-card">
                        <span className="label">آخر مزامنة</span>
                        <span className="value">{accountDetails.lastSync}</span>
                      </div>

                      <div className="detail-card">
                        <span className="label">اسم صاحب الحساب</span>
                        <span className="value">
                          {accountDetails.ownerName}
                        </span>
                      </div>

                      <div className="detail-card">
                        <span className="label">فرع البنك</span>
                        <span className="value">
                          {accountDetails.bankBranch}
                        </span>
                      </div>

                      <div className="detail-card full-width">
                        <span className="label">IBAN</span>
                        <span className="value ltr">{accountDetails.iban}</span>
                      </div>

                      <div className="detail-card">
                        <span className="label">تاريخ إنشاء الحساب</span>
                        <span className="value">
                          {accountDetails.createdAt}
                        </span>
                      </div>

                      <div className="detail-card full-width">
                        <span className="label">الوصف</span>
                        <span className="value">
                          {accountDetails.description}
                        </span>
                      </div>
                    </div>

                    <div className="transactions-section">
                      <h2>المعاملات</h2>

                      {isLoadingTransactions ? (
                        <LoadingState
                          message="جاري تحميل المعاملات..."
                          size="sm"
                        />
                      ) : isErrorTransactions ? (
                        <ErrorState
                          title="تعذر تحميل المعاملات"
                          message={
                            errorTransactions?.message ||
                            "حدث خطأ أثناء جلب معاملات الحساب."
                          }
                          size="sm"
                          onRetry={refetchTransactions}
                        />
                      ) : accountTransactions.length === 0 ? (
                        <EmptyState
                          title="لا توجد معاملات"
                          message="لم يتم تسجيل أي معاملة على هذا الحساب."
                          size="sm"
                        />
                      ) : (
                        <div className="transactions-list">
                          {accountTransactions.map((transaction) => (
                            <ContainerBox
                              key={transaction.id}
                              className="transaction-card"
                            >
                              <div className="transaction-header">
                                <h4>{transaction.title}</h4>

                                <span>{transaction.status}</span>
                              </div>

                              <div className="transaction-info">
                                <p>
                                  <strong>المبلغ: </strong>
                                  {transaction.amount} {transaction.currency}
                                </p>

                                <p>
                                  <strong>من: </strong>
                                  {transaction.from}
                                </p>

                                <p>
                                  <strong>إلى: </strong>
                                  {transaction.to}
                                </p>

                                <p>
                                  <strong>التاريخ: </strong>
                                  {transaction.date}
                                </p>
                              </div>
                            </ContainerBox>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="account-actions">
                      <Button onClick={() => navigate("/single-transfer")}>
                        بدء تحويل من الحساب
                      </Button>
                    </div>
                  </>
                ) : (
                  <EmptyState
                    title="لا توجد تفاصيل لهذا الحساب"
                    message="لم يتم العثور على بيانات تفصيلية مرتبطة بهذا الحساب."
                    size="sm"
                  />
                )}
              </div>
            </ContainerBox>
          </div>
        ) : isLoading ? (
          <LoadingState message="جاري تحميل الحسابات..." />
        ) : isError ? (
          <ErrorState
            title="تعذر تحميل الحسابات"
            message={error?.message || "حدث خطأ أثناء جلب حساباتك."}
            onRetry={refetch}
          />
        ) : accounts.length === 0 ? (
          <EmptyState
            icon={<Wallet size={24} />}
            title="لا توجد حسابات مرتبطة"
            message="ابدأ بربط حسابك المالي الأول لعرضه هنا."
            actionLabel="ربط حساب مالي"
            onAction={() => navigate("/add-account")}
          />
        ) : filteredAccounts.length === 0 ? (
          <EmptyState
            icon={<Search size={24} />}
            title="لا توجد نتائج مطابقة"
            message="جرّب تعديل كلمة البحث أو اختيار مزود مالي آخر."
          />
        ) : (
          <div className="accounts">
            {filteredAccounts.map((account) => (
              <ContainerBox key={account.id} className="card">
                <div
                  className="account-card"
                  onClick={() => HandleSelectedAccount(account)}
                >
                  <div className="card-header">
                    <h3>{account.provider}</h3>

                    <div className="status">
                      <span>{account.status}</span>
                    </div>
                  </div>

                  <div className="account-info">
                    <div>
                      <span>المبلغ | </span>
                      <span>{account.amount}</span>
                    </div>

                    <div>
                      <span>رقم </span>
                      <span>{account.accountNumber}</span>
                    </div>

                    <div>
                      <span>العملة:</span>
                      <strong>{account.currency}</strong>
                    </div>

                    <div>
                      <span>المزامنة</span>
                      <span>{account.synchrouns ? "مفعلة" : "غير مفعلة"}</span>
                    </div>

                    <div className="line">
                      <br />
                    </div>

                    <div className="footer">
                      <div className="btn2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            HandleSelectedAccount(account);
                          }}
                        >
                          <SquareArrowOutUpRight size={20} color="white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </ContainerBox>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function SearchBar({
  searchQuery,
  setSearchQuery,
  selectedProvider,
  setSelectedProvider,
}) {
  const navigate = useNavigate();
  return (
    <div className="container-search">
      <div className="input-wrapper">
        <Search className="search-placeholder-icon" size={18} />

        <input
          type="text"
          className="search-input"
          placeholder="بحث .."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <span className="filter-icon">
        <Funnel />
      </span>

      <DropDownList
        selectedProvider={selectedProvider}
        setSelectedProvider={setSelectedProvider}
      />

      <Button onClick={() => navigate("/add-account")} icon={<CirclePlus />}>
        ربط حساب مالي
      </Button>
    </div>
  );
}

export function DropDownList({ selectedProvider, setSelectedProvider }) {
  const providerOptions = [
    { value: "ALL", label: "كافة المزودات المالية" },
    { value: "بنك الكريمي", label: "بنك الكريمي" },
    { value: "جيب", label: "جيب" },
    { value: "مصرف الراجحي", label: "مصرف الراجحي" },
  ];
  return (
    <div className="drop-down">
      {" "}
      <CustomSelect
        name="trans-finance"
        id="trans-finance"
        options={providerOptions}
        value={selectedProvider}
        onChange={(e) => setSelectedProvider(e.target.value)}
        placeholder="كافة المزودات المالية"
      />{" "}
    </div>
  );
}

export function Button({ children, icon, onClick }) {
  return (
    <button type="button" className="btn" onClick={onClick}>
      {children}
      {icon}
    </button>
  );
}
