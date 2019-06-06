'use strict';

exports.__esModule = true;

var _present = require('./present');

var _present2 = _interopRequireDefault(_present);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Map of timers.
 * @example { code1: { start: [t1], end: [t2], diff: [t2-t1], last, sum, avg } }
 */
/* eslint-disable no-console */

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

  var allPlugins = (0, _utils.plugins)();
  for (var i = 0; i < allPlugins.length; i += 1) {
    var pluginObject = allPlugins[i];
    var plugin = pluginObject.plugin;

    if (timerData && plugin && plugin.run) {
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
  var startTime = (0, _present2.default)(); // should be the very first operation!
  configRef = (0, _utils.config)();
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
  var endTime = (0, _present2.default)(); // should be the very first operation!
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
  timer.last = (0, _utils.format)(timer.last);
  lastEntry.start = (0, _utils.format)(lastEntry.start);
  lastEntry.end = (0, _utils.format)(endTime);
  lastEntry.diff = (0, _utils.format)(lastEntry.diff);

  timer.sum = (0, _utils.format)(timer.sum);
  timer.avg = (0, _utils.format)(timer.avg);
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
  var allPlugins = (0, _utils.plugins)();
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

exports.default = {
  config: _utils.config,
  plugins: _utils.plugins,
  timers: timers,
  getTimers: getTimers,
  setTimers: setTimers,
  start: start,
  end: end,
  runPlugins: runPlugins,
  clear: clear,
  msPluginUseLocalStorage: msPluginUseLocalStorage
};
module.exports = exports.default;