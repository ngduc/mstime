'use strict';

exports.__esModule = true;
exports.default = mstimePluginChartist;
// const { format } = require('../utils');

// Usage: mstime.plugins([ { plugin: mstimePluginChartist, config: { container: '' } } ])
//    Plot data using Chartist - http://gionkunz.github.io/chartist-js
function mstimePluginChartist(_ref) {
  var _ref$config = _ref.config,
      config = _ref$config === undefined ? {} : _ref$config;

  // if (typeof Chartist !== 'undefined') {
  //   console.error('Chartist is not available - see: http://gionkunz.github.io/chartist-js');
  // }
  var _window = window,
      Chartist = _window.Chartist;

  return {
    name: 'mstime-plugin-chartist',
    run: function run(allData, timerData) {
      var container = typeof config.container !== 'undefined' ? config.container : '.ct-chart'; // default .ct-chart

      var data = {
        // A labels array that can contain any sort of values
        labels: timerData.entries.map(function (d, idx) {
          return idx;
        }),
        // Our series array that contains series objects or in this case series data arrays
        series: [{
          name: 'avg',
          data: timerData.entries.map(function (d) {
            return timerData.avg;
          })
        }, {
          name: 'time',
          data: timerData.entries.map(function (d) {
            return d.diff;
          })
        }]
      };
      if (!Chartist) {
        return {};
      }
      new Chartist.Line(container, data, {
        series: {
          avg: { showPoint: false }
        }
      });
      return {
        container: container
      };
    }
  };
}
module.exports = exports.default;