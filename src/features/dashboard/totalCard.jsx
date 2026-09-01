export function TotalBalanceCard({ currency, balance, accounts }) {
  const formattedBalance = new Intl.NumberFormat("en-EG").format(balance);

  return (
    <div className="total-balance-card">
      <p className="text">الرصيد الكلي</p>
      <div className="total-balance">
        <span className="amount">{formattedBalance}</span>
        <span className="currency">{currency}</span>
      </div>
      <div className="total-accounts">
        <span>الحسابات النشطة: </span>
        <span className="accounts-count">{accounts}</span>
      </div>
    </div>
  );
}