/**
 * Utility function to format prices in Kenyan Shilling (KSH)
 * @param {number} price - The price to format
 * @returns {string} Formatted price string with KSH symbol
 */
export const formatPrice = (price) => {
  if (price === null || price === undefined) return "KSH 0.00";
  return `KSH ${parseFloat(price).toFixed(2)}`;
};

/**
 * Get price value without formatting (for calculations)
 * @param {number} price - The price value
 * @returns {number} Price as number
 */
export const getPriceValue = (price) => {
  return parseFloat(price) || 0;
};
