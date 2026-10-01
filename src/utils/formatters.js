/**
 * Global formatting utilities for Pinal application
 * All numbers should display with maximum 2 decimal places
 */

/**
 * Format a number as currency (XOF by default)
 * @param {number} value - The value to format
 * @param {string} currency - Currency code (default: 'XOF')
 * @param {number} maxDecimals - Maximum decimal places (default: 2)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(value, currency = 'XOF', maxDecimals = 2) {
  if (value == null || isNaN(value)) {
    return '—';
  }
  
  return new Intl.NumberFormat('fr-SN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits: 0
  }).format(value);
}

/**
 * Format a number with decimal places
 * @param {number} value - The value to format
 * @param {number} maxDecimals - Maximum decimal places (default: 2)
 * @returns {string} Formatted number string
 */
export function formatNumber(value, maxDecimals = 2) {
  if (value == null || isNaN(value)) {
    return '—';
  }
  
  return new Intl.NumberFormat('fr-SN', {
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits: 0
  }).format(value);
}

/**
 * Format a number as percentage
 * @param {number} value - The value to format (e.g., 15.5 for 15.5%)
 * @param {number} maxDecimals - Maximum decimal places (default: 2)
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(value, maxDecimals = 2) {
  if (value == null || isNaN(value)) {
    return '—';
  }
  
  return new Intl.NumberFormat('fr-SN', {
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits: 0
  }).format(value) + '%';
}

/**
 * Format currency with prefix (+ or -) for transaction display
 * @param {number} value - The value to format
 * @param {string} currency - Currency code (default: 'XOF')
 * @param {number} maxDecimals - Maximum decimal places (default: 2)
 * @returns {string} Formatted currency with prefix
 */
export function formatCurrencyWithSign(value, currency = 'XOF', maxDecimals = 2) {
  if (value == null || isNaN(value)) {
    return '—';
  }
  
  const prefix = value > 0 ? '+' : '';
  const formatted = new Intl.NumberFormat('fr-SN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits: 0
  }).format(value);
  
  return prefix + formatted;
}

/**
 * Format large numbers in compact notation (k, M, etc.)
 * @param {number} value - The value to format
 * @param {string} currency - Currency code (default: 'XOF')
 * @param {number} maxDecimals - Maximum decimal places (default: 2)
 * @returns {string} Formatted compact currency
 */
export function formatCurrencyCompact(value, currency = 'XOF', maxDecimals = 2) {
  if (value == null || isNaN(value)) {
    return '—';
  }
  
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    notation: 'compact',
    maximumFractionDigits: maxDecimals
  }).format(value);
}
