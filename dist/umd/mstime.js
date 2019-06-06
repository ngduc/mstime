(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.mstime = factory());
}(this, (function () { 'use strict';

/* eslint-disable */
// source: https://github.com/dbkaplun/present
var performance = global.performance || {};

var present = function () {
  // if NodeJS
  if (typeof process !== 'undefined' && process.hrtime) {
    return function () {
      var time = process.hrtime();
      return time[0] * 1e3 + time[1] / 1e6;
    };
  }

  var names = ['now', 'webkitNow', 'msNow', 'mozNow', 'oNow'];
  while (names.length) {
    var name = names.shift();
    if (name in performance) {
      return performance[name].bind(performance);
    }
  }

  var dateNow = Date.now || function () {
    return new Date().getTime();
  };
  var navigationStart = (performance.timing || {}).navigationStart || dateNow();
  return function () {
    return dateNow() - navigationStart;
  };
}();

present.performanceNow = performance.now;
present.noConflict = function () {
  performance.now = present.performanceNow;
};
present.conflict = function () {
  performance.now = present;
};
present.conflict();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * Config object.
 */
var allConfig = {
  decimalDigits: 2,
  consoleTime: false
};

var allPlugins = [];

/**
 * Update or get config object. This will override the default config's properties.
 * @param {Object} updateConfig - (optional) config object to update.
 * @returns {Object} - Final config object.
 */
function config() {
  var updateConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  allConfig = _extends({}, allConfig, updateConfig);
  return allConfig;
}

/**
 * Get or Set an array of plugins and their configs.
 * After setting plugin array, each plugin will be instantiated with config.
 * @param {Array} pluginArray - Array of plugins and their configs.
 * @returns {Array} - Array of all plugins.
 * @example mstime.plugins([ { plugin: mstimePluginUseLocalStorage, config: {} } ])
 * @example mstime.plugins() // return array of plugins.
 */
function plugins(pluginArray) {
  if (pluginArray) {
    allPlugins = pluginArray;
    // iterate through plugins & instantiate plugin with config:
    for (var i = 0; i < allPlugins.length; i += 1) {
      var pluginObject = allPlugins[i];
      pluginObject.plugin = pluginObject.plugin({
        config: pluginObject.config
      });
    }
  }
  return allPlugins;
}

/**
 * Format a float number to have N digits (allConfig.decimalDigits).
 * @param {number} floatNum - Float number to format.
 * @returns {number} - Formatted number.
 */
function format(floatNum) {
  return parseFloat(floatNum.toFixed(allConfig.decimalDigits));
}

/**
 * Sum of all numbers in an array.
 * @param {Array} arr - Array of numbers.
 * @returns {number} - Sum of all numbers.
 */

/* eslint-disable no-console */

/**
 * Map of timers.
 * @example { code1: { start: [t1], end: [t2], diff: [t2-t1], last, sum, avg } }
 */
var timers = {};
var configRef = {}; // reference of config()

var getTimers = function getTimers() {
  return timers;
};
var setTimers = function setTimers(timersData) {
  timers = timersData;
};

// run every Plugin & keep their plugin results in "timerData.plugins {}"
// without "newTimerData", this will run plugins on existing data only.
var runPlugins = function runPlugins(name) {
  var newTimerData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  var timerData = newTimerData || timers[name];

  var allPlugins = plugins();
  for (var i = 0; i < allPlugins.length; i += 1) {
    var pluginObject = allPlugins[i];
    var plugin = pluginObject.plugin;

    if (plugin && plugin.run) {
      timerData.plugins[plugin.name] = plugin.run(timers, timerData);
    }
  }
};

/**
 * Start a timer to measure code performance.
 * The same timer can be started and ended multiple times.
 * @param {string} name - Name of a new or existing timer.
 * @param {Object} data - (optional) More data (id, etc.).
 * @returns {Object} - Timer object.
 */
var start = function start(name, data) {
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
  if (data) {
    entry.data = data;
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
  timer.name = name;
  lastEntry.avg = timer.avg; // keep current avg in each entry
  timer.last = format(timer.last);
  lastEntry.start = format(lastEntry.start);
  lastEntry.end = format(endTime);
  lastEntry.diff = format(lastEntry.diff);

  timer.sum = format(timer.sum);
  timer.avg = format(timer.avg);
  timer.count = entries.length;

  runPlugins(name, timer);
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
 * Built-in Plugin: use localStorage to store/load mstime.timers object.
 */
var msPluginUseLocalStorage = function msPluginUseLocalStorage() {
  var mstimeTimersObj = JSON.parse(global.localStorage.getItem('mstime.timers'));
  if (mstimeTimersObj) {
    timers = mstimeTimersObj; // set "timers" data (loaded from localStorage)
  }
  return {
    name: 'msplugin-use-local-storage',
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
  getTimers: getTimers,
  setTimers: setTimers,
  start: start,
  end: end,
  runPlugins: runPlugins,
  clear: clear,
  msPluginUseLocalStorage: msPluginUseLocalStorage
};

return index;

})));
