import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { AppDataContext } from "./AppDataContext.data.jsx";
import { fetchData } from "@/shared/utils/FetchData.jsx";
import { useQuery } from "@tanstack/react-query";
import { LoadingState, ErrorState, EmptyState } from "@/shared/components/states";

export function AppDataProvider({ children }) {
    const { isLoggedIn, token } = useAuth();

    const {
        data = null,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["appData", token],
        queryFn: () => fetchData("appData.json", token),
        enabled: !!token,
    });

    if (!isLoggedIn) return <Navigate to="/login" replace />;

    if (isLoading) {
        return <LoadingState message="جاري تحميل بيانات حسابك..." />;
    }

    if (isError) {
        return (
            <ErrorState
                title="تعذر تحميل بيانات الحساب"
                message={error?.message || "حدث خطأ أثناء جلب بياناتك."}
                onRetry={refetch}
            />
        );
    }

    if (!data) {
        return (
            <EmptyState
                title="لا توجد بيانات للحساب"
                message="لم يتم العثور على بيانات مرتبطة بهذا الحساب."
                actionLabel="إعادة المحاولة"
                onAction={refetch}
            />
        );
    }

    return (
        <AppDataContext.Provider value={{ data, refetch }}>
            {children}
        </AppDataContext.Provider>
    );
}
