/* eslint-disable no-console */

var present = require('./present');

var _require = require('./utils'),
    config = _require.config,
    plugins = _require.plugins,
    format = _require.format,
    sumArray = _require.sumArray;

/**
 * Map of timers.
 * @example { code1: { start: [t1], end: [t2], diff: [t2-t1], last, sum, avg } }
 */


var timers = {};

/**
 * Start a timer to measure code performance.
 * The same timer can be started and ended multiple times.
 * @param {string} name - Name of a new or existing timer.
 * @param {Object} options - (optional) More options (data, etc.).
 * @returns {Object} - Timer object.
 */
var start = function start(name) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (config().consoleTime) {
    console.time(name);
  }
  var startTime = present();
  timers[name] = timers[name] || {
    entries: []
    // last: 0, // calculate for these later. (on end())
    // sum: 0,
    // avg: 0,
  };
  var entry = {
    start: format(startTime)
  };
  if (options.data) {
    entry.data = options.data;
  }
  timers[name].entries.push(entry);
  return timers[name];
};

/**
 * End an existing timer and calculate for diff, sum, avg.
 * @param {string} name - Name of an existing timer.
 * @returns {Object} - Timer object.
 */
var end = function end(name) {
  if (config().consoleTime) {
    console.timeEnd(name);
  }
  var endTime = present();
  var item = timers[name];
  item.output = {};

  var entries = item.entries;

  var lastEntry = entries[entries.length - 1];
  lastEntry.end = format(endTime);
  lastEntry.diff = format(lastEntry.end - lastEntry.start);

  // calculate for more useful values
  item.last = lastEntry.diff;

  var diffArr = entries.map(function (e) {
    return e.diff;
  });
  item.sum = format(sumArray(diffArr));
  item.avg = format(item.sum / entries.length);

  // run every Plugin & keep their outputs in "output {}"
  var allPlugins = plugins();
  for (var i = 0; i < allPlugins.length; i += 1) {
    var pluginObject = allPlugins[i];
    var plugin = pluginObject.plugin;

    if (plugin && plugin.run) {
      item.output[plugin.name] = plugin.run(item);
    }
  }
  return item;
};

/**
 * Clear a timer.
 * @param {string} name - Timer name to clear.
 */
var clear = function clear(name) {
  delete timers[name];
};

/**
 * Default plugin: use localStorage to store/load mstime.timers object.
 */
var mstimePluginUseLocalStorage = function mstimePluginUseLocalStorage() {
  var mstimeTimersObj = JSON.parse(global.localStorage.getItem('mstime.timers'));
  if (mstimeTimersObj) {
    timers = mstimeTimersObj;
  }
  return {
    name: 'mstime-plugin-use-local-storage',
    run: function run(timerData) {
      global.localStorage.setItem('mstime.timers', JSON.stringify(timers));
      var lsData = global.localStorage.getItem('mstime.timers');
      return {
        createdAt: new Date().getTime(),
        totalEntries: timerData.entries.length,
        size: lsData.length
      };
    }
  };
};

export default {
  config: config,
  plugins: plugins,
  timers: timers,
  start: start,
  end: end,
  clear: clear,
  mstimePluginUseLocalStorage: mstimePluginUseLocalStorage
};