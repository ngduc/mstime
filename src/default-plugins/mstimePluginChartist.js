// const { format } = require('../utils');

// Usage: mstime.plugins([ { plugin: mstimePluginChartist, config: { container: '' } } ])
//    Plot data using Chartist - http://gionkunz.github.io/chartist-js
export default function mstimePluginChartist({ config = {} }) {
  // if (typeof Chartist !== 'undefined') {
  //   console.error('Chartist is not available - see: http://gionkunz.github.io/chartist-js');
  // }
  const { Chartist } = window;
  return {
    name: 'mstime-plugin-chartist',
    run: (allData, timerData) => {
      const container = typeof config.container !== 'undefined' ? config.container : '.ct-chart'; // default .ct-chart

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
      if (!Chartist) {
        return {};
      }
      new Chartist.Line(container, data, {
        series: {
          avg: { showPoint: false }
        }
      });
      return {
        container
      };
    }
  };
}
