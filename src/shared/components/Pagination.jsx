// src/shared/components/Pagination.jsx
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Pagination.style.css";

export function Pagination({ currentPage, totalPages, onPageChange }) {
  const safeTotalPages = Math.max(1, totalPages || 1);
  const safeCurrent = Math.min(Math.max(1, currentPage || 1), safeTotalPages);

  const pages = getPageNumbers(safeCurrent, safeTotalPages);

  return (
    <nav className="pagination" dir="rtl" aria-label="ترقيم الصفحات">
      <button
        type="button"
        className="pagination-nav"
        onClick={() => onPageChange(safeCurrent - 1)}
        disabled={safeCurrent === 1}
      >
        <ChevronRight size={16} />
        <span>السابق</span>
      </button>

      <ul className="pagination-pages">
        {pages.map((page, idx) =>
          page === "..." ? (
            <li key={`dots-${idx}`} className="pagination-dots">
              …
            </li>
          ) : (
            <li key={`page-${page}`}>
              <button
                type="button"
                className={`pagination-page ${page === safeCurrent ? "active" : ""}`}
                onClick={() => onPageChange(page)}
                aria-current={page === safeCurrent ? "page" : undefined}
              >
                {page}
              </button>
            </li>
          )
        )}
      </ul>

      <button
        type="button"
        className="pagination-nav"
        onClick={() => onPageChange(safeCurrent + 1)}
        disabled={safeCurrent === safeTotalPages}
      >
        <span>التالي</span>
        <ChevronLeft size={16} />
      </button>
    </nav>
  );
}

function getPageNumbers(current, total) {
  const delta = 1;
  const range = [];
  const withDots = [];
  let last;

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i);
    }
  }

  range.forEach((i) => {
    if (last) {
      if (i - last === 2) withDots.push(last + 1);
      else if (i - last > 2) withDots.push("...");
    }
    withDots.push(i);
    last = i;
  });

  return withDots;
}