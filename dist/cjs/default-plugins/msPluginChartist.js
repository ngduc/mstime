'use strict';

exports.__esModule = true;
exports.default = msPluginChartist;
// const { format } = require('../utils');

// Usage: mstime.plugins([ { plugin: mstimePluginChartist, config: { container: '' } } ])
//    Plot data using Chartist - http://gionkunz.github.io/chartist-js
function msPluginChartist(_ref) {
  var _ref$config = _ref.config,
      config = _ref$config === undefined ? {} : _ref$config;

  // if (typeof Chartist !== 'undefined') {
  //   console.error('Chartist is not available - see: http://gionkunz.github.io/chartist-js');
  // }
  var _window = window,
      Chartist = _window.Chartist;

  return {
    name: 'msplugin-chartist',
    run: function run(allData, timerData) {
      if (!Chartist) {
        return {};
      }
      var idAttr = config.idAttr || 'data-mstime-id';

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
      var queryStr = '[' + idAttr + '="' + timerData.name + '"]';
      if (window && !window.TEST_ENV && document.querySelectorAll(queryStr).length === 0) {
        return {};
      }
      new Chartist.Line(queryStr, data, {
        series: {
          avg: { showPoint: false }
        }
      });
      return {
        idAttr: idAttr
      };
    }
  };
}
module.exports = exports.default;