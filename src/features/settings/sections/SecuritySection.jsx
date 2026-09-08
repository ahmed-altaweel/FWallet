import { Icon } from "@/shared/components/Icon";
import { PasswordField } from "@/shared/components/PasswordField";

export function SecuritySection({ form, setField, show, setShow }) {
  return (
    <div className="fw-lux-form-grid">
      <div className="fw-lux-security-banner fw-lux-span-2">
        <span className="fw-lux-security-icon">
          <Icon name="shield" />
        </span>

        <div>
          <span>SECURITY CENTER</span>
          <strong>حماية حسابك تبدأ من كلمة مرور قوية.</strong>
          <p>
            استخدم مزيجًا من الأحرف والأرقام والرموز، ولا تشارك كلمة المرور.
          </p>
        </div>
      </div>

      <PasswordField
        label="كلمة المرور الحالية"
        value={form.currentPassword}
        onChange={(v) => setField("currentPassword", v)}
        show={show.current}
        toggle={() => setShow((p) => ({ ...p, current: !p.current }))}
        full
      />

      <PasswordField
        label="كلمة المرور الجديدة"
        value={form.newPassword}
        onChange={(v) => setField("newPassword", v)}
        show={show.next}
        toggle={() => setShow((p) => ({ ...p, next: !p.next }))}
      />

      <PasswordField
        label="تأكيد كلمة المرور"
        value={form.confirmPassword}
        onChange={(v) => setField("confirmPassword", v)}
        show={show.confirm}
        toggle={() => setShow((p) => ({ ...p, confirm: !p.confirm }))}
      />
    </div>
  );
}