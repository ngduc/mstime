/* eslint-disable */
// source: https://github.com/dbkaplun/present
const performance = global.performance || {};

const present = (function() {
  // if NodeJS
  if (typeof process !== 'undefined' && process.hrtime) {
    return function() {
      const time = process.hrtime();
      return time[0] * 1e3 + time[1] / 1e6;
    };
  }

  const names = ['now', 'webkitNow', 'msNow', 'mozNow', 'oNow'];
  while (names.length) {
    const name = names.shift();
    if (name in performance) {
      return performance[name].bind(performance);
    }
  }

  const dateNow =
    Date.now ||
    function() {
      return new Date().getTime();
    };
  const navigationStart = (performance.timing || {}).navigationStart || dateNow();
  return function() {
    return dateNow() - navigationStart;
  };
})();

present.performanceNow = performance.now;
present.noConflict = function() {
  performance.now = present.performanceNow;
};
present.conflict = function() {
  performance.now = present;
};
present.conflict();

// module.exports = present
export default present;
