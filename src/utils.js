/**
 * Config object.
 */
let allConfig = {
  decimalDigits: 2,
}

/**
 * Update or get config object. This will override the default config's properties.
 * @param {Object} updateConfig - (optional) config object to update.
 * @returns {Object} - Final config object.
 */
export function config(updateConfig = {}) {
  allConfig = { ...allConfig, ...updateConfig }
  return allConfig
}

/**
 * Format a float number to have N digits (allConfig.decimalDigits).
 * @param {number} floatNum - Float number to format.
 * @returns {number} - Formatted number.
 */
export function format(floatNum) {
  return parseFloat(floatNum.toFixed(allConfig.decimalDigits))
}

/**
 * Sum of all numbers in an array.
 * @param {Array} arr - Array of numbers.
 * @returns {number} - Sum of all numbers.
 */
export function sumArray(arr) {
  return arr.reduce((a, b) => a + b)
}
