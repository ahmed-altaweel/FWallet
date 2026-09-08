import { LuxField } from "@/shared/components/LuxField";

export function ContactSection({ form, setField }) {
  return (
    <div className="fw-lux-form-grid">
      <LuxField
        icon="mail"
        label="البريد الإلكتروني"
        type="email"
        value={form.email}
        onChange={(v) => setField("email", v)}
        placeholder="name@example.com"
        dir="ltr"
      />

      <LuxField
        icon="phone"
        label="رقم الهاتف"
        type="tel"
        value={form.phone}
        onChange={(v) => setField("phone", v)}
        placeholder="+967"
        dir="ltr"
      />

      <LuxField
        icon="location"
        label="العنوان"
        value={form.address}
        onChange={(v) => setField("address", v)}
        placeholder="أدخل العنوان"
        full
      />
    </div>
  );
}