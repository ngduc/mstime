const { format } = require('../utils');

// Usage: mstime.plugins([ { plugin: mstimePluginTrimMean, config: { percent: 0.2 } } ])
//     (trim 20% (top: 10%, bottom: 10%) of entries, then calculate for average.
// Explanation of TRIMMEAN - similar to an Excel function:
// https://support.office.com/en-us/article/trimmean-function-d90c9878-a119-4746-88fa-63d988f511d3
export default function mstimePluginTrimMean({ config = {} }) {
  return {
    name: 'mstime-plugin-trim-mean',
    run: (allData, timerData) => {
      const percent = typeof config.percent !== 'undefined' ? config.percent : 0.2; // default to 20%
      const includeItems = typeof config.includeItems !== 'undefined' ? config.includeItems : false; // default to false

      // clone (otherwise, it'll mutate original data) & sort smaller > larger
      const sortedArr = timerData.entries.slice().sort((a, b) => a.diff - b.diff);

      const l = sortedArr.length;
      const low = Math.round(l * percent);
      const high = l - low;
      const finalArr = sortedArr.slice(low, high);
      let sum = 0;
      finalArr.map(e => {
        sum += e.diff;
        return e;
      });
      const output = {
        percent,
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
