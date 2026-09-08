import { Icon } from "./Icon";

export function InputShell({ icon, children }) {
  return (
    <div className="fw-lux-input-shell">
      <span className="fw-lux-field-icon">
        <Icon name={icon} />
      </span>

      {children}

      <span className="fw-lux-input-glow" />
    </div>
  );
}