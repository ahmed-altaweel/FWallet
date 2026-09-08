import { FieldWrapper } from "@/shared/components/FieldWrapper";
import { InputShell } from "@/shared/components/InputShell";
import { LuxField } from "@/shared/components/LuxField";

export function PersonalSection({ form, setField }) {
  return (
    <div className="fw-lux-form-grid">
      <FieldWrapper label="الجنس">
        <InputShell icon="id">
          <select
            value={form.gender}
            onChange={(e) => setField("gender", e.target.value)}
          >
            <option value="">اختر الجنس</option>
            <option value="male">ذكر</option>
            <option value="female">أنثى</option>
          </select>
        </InputShell>
      </FieldWrapper>

      <LuxField
        icon="calendar"
        label="تاريخ الميلاد"
        type="date"
        value={form.birthDate}
        onChange={(v) => setField("birthDate", v)}
      />

      <LuxField
        icon="id"
        label="الرقم الوطني"
        value={form.nationalId}
        onChange={(v) => setField("nationalId", v)}
        placeholder="أدخل الرقم الوطني"
        full
        dir="ltr"
      />
    </div>
  );
}