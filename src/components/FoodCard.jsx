import React, { useState } from "react";
import { formatINR } from "../utils/format";

export default function FoodCard({ item, selectedId, quantity, onQtyChange }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const isSelected = item.id === selectedId;
  const isDimmed   = selectedId !== null && !isSelected;

  return (
    <div
      className="relative rounded-2xl overflow-hidden transition-all duration-300 flex flex-col"
      style={{
        background: "var(--card-bg)",
        border: `2px solid ${isSelected ? "var(--saffron)" : "var(--border)"}`,
        boxShadow: isSelected
          ? "0 8px 30px rgba(244,131,31,0.2)"
          : "0 2px 8px rgba(0,0,0,0.04)",
        transform: isSelected ? "translateY(-4px)" : "translateY(0)",
        opacity: isDimmed ? 0.45 : 1,
        cursor: isDimmed ? "pointer" : "default",
      }}
    >
      {/* Image */}
      <div className="relative h-36 overflow-hidden bg-gray-100">
        {!imgLoaded && (
          <div className="absolute inset-0 shimmer" />
        )}
        <img
          src={item.image}
          alt={item.label}
          onLoad={() => setImgLoaded(true)}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          style={{ opacity: imgLoaded ? 1 : 0 }}
        />

        {/* Tag badge */}
        <span
          className="absolute top-2 left-2 px-2 py-0.5 text-xs font-semibold rounded-full"
          style={{ background: "var(--dark)", color: "#fff", letterSpacing: "0.04em" }}
        >
          {item.tag}
        </span>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <div className="flex justify-between items-start">
          <span className="font-semibold text-sm leading-tight" style={{ color: "var(--dark)" }}>
            {item.label}
          </span>
          <span className="text-sm font-bold" style={{ color: "var(--saffron)" }}>
            {formatINR(item.price)}
          </span>
        </div>

        {/* Quantity selector */}
        <div className="flex items-center gap-2 mt-auto">
          <span className="text-xs" style={{ color: "var(--muted)" }}>Qty:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onQtyChange(Math.max(0, quantity - 1))}
              disabled={quantity === 0}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-150"
              style={{
                background: quantity === 0 ? "var(--border)" : "var(--dark)",
                color: quantity === 0 ? "var(--muted)" : "#fff",
                cursor: quantity === 0 ? "not-allowed" : "pointer",
              }}
            >
              −
            </button>

            <span
              className="w-6 text-center text-sm font-bold transition-all duration-200"
              style={{ color: "var(--dark)" }}
            >
              {quantity}
            </span>

            <button
              onClick={() => onQtyChange(isDimmed ? 1 : Math.min(5, quantity + 1))}
              disabled={quantity === 5 && isSelected}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-150"
              style={{
                background: quantity === 5 && isSelected ? "var(--border)" : "var(--saffron)",
                color: quantity === 5 && isSelected ? "var(--muted)" : "#fff",
                cursor: quantity === 5 && isSelected ? "not-allowed" : "pointer",
              }}
            >
              +
            </button>
          </div>

          {/* Or use select dropdown for accessibility */}
          <select
            value={quantity}
            onChange={(e) => onQtyChange(Number(e.target.value))}
            className="ml-auto text-xs rounded-lg px-2 py-1 border outline-none"
            style={{
              borderColor: "var(--border)",
              background: "var(--cream)",
              color: "var(--dark)",
            }}
          >
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n === 0 ? "None" : `×${n}`}
              </option>
            ))}
          </select>
        </div>

        {/* Subtotal */}
        {isSelected && quantity > 0 && (
          <p className="text-xs animate-fade-in" style={{ color: "var(--muted)" }}>
            Subtotal: <strong style={{ color: "var(--dark)" }}>{formatINR(item.price * quantity)}</strong>
          </p>
        )}
      </div>
    </div>
  );
}