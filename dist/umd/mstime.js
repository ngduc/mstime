(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.mstime = factory());
}(this, (function () { 'use strict';

/* eslint-disable no-console */

var present = require('./present');

var _require = require('./utils');
var config = _require.config;
var plugins = _require.plugins;
var format = _require.format;

var mstimePluginTrimMean = require('./default-plugins/mstimePluginTrimMean');
var mstimePluginChartist = require('./default-plugins/mstimePluginChartist');

/**
 * Map of timers.
 * @example { code1: { start: [t1], end: [t2], diff: [t2-t1], last, sum, avg } }
 */
var timers = {};
var configRef = {}; // reference of config()

/**
 * Start a timer to measure code performance.
 * The same timer can be started and ended multiple times.
 * @param {string} name - Name of a new or existing timer.
 * @param {Object} options - (optional) More options (data, etc.).
 * @returns {Object} - Timer object.
 */
var start = function start(name) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var startTime = present(); // should be the very first operation!
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
  var entry = {
    timestamp: +new Date(),
    start: startTime
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
  var endTime = present(); // should be the very first operation!
  if (configRef.consoleTime) {
    console.timeEnd(name);
  }
  var timer = timers[name];
  if (!timer) {
    return null; // missing data (user called "end" without calling "start" first).
  }
  timer.plugins = {};

  var entries = timer.entries;

  var lastEntry = entries[entries.length - 1];
  lastEntry.diff = endTime - lastEntry.start;

  // calculate for more useful values
  timer.last = lastEntry.diff;
  timer.sum = (timer.sum || 0) + lastEntry.diff;
  timer.avg = timer.sum / entries.length;

  // --- stop calculating from this point => format data: (formatting will affect any calculation)
  lastEntry.avg = timer.avg; // keep current avg in each entry
  timer.last = format(timer.last);
  lastEntry.start = format(lastEntry.start);
  lastEntry.end = format(endTime);
  lastEntry.diff = format(lastEntry.diff);

  timer.sum = format(timer.sum);
  timer.avg = format(timer.avg);

  // run every Plugin & keep their plugins in "plugins {}"
  var allPlugins = plugins();
  for (var i = 0; i < allPlugins.length; i += 1) {
    var pluginObject = allPlugins[i];
    var plugin = pluginObject.plugin;

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
var clear = function clear(name) {
  delete timers[name];

  // call plugin.clear() - if any:
  var allPlugins = plugins();
  for (var i = 0; i < allPlugins.length; i += 1) {
    var pluginObject = allPlugins[i];
    var plugin = pluginObject.plugin;

    if (plugin && plugin.clear) {
      plugin.clear();
    }
  }
};

/**
 * Plugin: use localStorage to store/load mstime.timers object.
 */
var mstimePluginUseLocalStorage = function mstimePluginUseLocalStorage() {
  var mstimeTimersObj = JSON.parse(global.localStorage.getItem('mstime.timers'));
  if (mstimeTimersObj) {
    timers = mstimeTimersObj; // set "timers" data (loaded from localStorage)
  }
  return {
    name: 'mstime-plugin-use-local-storage',
    run: function run(allData, timerData) {
      global.localStorage.setItem('mstime.timers', JSON.stringify(timers));
      var lsData = global.localStorage.getItem('mstime.timers');
      return {
        createdAt: new Date().getTime(),
        totalEntries: timerData.entries.length,
        size: lsData.length
      };
    },
    clear: function clear() {
      // assume timers got cleared before this function gets called => save to storage:
      global.localStorage.setItem('mstime.timers', JSON.stringify(timers));
    }
  };
};

var index = {
  config: config,
  plugins: plugins,
  timers: timers,
  start: start,
  end: end,
  clear: clear,
  mstimePluginUseLocalStorage: mstimePluginUseLocalStorage,
  mstimePluginTrimMean: mstimePluginTrimMean,
  mstimePluginChartist: mstimePluginChartist
};

return index;

})));
