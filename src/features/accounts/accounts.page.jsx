
import React, { useState, useMemo } from 'react';
import { Funnel, CirclePlus, Search, SquareArrowOutUpRight, ArrowRight } from 'lucide-react';
import { ContainerBox } from "../../shared/utils/ContainerBox";
import { useNavigate } from "react-router-dom";
import "./search.style.css";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../core/auth/AuthContext";
import { fetchData } from "../../shared/utils/FetchData";

export function AccountsPage() {
  const { token } = useAuth();
   const navigate=useNavigate();
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
    error
  } = useQuery({
    queryKey: ["accounts", token],
    queryFn: () => fetchData("accounts.json", token),
    enabled: !!token,
  });

  const {
    data: accountsDetails = [],
    isLoading: isLoadingDetails,
    isError: isErrorDetails,
    error: errorDetails
  } = useQuery({
    queryKey: ["accounts_details", token],
    queryFn: () => fetchData("accountsDetails.json", token),
    enabled: !!token,
  });

  const {
    data: transactions = [],
    isLoading: isLoadingTransactions,
    isError: isErrorTransactions,
    error: errorTransactions
  } = useQuery({
    queryKey: ["transactions", token],
    queryFn: () => fetchData("TransactionTemp.json", token),
    enabled: !!token,
  });

  const accountDetails = useMemo(() => {
    if (!selectedAccount || !Array.isArray(accountsDetails)) {
      return null;
    }

    return accountsDetails.find(
      (account) => account.id === selectedAccount.id
    ) ?? null;
  }, [accountsDetails, selectedAccount]);

  const accountTransactions = useMemo(() => {
    if (!selectedAccount || !Array.isArray(transactions)) {
      return [];
    }

    return transactions.filter(
      (transaction) =>
        transaction.accountId === selectedAccount.id
    );
  }, [transactions, selectedAccount]);

  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      const matchesProvider =
        selectedProvider === "ALL" ||
        account.provider === selectedProvider;

      
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

              <button
                onClick={HandleBackToList}
                className="back-btn"
              >
                <ArrowRight size={20} />
                <span>رجوع</span>
              </button>

              <div className="details-container">

                {isLoadingDetails ? (
                  <p>جاري تحميل التفاصيل...</p>
                ) : isErrorDetails ? (
                  <p>تعذر تحميل تفاصيل الحساب</p>
                ) : accountDetails ? (
                  <>
                    <h2>
                      {accountDetails.provider}
                    </h2>

                    <div className="details-grid">
                      <div className="detail-card">
                        <span className="label">معرف الحساب</span>
                        <span className="value">{accountDetails.id}</span>
                      </div>

                      <div className="detail-card">
                        <span className="label">رقم الحساب</span>
                        <span className="value">{accountDetails.accountNumber}</span>
                      </div>

                      <div className="detail-card">
                        <span className="label">العملة</span>
                        <span className="value">{accountDetails.currency}</span>
                      </div>

                      <div className="detail-card">
                        <span className="label">الرصيد</span>
                        <span className="value amount">{accountDetails.amount}</span>
                      </div>

                      <div className="detail-card">
                        <span className="label">الحالة</span>
                        <span className="value status-badge">{accountDetails.status}</span>
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
                        <span className="value">{accountDetails.ownerName}</span>
                      </div>

                      <div className="detail-card">
                        <span className="label">فرع البنك</span>
                        <span className="value">{accountDetails.bankBranch}</span>
                      </div>

                      <div className="detail-card full-width">
                        <span className="label">IBAN</span>
                        <span className="value ltr">{accountDetails.iban}</span>
                      </div>

                      <div className="detail-card">
                        <span className="label">تاريخ إنشاء الحساب</span>
                        <span className="value">{accountDetails.createdAt}</span>
                      </div>

                      <div className="detail-card full-width">
                        <span className="label">الوصف</span>
                        <span className="value">{accountDetails.description}</span>
                      </div>
                    </div>

                    <div className="transactions-section">

                      <h2>المعاملات</h2>

                      {isLoadingTransactions ? (
                        <p>جاري تحميل المعاملات...</p>
                      ) : isErrorTransactions ? (
                        <p>تعذر تحميل معاملات الحساب</p>
                      ) : accountTransactions.length > 0 ? (

                        <div className="transactions-list">

                          {accountTransactions.map((transaction) => (

                            <ContainerBox
                              key={transaction.id}
                              className="transaction-card"
                            >

                              <div className="transaction-header">

                                <h4>
                                  {transaction.title}
                                </h4>

                                <span>
                                  {transaction.status}
                                </span>

                              </div>

                              <div className="transaction-info">

                                <p>
                                  <strong>المبلغ: </strong>
                                  {transaction.amount}{" "}
                                  {transaction.currency}
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

                      ) : (

                        <p>
                          لا توجد معاملات لهذا الحساب
                        </p>

                      )}

                    </div>

                    <div className="account-actions">

                     
                        <Button Onclick={() => navigate("/single-transfer")} className="btn"   >
                                                  بدء تحويل من الحساب
   
                        </Button>

                    </div>

                  </>
                ) : (
                  <p>لا توجد تفاصيل لهذا الحساب</p>
                )}

              </div>

            </ContainerBox>
          </div>

        ) : (

          <div className="accounts">

            {filteredAccounts.length > 0 ? (

              filteredAccounts.map((account) => (

                <ContainerBox
                  key={account.id}
                  className="card"
                >

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
                        <span>
                          {account.synchrouns
                            ? "مفعلة"
                            : "غير مفعلة"}
                        </span>
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
                            <SquareArrowOutUpRight
                              size={20}
                              color="white"
                            />
                          </button>

                        </div>

                      </div>

                    </div>

                  </div>

                </ContainerBox>

              ))

            ) : (

              <div
                style={{
                  textAlign: 'center',
                  width: '100%',
                  padding: '20px'
                }}
              >
                لا يوجد
              </div>

            )}

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
  setSelectedProvider
}) {

  return (
    <div className="container-search">

      <div className="input-wrapper">

        <Search
          className="search-placeholder-icon"
          size={18}
        />

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

    
<Button Onclick={() => navigate("/add-account")}  icon={<CirclePlus />} >
ربط حساب مالي 
</Button>
    </div>
  );
}

export function DropDownList({
  selectedProvider,
  setSelectedProvider
}) {

  return (
    <div className="drop-down">

      <select
        name="trans-finance"
        id="trans-finance"
        value={selectedProvider}
        onChange={(e) => setSelectedProvider(e.target.value)}
      >

        <option value="ALL">
          كافة المزودات المالية
        </option>

        <option value="بنك الكريمي">
          بنك الكريمي
        </option>

        <option value="جيب">
          جيب
        </option>

        <option value="مصرف الراجحي">
          مصرف الراجحي
        </option>

      </select>

    </div>
  );
}

export function Button({children,icon,onClick}) {

  return (
    <button type="button" className="btn" onClick={onClick}>
      {children}
    {icon}      
    </button>
  );
}