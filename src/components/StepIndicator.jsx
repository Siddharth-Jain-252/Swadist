import React from "react";
import { STEPS } from "../data/constants";

export default function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((label, idx) => {
        const isCompleted = idx < currentStep;
        const isActive    = idx === currentStep;

        return (
          <React.Fragment key={label}>
            {/* Step node */}
            <div className="flex flex-col items-center">
              <div
                className="relative flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold transition-all duration-500"
                style={{
                  background: isCompleted
                    ? "var(--saffron)"
                    : isActive
                    ? "var(--dark)"
                    : "transparent",
                  border: isCompleted
                    ? "2px solid var(--saffron)"
                    : isActive
                    ? "2px solid var(--dark)"
                    : "2px solid var(--border)",
                  color: isCompleted || isActive ? "#fff" : "var(--muted)",
                  transform: isActive ? "scale(1.15)" : "scale(1)",
                }}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{idx + 1}</span>
                )}

                {/* Pulse ring on active */}
                {isActive && (
                  <span
                    className="absolute inset-0 rounded-full"
                    style={{
                      border: "2px solid var(--saffron)",
                      animation: "pulse-ring 1.4s ease-out infinite",
                    }}
                  />
                )}
              </div>

              <span
                className="mt-1.5 text-xs font-medium tracking-wide transition-colors duration-300"
                style={{ color: isActive ? "var(--dark)" : isCompleted ? "var(--saffron)" : "var(--muted)" }}
              >
                {label}
              </span>
            </div>

            {/* Connector line */}
            {idx < STEPS.length - 1 && (
              <div
                className="h-0.5 w-12 mx-1 mb-5 rounded transition-all duration-500"
                style={{ background: idx < currentStep ? "var(--saffron)" : "var(--border)" }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
