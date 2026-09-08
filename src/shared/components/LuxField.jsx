import { FieldWrapper } from "./FieldWrapper";
import { InputShell } from "./InputShell";

export function LuxField({
  icon,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  full = false,
  dir,
}) {
  return (
    <FieldWrapper label={label} full={full}>
      <InputShell icon={icon}>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          dir={dir}
        />
      </InputShell>
    </FieldWrapper>
  );
}