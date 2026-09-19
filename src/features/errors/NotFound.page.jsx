import { FileQuestion } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { StateView } from "@/shared/components/states";

export function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="not-found-page">
            <StateView
                icon={<FileQuestion size={24} />}
                title="الصفحة غير موجودة"
                message="الرابط الذي فتحته غير صحيح أو تمت إزالته."
                actionLabel="العودة إلى الرئيسية"
                onAction={() => navigate("/dashboard")}
            />
        </div>
    );
}
