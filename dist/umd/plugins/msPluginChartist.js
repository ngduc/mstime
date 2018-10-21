'use strict';

exports.__esModule = true;
exports.default = msPluginChartist;
// Usage: mstime.plugins([ { plugin: mstimePluginChartist, config: { idAttr: 'data-mstime-id' } } ])
//    Make sure you initialize Chartist & have DOM Element(s) with an id attribute. (value is timer name)
//    Example - https://rawgit.com/ngduc/mstime/master/docs/demo/index.html
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
      // query for Chart Container Element:
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