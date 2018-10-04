/* eslint-disable no-console */

const present = require('./present');
const { config, plugins, format } = require('./utils');
const mstimePluginTrimMean = require('./default-plugins/mstimePluginTrimMean');

/**
 * Map of timers.
 * @example { code1: { start: [t1], end: [t2], diff: [t2-t1], last, sum, avg } }
 */
let timers = {};
let configRef = {}; // reference of config()

/**
 * Start a timer to measure code performance.
 * The same timer can be started and ended multiple times.
 * @param {string} name - Name of a new or existing timer.
 * @param {Object} options - (optional) More options (data, etc.).
 * @returns {Object} - Timer object.
 */
const start = (name, options = {}) => {
  const startTime = present(); // should be the very first operation!
  configRef = config();
  if (configRef.consoleTime) {
    console.time(name);
  }
  timers[name] = timers[name] || {
    entries: []
    // last: 0, // calculate for these later. (on end())
    // sum: 0,
    // avg: 0,
  };
  const entry = {
    timestamp: +new Date(),
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
const end = name => {
  const endTime = present(); // should be the very first operation!
  if (configRef.consoleTime) {
    console.timeEnd(name);
  }
  const timer = timers[name];
  if (!timer) {
    return null; // missing data (user called "end" without calling "start" first).
  }
  timer.plugins = {};

  const { entries } = timer;
  const lastEntry = entries[entries.length - 1];
  lastEntry.end = format(endTime);
  lastEntry.diff = format(lastEntry.end - lastEntry.start);

  // calculate for more useful values
  timer.last = lastEntry.diff;
  timer.sum = format((timer.sum || 0) + lastEntry.diff);
  timer.avg = format(timer.sum / entries.length);

  // run every Plugin & keep their plugins in "plugins {}"
  const allPlugins = plugins();
  for (let i = 0; i < allPlugins.length; i += 1) {
    const pluginObject = allPlugins[i];
    const { plugin } = pluginObject;
    if (plugin && plugin.run) {
      timer.plugins[plugin.name] = plugin.run(timers, timer);
    }
  }
  return timer;
};

/**
 * Clear a timer.
 * @param {string} name - Timer name to clear.
 */
const clear = name => {
  delete timers[name];
};

/**
 * Plugin: use localStorage to store/load mstime.timers object.
 */
const mstimePluginUseLocalStorage = () => {
  const mstimeTimersObj = JSON.parse(global.localStorage.getItem('mstime.timers'));
  if (mstimeTimersObj) {
    timers = mstimeTimersObj;
  }
  return {
    name: 'mstime-plugin-use-local-storage',
    run: timerData => {
      global.localStorage.setItem('mstime.timers', JSON.stringify(timers));
      const lsData = global.localStorage.getItem('mstime.timers');
      return {
        createdAt: new Date().getTime(),
        totalEntries: timerData.entries.length,
        size: lsData.length
      };
    }
  };
};

export default {
  config,
  plugins,
  timers,
  start,
  end,
  clear,
  mstimePluginUseLocalStorage,
  mstimePluginTrimMean
};
