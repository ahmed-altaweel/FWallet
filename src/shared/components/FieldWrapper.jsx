export function FieldWrapper({ label, full = false, children }) {
  return (
    <div className={`fw-lux-field ${full ? "fw-lux-span-2" : ""}`}>
      <label>{label}</label>
      {children}
    </div>
  );
}