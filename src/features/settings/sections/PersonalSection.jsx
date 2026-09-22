
import { FieldWrapper } from "@/shared/components/FieldWrapper";
import { CustomSelect } from "@/shared/components/customSelect/CustomSelect";
import { LuxField } from "@/shared/components/LuxField";

export function PersonalSection({ form, setField }) {
  const genderOptions = [
    {
      value: "male",
      label: "ذكر"
    },
    {
      value: "female",
      label: "أنثى"
    }
  ];

  return (
    <div className="fw-lux-form-grid">

      <FieldWrapper label="الجنس">
        <CustomSelect
          name="gender"
          options={genderOptions}
          value={form.gender}
          onChange={(e) =>
            setField("gender", e.target.value)
          }
          placeholder="اختر الجنس"
        />
      </FieldWrapper>

      <LuxField
        icon="calendar"
        label="تاريخ الميلاد"
        type="date"
        value={form.birthDate}
        onChange={(v) =>
          setField("birthDate", v)
        }
      />

      <LuxField
        icon="id"
        label="الرقم الوطني"
        value={form.nationalId}
        onChange={(v) =>
          setField("nationalId", v)
        }
        placeholder="أدخل الرقم الوطني"
        full
        dir="ltr"
      />

    </div>
  );
}

