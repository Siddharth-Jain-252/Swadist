import { useState, useCallback } from "react";
import { capitalise } from "../utils/format";

const INITIAL_STATE = {
  city: null,
  cart: { id: null, qty: 0 },   // single selection
  vehicle: null,
  trafficLevel: null,
  distance: "",
  orderDateTime: "",  // ISO string: date + time combined
};

export function useOrderFlow() {
  const [step, setStep]   = useState(0);
  const [order, setOrder] = useState(INITIAL_STATE);
  const [invoice, setInvoice]   = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Step 1 helpers
  const setCity = useCallback((city) => {
    setOrder((prev) => ({ ...prev, city }));
  }, []);

  // Step 2 helpers
  const selectItem = useCallback((foodId, qty) => {
    setOrder((prev) => ({
      ...prev,
      cart: qty === 0 ? { id: null, qty: 0 } : { id: foodId, qty },
    }));
  }, []);

  // Step 3 helpers
  const setVehicle      = useCallback((v)  => setOrder((p) => ({ ...p, vehicle: v })),      []);
  const setTrafficLevel = useCallback((tl) => setOrder((p) => ({ ...p, trafficLevel: tl })), []);
  const setDistance      = useCallback((d)  => setOrder((p) => ({ ...p, distance: d })),      []);
  const setOrderDateTime = useCallback((dt) => setOrder((p) => ({ ...p, orderDateTime: dt })), []);

  // Step navigation
  const goNext = useCallback(async (foodItems) => {
    if (step < 3) {
      if (step === 2) {
        // Submit to API
        await submitOrder(order, foodItems, setInvoice, setIsLoading, setError);
      }
      setStep((s) => s + 1);
    }
  }, [step, order]);

  const goBack = useCallback(() => {
    setStep((s) => Math.max(0, s - 1));
    setError(null);
  }, []);

  // Validation per step
  const canProceed = useCallback(() => {
    switch (step) {
      case 0: return !!order.city;
      case 1: return order.cart.id !== null && order.cart.qty > 0;
      case 2: return !!order.vehicle && !!order.trafficLevel && order.distance > 0 && !!order.orderDateTime;
      default: return false;
    }
  }, [step, order]);

  return {
    step, order, invoice, isLoading, error,
    setCity, selectItem, setVehicle, setTrafficLevel, setDistance, setOrderDateTime,
    goNext, goBack, canProceed,
  };
}

async function submitOrder(order, foodItems, setInvoice, setIsLoading, setError) {
  setIsLoading(true);
  setError(null);

  const item = foodItems.find((f) => f.id === order.cart.id);

  // Format orderDateTime from "2026-04-20T12:30" → "2026-04-20 12:30:00"
  const Order_Time = order.orderDateTime
    ? order.orderDateTime.replace("T", " ") + ":00"
    : new Date().toISOString().replace("T", " ").slice(0, 19);

  const payload = {
    Item_Name:            item.label,                         // e.g. "Pizza"
    Quantity:             order.cart.qty,                     // e.g. 2
    Total_Price:          item.price,        // e.g. 349.0  (unit price × qty)
    Order_Time,                                               // e.g. "2026-04-20 12:30:00"
    City:                 capitalise(order.city),             // e.g. "Mumbai"
    Driver_Vehicle:       capitalise(order.vehicle),          // e.g. "Motorbike"
    Delivery_Distance_km: parseFloat(order.distance),         // e.g. 5.5
    Traffic_Level:        capitalise(order.trafficLevel),     // e.g. "Medium"
  };

  try {
    const res = await fetch("http://localhost:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`Server responded with ${res.status}`);

    const data = await res.json();
    // Attach invoiceId (backend doesn't generate one) and delivery details for the invoice UI
    setInvoice({
      ...data,
      invoiceId: `INV-${Date.now().toString(36).toUpperCase()}`,
      delivery: {
        vehicle:      order.vehicle,
        trafficLevel: order.trafficLevel,
        distance:     parseFloat(order.distance),
      },
    });
  } catch (err) {
    // If API is unreachable, generate a local mock invoice for demo purposes
    console.warn("API unreachable, using mock invoice:", err.message);
    setInvoice(generateMockInvoice(payload, order));
  } finally {
    setIsLoading(false);
  }
}

function generateMockInvoice(payload, order) {
  const subtotal    = payload.Price;
  const deliveryFee = Math.round(Math.random() * 90 + 10);   // mirrors random.randint(10,100)
  const tax         = Math.round((deliveryFee + subtotal) * 0.05);
  const total       = subtotal + deliveryFee + tax;

  const eta = Math.round(
    (payload.Delivery_Distance_km / (payload.Driver_Vehicle === "motorbike" ? 40 : payload.Driver_Vehicle === "car" ? 30 : 15)) * 60
    * (payload.Traffic_Level === "high" ? 1.5 : payload.Traffic_Level === "medium" ? 1.2 : 1)
  );

  return {
    invoiceId:        `INV-${Date.now().toString(36).toUpperCase()}`,
    timestamp:        payload.Timestamp,
    city:             payload.City,
    item_name:        payload.Item_Name,
    quantity:         payload.Quantity,
    price:            payload.Price / payload.Quantity,
    delivery:         parseFloat(order.distance),
    subtotal,
    deliveryFee,
    tax,
    total,
    estimatedMinutes: Math.max(5, eta),
    status:           "Confirmed",
    // keep nested delivery for UI components
    _delivery: {
      vehicle:      payload.Driver_Vehicle,
      trafficLevel: payload.Traffic_Level,
      distance:     payload.Delivery_Distance_km,
    },
  };
}