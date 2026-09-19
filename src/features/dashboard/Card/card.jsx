import { useMemo } from "react";
import { Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Calculate } from "./Calculate";
import { fetchData } from "@/shared/utils/FetchData";
import { TotalCard } from "./totalCard.jsx";
import { ProviderChart } from "../ProvidersChart/ProvideCharts.jsx";
import { LoadingState, ErrorState, EmptyState } from "@/shared/components/states";

export function TotalBalanceCard({ token }) {
  const navigate = useNavigate();

  const {
    data = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["providers", token],
    queryFn: () => fetchData("providersData.json", token),
    enabled: !!token,
  });

  const Data = useMemo(() => {
    return Calculate(data);
  }, [data]);

  const balance = useMemo(() => {
    let d = [];
    Object.entries(Data).forEach(([currencyName, accounts]) => {
      let dict = { accountsCount: accounts.length, providers: {} };
      accounts.forEach((element) => {
        dict.providers[element.providerName] =
          (dict.providers[element.providerName] || 0) + element.balance;
      });
      dict["currency"] = currencyName;
      dict["balance"] = Object.values(dict["providers"]).reduce(
        (sum, item) => sum + item,
        0,
      );
      d.push(dict);
    });
    return d;
  }, [Data]);

  if (isLoading) {
    return <LoadingState message="جاري تحميل الأرصدة..." size="sm" />;
  }

  if (isError) {
    return (
      <ErrorState
        title="تعذر تحميل الأرصدة"
        message={error?.message || "حدث خطأ أثناء جلب بيانات المزودين."}
        size="sm"
        onRetry={refetch}
      />
    );
  }

  if (balance.length === 0) {
    return (
      <EmptyState
        icon={<Wallet size={24} />}
        title="لا توجد حسابات مرتبطة"
        message="اربط حسابك المالي الأول لعرض إجمالي الرصيد."
        actionLabel="ربط حساب مالي"
        onAction={() => navigate("/add-account")}
      />
    );
  }

  return (
    <>
      {balance.map((x, i) => {
        return (
          <div key={i} className="total-balance-card">
            <TotalCard
              currency={x.currency}
              balance={x.balance}
              accounts={x.accountsCount}
            />

            <ProviderChart data={x.providers} title={"حصة كل محفظة"} />
          </div>
        );
      })}
    </>
  );
}
