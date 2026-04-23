import React from "react";
import { FOOD_ITEMS } from "../data/constants";
import { formatINR } from "../utils/format";
import FoodCard from "./FoodCard";
import NextButton from "./NextButton";

export default function FoodStep({ cart, onSelect, onNext }) {
  const selectedItem = FOOD_ITEMS.find((f) => f.id === cart.id);
  const totalCost = selectedItem ? selectedItem.price * cart.qty : 0;

  return (
    <div className="animate-fade-slide">
      <h2
        className="text-center mb-1 text-4xl font-black tracking-tight"
        style={{ fontFamily: "'Playfair Display', serif", color: "var(--dark)" }}
      >
        Pick your feast
      </h2>
      <p className="text-center text-sm mb-8" style={{ color: "var(--muted)" }}>
        Choose one dish — up to 5 portions
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 stagger">
        {FOOD_ITEMS.map((item) => (
          <FoodCard
            key={item.id}
            item={item}
            selectedId={cart.id}
            quantity={cart.id === item.id ? cart.qty : 0}
            onQtyChange={(qty) => onSelect(item.id, qty)}
          />
        ))}
      </div>

      {/* Floating cart summary */}
      <div
        className="sticky bottom-4 mt-6 rounded-2xl px-5 py-4 flex items-center justify-between transition-all duration-300"
        style={{
          background: "var(--dark)",
          boxShadow: "0 8px 32px rgba(26,14,5,0.35)",
          opacity: cart.id ? 1 : 0.5,
        }}
      >
        <div>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
            {cart.id
              ? `${selectedItem?.label} ×${cart.qty}`
              : "No item selected"}
          </p>
          {cart.id && (
            <p className="text-lg font-bold" style={{ color: "#fff" }}>
              {formatINR(totalCost)}
            </p>
          )}
        </div>
        <NextButton onClick={onNext} disabled={!cart.id || cart.qty === 0} label="Next →" />
      </div>
    </div>
  );
}