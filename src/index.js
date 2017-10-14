const present = require('present')
const {
  config, plugins, format, sumArray,
} = require('./utils')

/**
 * Map of timers.
 * @example { code1: { start: [t1], end: [t2], diff: [t2-t1], last, sum, avg } }
 */
const timers = {}

/**
 * Start a timer to measure code performance.
 * The same timer can be started and ended multiple times.
 * @param {string} name - Name of a new or existing timer.
 * @param {Object} options - (optional) More options (data, etc.).
 * @returns {Object} - Timer object.
 */
const start = (name, options = {}) => {
  timers[name] = timers[name] || {
    start: [],
    end: [],
    // diff: [], // initialize these later to save cpu cycles.
    // sum: 0,
    // avg: 0,
  }
  timers[name].start.push(format(present()))
  if (options.data) {
    timers[name].data = options.data
  }
  return timers[name]
}

/**
 * End an existing timer and calculate for diff, sum, avg.
 * @param {string} name - Name of an existing timer.
 * @returns {Object} - Timer object.
 */
const end = (name) => {
  timers[name].end.push(format(present()))
  // calculate for more useful properties:
  const item = timers[name]
  item.diff = item.diff || []
  item.last = format(item.end[item.end.length - 1] - item.start[item.start.length - 1])
  item.diff.push(item.last)
  item.sum = format(sumArray(item.diff))
  item.avg = format(item.sum / item.diff.length)
  return item
}

export default {
  config,
  plugins,
  timers,
  start,
  end,
}
