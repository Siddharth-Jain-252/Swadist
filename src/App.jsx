import React from "react";
import { FOOD_ITEMS } from "./data/constants";
import { useOrderFlow } from "./hooks/useOrderFlow";
import StepIndicator from "./components/StepIndicator";
import CityStep     from "./components/CityStep";
import FoodStep     from "./components/FoodStep";
import DeliveryStep from "./components/DeliveryStep";
import InvoiceStep  from "./components/InvoiceStep";

export default function App() {
  const {
    step, order, invoice, isLoading, error,
    setCity, selectItem, setVehicle, setTrafficLevel, setDistance, setOrderDateTime,
    goNext, goBack,
  } = useOrderFlow();

  function handleNext() {
    goNext(FOOD_ITEMS);
  }

  return (
    <div
      className="min-h-screen relative"
      style={{ background: "var(--cream)" }}
    >
      {/* Decorative background blobs */}
      <div
        className="pointer-events-none fixed top-0 right-0 w-96 h-96 rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, var(--turmeric), transparent 70%)",
          filter: "blur(60px)",
          transform: "translate(30%, -30%)",
        }}
      />
      <div
        className="pointer-events-none fixed bottom-0 left-0 w-80 h-80 rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, var(--crimson), transparent 70%)",
          filter: "blur(60px)",
          transform: "translate(-30%, 30%)",
        }}
      />

      {/* Header */}
      <header className="relative z-10 pt-8 pb-4 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-3xl">🍽️</span>
          <h1
            className="text-2xl font-black tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif", color: "var(--dark)" }}
          >
            Swadist
          </h1>
        </div>
        <p className="text-xs tracking-widest uppercase" style={{ color: "var(--muted)" }}>
          Food delivery, reimagined
        </p>
      </header>

      {/* Main card */}
      <main className="relative z-10 max-w-3xl mx-auto px-4 py-6">
        <div
          className="rounded-3xl p-6 sm:p-8"
          style={{
            background: "rgba(253,246,236,0.85)",
            backdropFilter: "blur(12px)",
            border: "1.5px solid var(--border)",
            boxShadow: "0 20px 60px rgba(26,14,5,0.08)",
          }}
        >
          {/* Step indicator (hide on invoice) */}
          {step < 4 && <StepIndicator currentStep={step} />}

          {/* Error banner */}
          {error && (
            <div
              className="mb-6 rounded-xl px-4 py-3 text-sm animate-fade-in"
              style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", color: "#B91C1C" }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* Step views */}
          {step === 0 && (
            <CityStep
              selected={order.city}
              onSelect={setCity}
              onNext={handleNext}
            />
          )}

          {step === 1 && (
            <FoodStep
              cart={order.cart}
              onSelect={selectItem}
              onNext={handleNext}
            />
          )}

          {step === 2 && (
            <DeliveryStep
              vehicle={order.vehicle}
              trafficLevel={order.trafficLevel}
              distance={order.distance}
              orderDateTime={order.orderDateTime}
              onVehicle={setVehicle}
              onTraffic={setTrafficLevel}
              onDistance={setDistance}
              onOrderDateTime={setOrderDateTime}
              onNext={handleNext}
              isLoading={isLoading}
            />
          )}

          {step === 3 && (
            <InvoiceStep invoice={invoice} order={order} />
          )}

          {/* Back navigation */}
          {step > 0 && step < 3 && (
            <div className="mt-6 text-center">
              <button
                onClick={goBack}
                className="text-sm transition-colors duration-200"
                style={{ color: "var(--muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--dark)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
              >
                ← Go back
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6">
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          © 2025 Swadist · Made with ❤️ in India
        </p>
      </footer>
    </div>
  );
}