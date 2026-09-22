import { useState, useMemo } from "react";
import {
  Search,
  Funnel,
  CirclePlus,
  ArrowRight,
  RefreshCw,
  SquareArrowOutUpRight,
  Copy,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./search.style.css";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../core/auth/AuthContext";
import { Icon } from "@/shared/components/Icon";
import { CustomSelect } from "@/shared/components/customSelect/CustomSelect";
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "@/shared/components/states";
import { fetchPersistedData } from "@/shared/utils/PersistedData.jsx";
import { formatNumber, formatDate } from "@/shared/utils/FormatFunction";

const STATUS_LABELS = {
  active: "نشط",
  inactive: "غير نشط",
  pending: "قيد المراجعة",
  suspended: "موقوف",
};

function getProviderIconName(providerName = "") {
  return /بنك|مصرف/.test(providerName) ? "bank" : "wallet";
}

function parseAmount(value) {
  return parseFloat(String(value).replace(/,/g, "")) || 0;
}

export function AccountsPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("ALL");

  const HandleSelectedAccount = (account) => setSelectedAccount(account);
  const HandleBackToList = () => setSelectedAccount(null);

  const {
    data: accounts = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["accounts", token],
    queryFn: () => fetchPersistedData("accountsList", "accounts.json", token),
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
    queryFn: () =>
      fetchPersistedData("accountsDetailsList", "accountsDetails.json", token),
    enabled: !!token,
  });

  const {
    data: allTransactions = [],
    isLoading: isLoadingTransactions,
    isError: isErrorTransactions,
    error: errorTransactions,
    refetch: refetchTransactions,
  } = useQuery({
    // مفتاح مستقل لتفادي تعارضه مع بيانات "accounts" أو مع dataset المعاملات الأخرى في لوحة التحكم
    queryKey: ["account_transactions", token],
    queryFn: () =>
      fetchPersistedData("transactionTemp", "TransactionTemp.json", token),
    enabled: !!token,
  });

  const detailsById = useMemo(() => {
    const map = {};
    (accountsDetails || []).forEach((d) => {
      map[d.id] = d;
    });
    return map;
  }, [accountsDetails]);

  const transactionsByAccount = useMemo(() => {
    const map = {};
    (allTransactions || []).forEach((t) => {
      if (!map[t.accountId]) map[t.accountId] = [];
      map[t.accountId].push(t);
    });
    return map;
  }, [allTransactions]);

  const overview = useMemo(() => {
    const activeCount = accounts.filter((a) => a.status === "active").length;
    const syncedCount = accounts.filter((a) => a.synchrouns).length;

    const currencyMap = {};
    accounts.forEach((a) => {
      currencyMap[a.currency] =
        (currencyMap[a.currency] || 0) + parseAmount(a.amount);
    });

    return {
      total: accounts.length,
      activeCount,
      syncedCount,
      currencyTotals: Object.entries(currencyMap).map(([currency, balance]) => ({
        currency,
        balance,
      })),
    };
  }, [accounts]);

  const accountDetails = useMemo(() => {
    if (!selectedAccount || !Array.isArray(accountsDetails)) return null;
    return (
      accountsDetails.find((account) => account.id === selectedAccount.id) ??
      null
    );
  }, [accountsDetails, selectedAccount]);

  const accountTransactions = useMemo(() => {
    if (!selectedAccount) return [];
    return transactionsByAccount[selectedAccount.id] || [];
  }, [transactionsByAccount, selectedAccount]);

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

  if (selectedAccount) {
    return (
      <AccountDetailPanel
        accountDetails={accountDetails}
        isLoadingDetails={isLoadingDetails}
        isErrorDetails={isErrorDetails}
        errorDetails={errorDetails}
        refetchDetails={refetchDetails}
        transactions={accountTransactions}
        isLoadingTransactions={isLoadingTransactions}
        isErrorTransactions={isErrorTransactions}
        errorTransactions={errorTransactions}
        refetchTransactions={refetchTransactions}
        onBack={HandleBackToList}
        onTransfer={() => navigate("/single-transfer")}
      />
    );
  }

  return (
    <div className="acc-page" dir="rtl">
      <header className="acc-page-header">
        <div>
          <h1>الحسابات المربوطة</h1>
          <p>إدارة جميع حساباتك البنكية ومحافظك الإلكترونية من مكان واحد</p>
        </div>
      </header>

      {!isLoading && !isError && accounts.length > 0 && (
        <section className="acc-overview">
          <div className="acc-kpi-row">
            <div className="acc-kpi-card">
              <span className="acc-kpi-value">{overview.total}</span>
              <span className="acc-kpi-label">إجمالي الحسابات</span>
            </div>

            <div className="acc-kpi-card">
              <span className="acc-kpi-value">{overview.activeCount}</span>
              <span className="acc-kpi-label">حسابات نشطة</span>
            </div>

            <div className="acc-kpi-card">
              <span className="acc-kpi-value">{overview.syncedCount}</span>
              <span className="acc-kpi-label">مزامنة تلقائية مفعّلة</span>
            </div>
          </div>

          <div className="acc-currency-row">
            {overview.currencyTotals.map((item) => (
              <div key={item.currency} className="acc-currency-card">
                <span className="acc-currency-card-label">
                  إجمالي الرصيد بعملة {item.currency}
                </span>
                <div className="acc-currency-card-value">
                  <span dir="ltr">{formatNumber(item.balance)}</span>
                  <small>{item.currency}</small>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedProvider={selectedProvider}
        setSelectedProvider={setSelectedProvider}
      />

      {isLoading ? (
        <LoadingState message="جاري تحميل الحسابات..." />
      ) : isError ? (
        <ErrorState
          title="تعذر تحميل الحسابات"
          message={error?.message || "حدث خطأ أثناء جلب حساباتك."}
          onRetry={refetch}
        />
      ) : accounts.length === 0 ? (
        <EmptyState
          icon={<Icon name="wallet" />}
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
        <div className="acc-grid">
          {filteredAccounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              detail={detailsById[account.id]}
              transactionsCount={(transactionsByAccount[account.id] || []).length}
              onSelect={HandleSelectedAccount}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CopyButton({ value, label, className = "" }) {
  const [copied, setCopied] = useState(false);

  if (!value) return null;

  function handleCopy(event) {
    event.stopPropagation();
    navigator.clipboard?.writeText(String(value));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      type="button"
      className={`acc-copy-btn ${className}`}
      onClick={handleCopy}
      aria-label={`نسخ ${label}`}
      title={copied ? "تم النسخ" : `نسخ ${label}`}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  );
}

function AccountCard({ account, detail, transactionsCount, onSelect }) {
  const iconName = getProviderIconName(account.provider);
  const statusLabel = STATUS_LABELS[account.status] || account.status;

  const metaParts = [];
  if (detail?.bankBranch) metaParts.push(`الفرع: ${detail.bankBranch}`);
  if (detail?.lastSync)
    metaParts.push(`آخر مزامنة: ${formatDate(detail.lastSync)}`);

  return (
    <button type="button" className="acc-card" onClick={() => onSelect(account)}>
      <div className="acc-card-top">
        <span className="acc-card-icon">
          <Icon name={iconName} />
        </span>

        <span className={`acc-status-pill status-${account.status}`}>
          <span className="acc-status-dot" />
          {statusLabel}
        </span>
      </div>

      <div className="acc-card-body">
        <strong className="acc-card-provider">{account.provider}</strong>

        <div className="acc-card-number-row">
          <span className="acc-card-number" dir="ltr">
            {account.accountNumber}
          </span>
          <CopyButton value={account.accountNumber} label="رقم الحساب" />
        </div>

        {metaParts.length > 0 && (
          <span className="acc-card-meta">{metaParts.join(" • ")}</span>
        )}
      </div>

      <div className="acc-card-balance">
        <span className="acc-card-balance-value" dir="ltr">
          {formatNumber(parseAmount(account.amount))}
        </span>
        <span className="acc-card-balance-currency">{account.currency}</span>
      </div>

      <div className="acc-card-footer">
        <div className="acc-card-footer-left">
          <span
            className={`acc-sync-indicator ${
              account.synchrouns ? "is-on" : "is-off"
            }`}
          >
            <RefreshCw size={13} />
            {account.synchrouns ? "مزامنة تلقائية" : "مزامنة يدوية"}
          </span>

          <span className="acc-txn-count-chip">{transactionsCount} عملية</span>
        </div>

        <span className="acc-card-arrow">
          <SquareArrowOutUpRight size={16} />
        </span>
      </div>
    </button>
  );
}

function AccountDetailPanel({
  accountDetails,
  isLoadingDetails,
  isErrorDetails,
  errorDetails,
  refetchDetails,
  transactions,
  isLoadingTransactions,
  isErrorTransactions,
  errorTransactions,
  refetchTransactions,
  onBack,
  onTransfer,
}) {
  const txnStats = useMemo(() => {
    let inbound = 0;
    let outbound = 0;

    transactions.forEach((t) => {
      const amount = parseAmount(t.amount);
      if (t.type === "deposit") inbound += amount;
      else outbound += amount;
    });

    return { inbound, outbound, count: transactions.length };
  }, [transactions]);

  return (
    <div className="acc-details-page" dir="rtl">
      <button type="button" onClick={onBack} className="acc-back-btn">
        <ArrowRight size={18} />
        <span>رجوع إلى الحسابات</span>
      </button>

      {isLoadingDetails ? (
        <LoadingState message="جاري تحميل تفاصيل الحساب..." size="sm" />
      ) : isErrorDetails ? (
        <ErrorState
          title="تعذر تحميل تفاصيل الحساب"
          message={errorDetails?.message || "حدث خطأ أثناء جلب تفاصيل الحساب."}
          size="sm"
          onRetry={refetchDetails}
        />
      ) : !accountDetails ? (
        <EmptyState
          title="لا توجد تفاصيل لهذا الحساب"
          message="لم يتم العثور على بيانات تفصيلية مرتبطة بهذا الحساب."
          size="sm"
        />
      ) : (
        <>
          <AccountHero account={accountDetails} />

          <section className="acc-detail-grid">
            <DetailCard label="معرف الحساب" value={accountDetails.id} />
            <DetailCard label="العملة" value={accountDetails.currency} />
            <DetailCard label="فرع البنك" value={accountDetails.bankBranch} />
            <DetailCard label="اسم صاحب الحساب" value={accountDetails.ownerName} />
            <DetailCard
              label="المزامنة"
              value={accountDetails.synchrouns ? "مفعلة" : "غير مفعلة"}
            />
            <DetailCard
              label="آخر مزامنة"
              value={formatDate(accountDetails.lastSync)}
            />
            <DetailCard
              label="تاريخ إنشاء الحساب"
              value={accountDetails.createdAt}
            />
            <DetailCard
              full
              label="IBAN"
              value={accountDetails.iban}
              ltr
              copyLabel="رقم الآيبان"
            />
            <DetailCard full label="الوصف" value={accountDetails.description} />
          </section>

          <section className="acc-txn-stats-row">
            <div className="acc-txn-stat">
              <span className="acc-txn-stat-value positive" dir="ltr">
                +{formatNumber(txnStats.inbound)}
              </span>
              <span className="acc-txn-stat-label">
                إجمالي المبالغ الداخلة ({accountDetails.currency})
              </span>
            </div>

            <div className="acc-txn-stat">
              <span className="acc-txn-stat-value negative" dir="ltr">
                -{formatNumber(txnStats.outbound)}
              </span>
              <span className="acc-txn-stat-label">
                إجمالي المبالغ الخارجة ({accountDetails.currency})
              </span>
            </div>

            <div className="acc-txn-stat">
              <span className="acc-txn-stat-value">{txnStats.count}</span>
              <span className="acc-txn-stat-label">عدد العمليات المسجّلة</span>
            </div>
          </section>

          <section className="acc-transactions-section">
            <div className="acc-section-head">
              <h3>سجل العمليات على هذا الحساب</h3>
              <span className="acc-count-badge">{transactions.length}</span>
            </div>

            {isLoadingTransactions ? (
              <LoadingState message="جاري تحميل المعاملات..." size="sm" />
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
            ) : transactions.length === 0 ? (
              <EmptyState
                title="لا توجد معاملات"
                message="لم يتم تسجيل أي معاملة على هذا الحساب."
                size="sm"
              />
            ) : (
              <div className="acc-transactions-list">
                {transactions.map((transaction) => (
                  <div className="acc-transaction-row" key={transaction.id}>
                    <div className="acc-transaction-main">
                      <strong>{transaction.title}</strong>
                      <span className="acc-transaction-parties">
                        {transaction.from} ← {transaction.to}
                      </span>
                    </div>

                    <div className="acc-transaction-meta">
                      <span
                        className={`acc-transaction-status status-${(
                          transaction.status || ""
                        ).toLowerCase()}`}
                      >
                        {transaction.status}
                      </span>

                      <span
                        className={`acc-transaction-amount ${
                          transaction.type === "deposit" ? "positive" : ""
                        }`}
                        dir="ltr"
                      >
                        {transaction.type === "deposit" ? "+" : "-"}
                        {transaction.amount} {transaction.currency}
                      </span>

                      <span className="acc-transaction-date">
                        {formatDate(transaction.date)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="acc-detail-actions">
            <Button onClick={onTransfer}>بدء تحويل من الحساب</Button>
          </div>
        </>
      )}
    </div>
  );
}

function AccountHero({ account }) {
  const iconName = getProviderIconName(account.provider);
  const statusLabel = STATUS_LABELS[account.status] || account.status;

  return (
    <section className="acc-detail-hero">
      <span className="acc-detail-hero-icon">
        <Icon name={iconName} />
      </span>

      <div className="acc-detail-hero-copy">
        <h2>{account.provider}</h2>
        <div className="acc-detail-hero-number">
          <span dir="ltr">{account.accountNumber}</span>
          <CopyButton value={account.accountNumber} label="رقم الحساب" />
        </div>
      </div>

      <span className={`acc-status-pill status-${account.status}`}>
        <span className="acc-status-dot" />
        {statusLabel}
      </span>

      <div className="acc-detail-hero-balance">
        <span dir="ltr">{formatNumber(parseAmount(account.amount))}</span>
        <small>{account.currency}</small>
      </div>
    </section>
  );
}

function DetailCard({ label, value, full, ltr, copyLabel }) {
  return (
    <div className={`acc-detail-card ${full ? "full-width" : ""}`}>
      <span className="acc-detail-card-label">{label}</span>
      <div className="acc-detail-card-value-row">
        <span className={`acc-detail-card-value ${ltr ? "ltr" : ""}`}>
          {value || "—"}
        </span>
        {copyLabel && value && <CopyButton value={value} label={copyLabel} />}
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
    <div className="acc-toolbar">
      <div className="acc-search-wrap">
        <Search className="acc-search-icon" size={18} />
        <input
          type="text"
          className="acc-search-input"
          placeholder="ابحث بالمزود المالي أو رقم الحساب"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="acc-filter-wrap">
        <Funnel size={16} className="acc-filter-icon" />
        <DropDownList
          selectedProvider={selectedProvider}
          setSelectedProvider={setSelectedProvider}
        />
      </div>

      <Button onClick={() => navigate("/add-account")} icon={<CirclePlus size={18} />}>
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
    <CustomSelect
      name="trans-finance"
      id="trans-finance"
      options={providerOptions}
      value={selectedProvider}
      onChange={(e) => setSelectedProvider(e.target.value)}
      placeholder="كافة المزودات المالية"
    />
  );
}

export function Button({ children, icon, onClick }) {
  return (
    <button type="button" className="acc-primary-btn" onClick={onClick}>
      {children}
      {icon}
    </button>
  );
}