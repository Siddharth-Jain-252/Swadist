import React, { useMemo } from "react";
import { VEHICLES, TRAFFIC_LEVELS } from "../data/constants";
import NextButton from "./NextButton";

function OptionCard({ selected, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 rounded-2xl p-4 transition-all duration-300 w-full"
      style={{
        background: selected ? "var(--dark)" : "var(--card-bg)",
        border: `2px solid ${selected ? "var(--dark)" : "var(--border)"}`,
        boxShadow: selected ? "0 6px 24px rgba(26,14,5,0.2)" : "0 2px 8px rgba(0,0,0,0.04)",
        transform: selected ? "translateY(-3px)" : "translateY(0)",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function StyledInput({ value, onChange, type, min, max, step, placeholder, suffix, active }) {
  return (
    <div className="relative">
      <input
        type={type}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl px-4 py-3.5 text-sm outline-none transition-all duration-200"
        style={{
          background: "var(--card-bg)",
          border: `2px solid ${active ? "var(--saffron)" : "var(--border)"}`,
          color: "var(--dark)",
          boxShadow: active ? "0 0 0 3px rgba(244,131,31,0.1)" : "none",
          colorScheme: "light",
        }}
      />
      {suffix && (
        <span
          className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold pointer-events-none"
          style={{ color: "var(--muted)" }}
        >
          {suffix}
        </span>
      )}
    </div>
  );
}

export default function DeliveryStep({
  vehicle, trafficLevel, distance, orderDateTime,
  onVehicle, onTraffic, onDistance, onOrderDateTime,
  onNext, isLoading,
}) {
  const canProceed = vehicle && trafficLevel && distance > 0 && !!orderDateTime;

  // Split ISO datetime string into date and time parts for the two inputs
  const [dateVal, timeVal] = useMemo(() => {
    if (!orderDateTime) return ["", ""];
    const [d, t] = orderDateTime.split("T");
    return [d || "", t || ""];
  }, [orderDateTime]);

  // Minimum selectable date = today
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  function handleDateChange(e) {
    const newDate = e.target.value;
    // Preserve existing time or default to 12:00
    const time = timeVal || "12:00";
    onOrderDateTime(newDate ? `${newDate}T${time}` : "");
  }

  function handleTimeChange(e) {
    const newTime = e.target.value;
    // Preserve existing date or default to today
    const date = dateVal || todayStr;
    onOrderDateTime(newTime ? `${date}T${newTime}` : "");
  }

  return (
    <div className="animate-fade-slide max-w-lg mx-auto">
      <h2
        className="text-center mb-1 text-4xl font-black tracking-tight"
        style={{ fontFamily: "'Playfair Display', serif", color: "var(--dark)" }}
      >
        Delivery details
      </h2>
      <p className="text-center text-sm mb-8" style={{ color: "var(--muted)" }}>
        Tell us how you want your order delivered
      </p>

      {/* Vehicle */}
      <section className="mb-7">
        <label className="block text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--muted)" }}>
          Driver Vehicle
        </label>
        <div className="grid grid-cols-3 gap-3">
          {VEHICLES.map((v) => (
            <OptionCard key={v.id} selected={vehicle === v.id} onClick={() => onVehicle(v.id)}>
              <span className="text-3xl">{v.icon}</span>
              <span
                className="text-sm font-semibold"
                style={{ color: vehicle === v.id ? "#fff" : "var(--dark)" }}
              >
                {v.label}
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: vehicle === v.id ? "rgba(255,255,255,0.15)" : "var(--border)",
                  color: vehicle === v.id ? "rgba(255,255,255,0.8)" : "var(--muted)",
                }}
              >
                {v.speed}
              </span>
            </OptionCard>
          ))}
        </div>
      </section>

      {/* Traffic Level */}
      <section className="mb-7">
        <label className="block text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--muted)" }}>
          Traffic Level
        </label>
        <div className="grid grid-cols-3 gap-3">
          {TRAFFIC_LEVELS.map((tl) => (
            <OptionCard key={tl.id} selected={trafficLevel === tl.id} onClick={() => onTraffic(tl.id)}>
              <span
                className="w-3 h-3 rounded-full"
                style={{ background: tl.color, boxShadow: `0 0 8px ${tl.color}` }}
              />
              <span
                className="text-sm font-semibold"
                style={{ color: trafficLevel === tl.id ? "#fff" : "var(--dark)" }}
              >
                {tl.label}
              </span>
              <span
                className="text-xs"
                style={{ color: trafficLevel === tl.id ? "rgba(255,255,255,0.65)" : "var(--muted)" }}
              >
                {tl.desc}
              </span>
            </OptionCard>
          ))}
        </div>
      </section>

      {/* Distance */}
      <section className="mb-7">
        <label className="block text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--muted)" }}>
          Distance (km)
        </label>
        <StyledInput
          type="number"
          min="0.1"
          max="100"
          step="0.1"
          value={distance}
          onChange={(e) => onDistance(e.target.value)}
          placeholder="e.g. 5.5"
          suffix="km"
          active={distance > 0}
        />
      </section>

      {/* Date & Time */}
      <section className="mb-8">
        <label className="block text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--muted)" }}>
          Delivery Date & Time
        </label>
        <div className="grid grid-cols-2 gap-3">
          {/* Date picker */}
          <div>
            <p className="text-xs mb-1.5" style={{ color: "var(--muted)" }}>Date</p>
            <StyledInput
              type="date"
              min={todayStr}
              value={dateVal}
              onChange={handleDateChange}
              active={!!dateVal}
            />
          </div>

          {/* Time picker */}
          <div>
            <p className="text-xs mb-1.5" style={{ color: "var(--muted)" }}>Time</p>
            <StyledInput
              type="time"
              value={timeVal}
              onChange={handleTimeChange}
              active={!!timeVal}
            />
          </div>
        </div>

        {/* Human-readable preview */}
        {orderDateTime && (
          <p className="mt-2.5 text-xs animate-fade-in" style={{ color: "var(--muted)" }}>
            📅 Scheduled for{" "}
            <strong style={{ color: "var(--dark)" }}>
              {new Date(orderDateTime).toLocaleString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </strong>
          </p>
        )}
      </section>

      <div className="flex justify-center">
        <NextButton
          onClick={onNext}
          disabled={!canProceed}
          loading={isLoading}
          label="Place Order →"
        />
      </div>
    </div>
  );
}