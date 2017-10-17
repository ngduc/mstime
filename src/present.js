const performance = global.performance || {}

const present = (function () {
  const names = ['now', 'webkitNow', 'msNow', 'mozNow', 'oNow']
  while (names.length) {
    const name = names.shift()
    if (name in performance) {
      return performance[name].bind(performance)
    }
  }

  const dateNow =
    Date.now ||
    function () {
      return new Date().getTime()
    }
  const navigationStart = (performance.timing || {}).navigationStart || dateNow()
  return function () {
    return dateNow() - navigationStart
  }
}())

present.performanceNow = performance.now
present.noConflict = function () {
  performance.now = present.performanceNow
}
present.conflict = function () {
  performance.now = present
}
present.conflict()

module.exports = present
