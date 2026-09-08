import { FieldWrapper } from "./FieldWrapper";
import { InputShell } from "./InputShell";
import { Icon } from "./Icon";

export function PasswordField({
  label,
  value,
  onChange,
  show,
  toggle,
  full = false,
}) {
  return (
    <FieldWrapper label={label} full={full}>
      <InputShell icon="lock">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
        />

        <button
          type="button"
          className="fw-lux-eye"
          onClick={toggle}
          aria-label={show ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
        >
          <Icon name={show ? "eye-off" : "eye"} />
        </button>
      </InputShell>
    </FieldWrapper>
  );
}