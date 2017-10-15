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
    entries: [],
    // last: 0, // calculate for these later. (on end())
    // sum: 0,
    // avg: 0,
  }
  const entry = {
    start: format(present()),
  }
  if (options.data) {
    entry.data = options.data
  }
  timers[name].entries.push(entry)
  return timers[name]
}

/**
 * End an existing timer and calculate for diff, sum, avg.
 * @param {string} name - Name of an existing timer.
 * @returns {Object} - Timer object.
 */
const end = (name) => {
  const { entries } = timers[name]
  const lastEntry = entries[entries.length - 1]
  lastEntry.end = format(present())
  lastEntry.diff = format(lastEntry.end - lastEntry.start)

  const item = timers[name]
  item.last = lastEntry.diff

  const diffArr = entries.map(e => e.diff)
  item.sum = format(sumArray(diffArr))
  item.avg = format(item.sum / entries.length)
  item.output = {}

  const allPlugins = plugins()
  for (let i = 0; i < allPlugins.length; i += 1) {
    const pluginObject = allPlugins[i]
    const { instance } = pluginObject
    if (instance && instance.run) {
      item.output[instance.name] = instance.run(item)
    }
  }
  return item
}

export default {
  config,
  plugins,
  timers,
  start,
  end,
}
