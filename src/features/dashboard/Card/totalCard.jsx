import { formatNumber } from "@/shared/utils/FormatFunction.jsx";
export function TotalCard({ currency, balance, accounts }) {

  return (
   <>
      <p className="text">الرصيد الكلي</p>
      <div className="total-balance">
        <span className="amount">{formatNumber(balance)}</span>
        <span className="currency">{currency}</span>
      </div>
      {/* <div className="total-accounts">
        <span>الحسابات النشطة: </span>
        <span className="accounts-count">{accounts}</span>
      </div> */}
    

  </>);
  
}