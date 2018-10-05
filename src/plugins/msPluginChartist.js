// const { format } = require('../utils');

// Usage: mstime.plugins([ { plugin: mstimePluginChartist, config: { container: '' } } ])
//    Plot data using Chartist - http://gionkunz.github.io/chartist-js
export default function msPluginChartist({ config = {} }) {
  // if (typeof Chartist !== 'undefined') {
  //   console.error('Chartist is not available - see: http://gionkunz.github.io/chartist-js');
  // }
  const { Chartist } = window;
  return {
    name: 'msplugin-chartist',
    run: (allData, timerData) => {
      if (!Chartist) {
        return {};
      }
      const idAttr = config.idAttr || 'data-mstime-id';

      const data = {
        // A labels array that can contain any sort of values
        labels: timerData.entries.map((d, idx) => idx),
        // Our series array that contains series objects or in this case series data arrays
        series: [
          {
            name: 'avg',
            data: timerData.entries.map(d => timerData.avg)
          },
          {
            name: 'time',
            data: timerData.entries.map(d => d.diff)
          }
        ]
      };
      const queryStr = `[${idAttr}="${timerData.name}"]`;
      if (window && !window.TEST_ENV && document.querySelectorAll(queryStr).length === 0) {
        return {};
      }
      new Chartist.Line(queryStr, data, {
        series: {
          avg: { showPoint: false }
        }
      });
      return {
        idAttr
      };
    }
  };
}
