const present = require('present')
const { config, format, sumArray } = require('./utils')

/**
 * Map of timers.
 * @example { code1: { start: [t1], end: [t2], diff: [t2-t1], last, sum, avg } }
 */
const timers = {}

/**
 * Start a timer to measure code performance.
 * The same timer can be started and ended multiple times.
 * @param {string} key - Name of a new or existing timer.
 * @returns {Object} - Timer object.
 */
const start = (key) => {
  timers[key] = timers[key] || {
    start: [],
    end: [],
    // diff: [], // initialize these later to save cpu cycles.
    // sum: 0,
    // avg: 0,
  }
  timers[key].start.push(format(present()))
  return timers[key]
}

/**
 * End an existing timer and calculate for diff, sum, avg.
 * @param {string} key - Name of an existing timer.
 * @returns {Object} - Timer object.
 */
const end = (key) => {
  timers[key].end.push(format(present()))
  const item = timers[key]
  item.diff = item.diff || []
  item.last = format(item.end[item.end.length - 1] - item.start[item.start.length - 1])
  item.diff.push(item.last)
  item.sum = format(sumArray(item.diff))
  item.avg = format(item.sum / item.diff.length)
  return item
}

export default {
  config,
  timers,
  start,
  end,
}
