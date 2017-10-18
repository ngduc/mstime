var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * Config object.
 */
var allConfig = {
  decimalDigits: 2,
  consoleTime: false
};

var allPlugins = [];

/**
 * Update or get config object. This will override the default config's properties.
 * @param {Object} updateConfig - (optional) config object to update.
 * @returns {Object} - Final config object.
 */
export function config() {
  var updateConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  allConfig = _extends({}, allConfig, updateConfig);
  return allConfig;
}

/**
 * Get or Set an array of plugins and their configs.
 * After setting plugin array, each plugin will be instantiated with config.
 * @param {Array} pluginArray - Array of plugins and their configs.
 * @returns {Array} - Array of all plugins.
 * @example mstime.plugins([ { plugin: mstimePluginUseLocalStorage, config: {} } ])
 * @example mstime.plugins() // return array of plugins.
 */
export function plugins(pluginArray) {
  if (pluginArray) {
    allPlugins = pluginArray;
    // iterate through plugins & instantiate plugin with config:
    for (var i = 0; i < allPlugins.length; i += 1) {
      var pluginObject = allPlugins[i];
      pluginObject.plugin = pluginObject.plugin({ config: pluginObject.config });
    }
  }
  return allPlugins;
}

/**
 * Format a float number to have N digits (allConfig.decimalDigits).
 * @param {number} floatNum - Float number to format.
 * @returns {number} - Formatted number.
 */
export function format(floatNum) {
  return parseFloat(floatNum.toFixed(allConfig.decimalDigits));
}

/**
 * Sum of all numbers in an array.
 * @param {Array} arr - Array of numbers.
 * @returns {number} - Sum of all numbers.
 */
export function sumArray(arr) {
  return arr.reduce(function (a, b) {
    return a + b;
  });
}