'use strict';

exports.__esModule = true;
exports.default = msPluginTrimMean;

var _require = require('../utils'),
    format = _require.format;

// Usage: mstime.plugins([ { plugin: msPluginTrimMean, config: { percent: 0.2 } } ])
//     (trim 20% (top: 10%, bottom: 10%) of entries, then calculate for average.
// Explanation of TRIMMEAN - similar to an Excel function:
// https://support.office.com/en-us/article/trimmean-function-d90c9878-a119-4746-88fa-63d988f511d3


function msPluginTrimMean(_ref) {
  var _ref$config = _ref.config,
      config = _ref$config === undefined ? {} : _ref$config;

  return {
    name: 'msplugin-trim-mean',
    run: function run(allData, timerData) {
      var percent = typeof config.percent !== 'undefined' ? config.percent : 0.2; // default to 20%
      var includeItems = typeof config.includeItems !== 'undefined' ? config.includeItems : false; // default to false

      // clone (otherwise, it'll mutate original data) & sort smaller > larger
      var sortedArr = timerData.entries.slice().sort(function (a, b) {
        return a.diff - b.diff;
      });

      var l = sortedArr.length;
      var low = Math.round(l * percent);
      var high = l - low;
      var finalArr = sortedArr.slice(low, high);
      var sum = 0;
      finalArr.map(function (e) {
        sum += e.diff;
        return e;
      });
      var output = {
        percent: percent,
        totalEntries: finalArr.length,
        sum: format(sum),
        mean: format(sum / finalArr.length)
      };
      if (includeItems) {
        output.items = finalArr;
      }
      return output;
    }
  };
}
module.exports = exports.default;