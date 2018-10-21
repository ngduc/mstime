// Usage: mstime.plugins([ { plugin: mstimePluginChartist, config: { idAttr: 'data-mstime-id' } } ])
//    Make sure you initialize Chartist & have DOM Element(s) with an id attribute. (value is timer name)
//    Example - https://rawgit.com/ngduc/mstime/master/docs/demo/index.html
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
      // query for Chart Container Element:
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
