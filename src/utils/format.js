/**
 * Format a number as Indian Rupees.
 * @param {number} amount
 * @returns {string}  e.g. "₹1,249"
 */
export function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Capitalise the first letter of a string.
 */
export function capitalise(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
