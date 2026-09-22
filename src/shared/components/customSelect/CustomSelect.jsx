import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import "./CustomSelect.style.css";

export function CustomSelect({
  options = [],
  value,
  defaultValue,
  onChange,
  placeholder = "اختر",
  name,
  id,
  required = false,
  disabled = false,
  className = "",
}) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const rootRef = useRef(null);
  const listRef = useRef(null);

  const currentValue = isControlled ? value : internalValue;

  const selectedOption = useMemo(
    () => options.find((opt) => String(opt.value) === String(currentValue)),
    [options, currentValue]
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) {
      const idx = options.findIndex(
        (opt) => String(opt.value) === String(currentValue)
      );
      setHighlightIndex(idx >= 0 ? idx : 0);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (open && listRef.current) {
      const el = listRef.current.querySelector(
        `[data-index="${highlightIndex}"]`
      );
      if (el) el.scrollIntoView({ block: "nearest" });
    }
  }, [highlightIndex, open]);

  function commitChange(newValue) {
    if (!isControlled) setInternalValue(newValue);
    setOpen(false);
    onChange?.({ target: { value: newValue, name } });
  }

  function handleTriggerKeyDown(event) {
    if (disabled) return;

    if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(event.key)) {
      event.preventDefault();
      setOpen(true);
    }
  }

  function handleListKeyDown(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, options.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const opt = options[highlightIndex];
      if (opt) commitChange(opt.value);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  }

  return (
    <div
      ref={rootRef}
      className={`custom-select ${open ? "is-open" : ""} ${
        disabled ? "is-disabled" : ""
      } ${className}`}
    >
      <button
        type="button"
        id={id}
        className="custom-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleTriggerKeyDown}
      >
        <span
          className={`custom-select-value ${
            !selectedOption ? "is-placeholder" : ""
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <span className="custom-select-arrow" aria-hidden="true">
          <ChevronDown size={18} strokeWidth={2} />
        </span>
      </button>

      {open && (
        <ul
          ref={listRef}
          className="custom-select-menu"
          role="listbox"
          tabIndex={-1}
          onKeyDown={handleListKeyDown}
        >
          {placeholder && (
            <li
              className={`custom-select-option custom-select-placeholder ${
                !currentValue ? "is-selected" : ""
              }`}
              role="option"
              aria-selected={!currentValue}
              data-index={-1}
              onClick={() => commitChange("")}
            >
              {placeholder}
            </li>
          )}

          {options.map((opt, index) => {
            const isSelected = String(opt.value) === String(currentValue);
            return (
              <li
                key={opt.value}
                className={`custom-select-option ${
                  isSelected ? "is-selected" : ""
                } ${index === highlightIndex ? "is-highlighted" : ""}`}
                role="option"
                aria-selected={isSelected}
                data-index={index}
                onMouseEnter={() => setHighlightIndex(index)}
                onClick={() => commitChange(opt.value)}
              >
                <span className="custom-select-option-label">
                  {opt.label}
                </span>
                {isSelected && (
                  <span className="custom-select-option-check">
                    <Check size={16} strokeWidth={2.2} />
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {name && (
        <input
          type="hidden"
          name={name}
          value={currentValue ?? ""}
          required={required}
        />
      )}
    </div>
  );
}