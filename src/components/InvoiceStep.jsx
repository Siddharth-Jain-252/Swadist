import React from "react";
import { formatINR, capitalise } from "../utils/format";
import { FOOD_ITEMS, CITIES } from "../data/constants";

function InvoiceRow({ label, value, bold = false, accent = false }) {
  return (
    <div className="flex justify-between items-center py-2">
      <span
        className="text-sm"
        style={{ color: bold ? "var(--dark)" : "var(--muted)", fontWeight: bold ? 600 : 400 }}
      >
        {label}
      </span>
      <span
        className="text-sm font-semibold"
        style={{ color: accent ? "var(--saffron)" : "var(--dark)" }}
      >
        {value}
      </span>
    </div>
  );
}

export default function InvoiceStep({ invoice, order }) {
  if (!invoice) return null;

  // Backend returns snake_case keys; mock fallback matches the same shape.
  // `delivery` nested object is attached by the frontend after the API call.
  const deliveryInfo = invoice.delivery || invoice._delivery || {};
  const cityLabel    = CITIES.find((c) => c.id === (invoice.city || order.city))?.label
                       || invoice.city || order.city;
  const itemName     = invoice.item_name;
  const foodData     = FOOD_ITEMS.find((f) => f.label === itemName);
  const date         = invoice.timestamp
    ? new Date(invoice.timestamp).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

  return (
    <div className="animate-bounce-in max-w-md mx-auto">
      {/* Success header */}
      <div className="text-center mb-8">
        <div
          className="inline-flex w-16 h-16 rounded-full items-center justify-center mb-4 animate-bounce-in"
          style={{ background: "var(--success)", boxShadow: "0 8px 24px rgba(46,204,113,0.4)" }}
        >
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2
          className="text-4xl font-black tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif", color: "var(--dark)" }}
        >
          Order Confirmed!
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
          Your delicious food is on its way 🚀
        </p>
      </div>

      {/* Invoice card */}
      <div
        className="rounded-3xl overflow-hidden"
        style={{
          background: "var(--card-bg)",
          border: "1.5px solid var(--border)",
          boxShadow: "0 16px 48px rgba(26,14,5,0.1)",
        }}
      >
        {/* Header strip */}
        <div className="px-6 py-5" style={{ background: "var(--dark)" }}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--turmeric)" }}>
                Invoice
              </p>
              <p className="text-lg font-bold mt-0.5" style={{ color: "#fff" }}>
                #{invoice.invoiceId}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{date}</p>
              <span
                className="mt-1 inline-block px-3 py-0.5 rounded-full text-xs font-semibold"
                style={{ background: "var(--success)", color: "#fff" }}
              >
                {invoice.status}
              </span>
            </div>
          </div>

          {/* ETA */}
          <div
            className="mt-4 flex items-center gap-3 rounded-xl px-4 py-3"
            style={{ background: "rgba(255,255,255,0.07)" }}
          >
            <span className="text-2xl">⏱️</span>
            <div>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Estimated delivery</p>
              <p className="text-xl font-bold" style={{ color: "#fff" }}>
                ~{invoice.estimatedMinutes} min
              </p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>City</p>
              <p className="font-semibold text-sm" style={{ color: "#fff" }}>{cityLabel}</p>
            </div>
          </div>
        </div>

        {/* Item */}
        <div className="px-6 pt-5 pb-3">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--muted)" }}>
            Item Ordered
          </p>
          <div className="flex items-center gap-3">
            {foodData && (
              <img
                src={foodData.image}
                alt={itemName}
                className="w-12 h-12 rounded-xl object-cover"
              />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: "var(--dark)" }}>{itemName}</p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>×{invoice.quantity}</p>
            </div>
            <p className="text-sm font-semibold" style={{ color: "var(--dark)" }}>
              {formatINR(invoice.subtotal)}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-6 my-3" style={{ borderTop: "1px dashed var(--border)" }} />

        {/* Delivery info */}
        <div className="px-6 pb-3">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--muted)" }}>
            Delivery
          </p>
          <div className="flex gap-4 text-xs" style={{ color: "var(--muted)" }}>
            <span>🚗 {capitalise(deliveryInfo.vehicle || order.vehicle)}</span>
            <span>📍 {deliveryInfo.distance ?? invoice.delivery ?? order.distance} km</span>
            <span>🚦 {capitalise(deliveryInfo.trafficLevel || order.trafficLevel)} traffic</span>
          </div>
        </div>

        <div className="mx-6 my-3" style={{ borderTop: "1px dashed var(--border)" }} />

        {/* Totals */}
        <div className="px-6 pb-6">
          <InvoiceRow label="Subtotal"     value={formatINR(invoice.subtotal)} />
          <InvoiceRow label="Delivery fee" value={formatINR(invoice.deliveryFee)} />
          <InvoiceRow label="GST (5%)"     value={formatINR(invoice.tax)} />
          <div className="mt-2 pt-2" style={{ borderTop: "1.5px solid var(--border)" }}>
            <div className="flex justify-between items-center">
              <span className="font-bold text-base" style={{ color: "var(--dark)" }}>Total</span>
              <span className="text-xl font-black" style={{ color: "var(--saffron)" }}>
                {formatINR(invoice.total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-xs mt-5" style={{ color: "var(--muted)" }}>
        Thank you for your order! 🎉
      </p>
    </div>
  );
}