import { formatNumber } from "@/shared/utils/FormatFunction.jsx";
export function TotalCard({ currency, balance }) {
  return (
    <>
      <p className="text">الرصيد الكلي</p>
      <div className="total-balance">
        <span className="amount">{formatNumber(balance)}</span>
        <span className="currency">{currency}</span>
      </div>
    </>
  );
}