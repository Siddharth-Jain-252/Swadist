import React from "react";

export default function NextButton({ onClick, disabled, label = "Next →", loading = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="relative overflow-hidden px-8 py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300"
      style={{
        background: disabled ? "var(--border)" : "var(--dark)",
        color: disabled ? "var(--muted)" : "#fff",
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: disabled ? "none" : "0 4px 20px rgba(26,14,5,0.25)",
        transform: disabled ? "none" : undefined,
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.background = "var(--saffron)";
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.currentTarget.style.background = "var(--dark)";
      }}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          Processing…
        </span>
      ) : (
        label
      )}
    </button>
  );
}
