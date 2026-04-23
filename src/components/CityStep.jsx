import React from "react";
import { CITIES } from "../data/constants";
import NextButton from "./NextButton";

export default function CityStep({ selected, onSelect, onNext }) {
  return (
    <div className="animate-fade-slide">
      <h2
        className="text-center mb-1 text-4xl font-black tracking-tight"
        style={{ fontFamily: "'Playfair Display', serif", color: "var(--dark)" }}
      >
        Where are you?
      </h2>
      <p className="text-center text-sm mb-8" style={{ color: "var(--muted)" }}>
        Choose your city to see nearby restaurants
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 stagger">
        {CITIES.map((city) => {
          const isSelected = selected === city.id;
          return (
            <button
              key={city.id}
              onClick={() => onSelect(city.id)}
              className="group relative flex flex-col items-center gap-2 rounded-2xl p-5 transition-all duration-300"
              style={{
                background: isSelected ? "var(--dark)" : "var(--card-bg)",
                border: `2px solid ${isSelected ? "var(--dark)" : "var(--border)"}`,
                boxShadow: isSelected
                  ? "0 8px 30px rgba(26,14,5,0.25)"
                  : "0 2px 8px rgba(0,0,0,0.04)",
                transform: isSelected ? "translateY(-3px)" : "translateY(0)",
              }}
            >
              <span className="text-3xl">{city.emoji}</span>
              <span
                className="text-sm font-semibold tracking-wide"
                style={{ color: isSelected ? "#fff" : "var(--dark)" }}
              >
                {city.label}
              </span>

              {/* Selected indicator dot */}
              {isSelected && (
                <span
                  className="absolute top-2 right-2 w-2 h-2 rounded-full animate-bounce-in"
                  style={{ background: "var(--saffron)" }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex justify-center mt-8">
        <NextButton onClick={onNext} disabled={!selected} />
      </div>
    </div>
  );
}
