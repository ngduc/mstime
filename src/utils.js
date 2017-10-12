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

export function format(floatNum) {
  return parseFloat(floatNum.toFixed(allConfig.decimalDigits))
}
