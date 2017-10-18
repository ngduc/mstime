'use strict';

/* eslint-disable */
// source: https://github.com/dbkaplun/present
var performance = window.performance || {};

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

module.exports = present;