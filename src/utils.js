/**
 * Config object.
 */
let allConfig = {
  decimalDigits: 2,
}

let allPlugins = []

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
 * Get or Set an array of plugins and their configs.
 * After setting plugin array, each plugin will be instantiated with config.
 * @param {Array} pluginArray - Array of plugins and their configs.
 * @returns {Array} - Array of all plugins.
 * @example mstime.plugins([ { plugin: require('mstime-plugin-post'), config: { url: '' } } ])
 * @example mstime.plugins() // return array of plugins.
 */
export function plugins(pluginArray) {
  if (pluginArray) {
    allPlugins = pluginArray
    // iterate through plugins & instantiate plugin with config:
    for (let i = 0; i < allPlugins.length; i += 1) {
      const pluginObject = allPlugins[i]
      pluginObject.instance = pluginObject.plugin({ config: pluginObject.config })
    }
  }
  return allPlugins
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
