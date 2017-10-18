const present = require('./present')
const {
  config, plugins, format, sumArray,
} = require('./utils')

/**
 * Map of timers.
 * @example { code1: { start: [t1], end: [t2], diff: [t2-t1], last, sum, avg } }
 */
let timers = {}

/**
 * Start a timer to measure code performance.
 * The same timer can be started and ended multiple times.
 * @param {string} name - Name of a new or existing timer.
 * @param {Object} options - (optional) More options (data, etc.).
 * @returns {Object} - Timer object.
 */
const start = (name, options = {}) => {
  if (config().consoleTime) {
    console.time(name)
  }
  const startTime = present()
  timers[name] = timers[name] || {
    entries: [],
    // last: 0, // calculate for these later. (on end())
    // sum: 0,
    // avg: 0,
  }
  const entry = {
    start: format(startTime),
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
  if (config().consoleTime) {
    console.timeEnd(name)
  }
  const endTime = present()
  const item = timers[name]
  item.output = {}

  const { entries } = item
  const lastEntry = entries[entries.length - 1]
  lastEntry.end = format(endTime)
  lastEntry.diff = format(lastEntry.end - lastEntry.start)

  // calculate for more useful values
  item.last = lastEntry.diff

  const diffArr = entries.map(e => e.diff)
  item.sum = format(sumArray(diffArr))
  item.avg = format(item.sum / entries.length)

  // run every Plugin & keep their outputs in "output {}"
  const allPlugins = plugins()
  for (let i = 0; i < allPlugins.length; i += 1) {
    const pluginObject = allPlugins[i]
    const { plugin } = pluginObject
    if (plugin && plugin.run) {
      item.output[plugin.name] = plugin.run(item)
    }
  }
  return item
}

/**
 * Clear a timer.
 * @param {string} name - Timer name to clear.
 */
const clear = (name) => {
  delete timers[name]
}

// default plugin
const mstimePluginUseLocalStorage = () => {
  const mstimeTimersObj = JSON.parse(global.localStorage.getItem('mstime.timers'))
  if (mstimeTimersObj) {
    timers = mstimeTimersObj
  }
  return {
    name: 'mstime-plugin-use-local-storage',
    run: (timerData) => {
      global.localStorage.setItem('mstime.timers', JSON.stringify(timers))
      const lsData = global.localStorage.getItem('mstime.timers')
      return {
        createdAt: new Date().getTime(),
        totalEntries: timerData.entries.length,
        size: lsData.length,
      }
    },
  }
}

export default {
  config,
  plugins,
  timers,
  start,
  end,
  clear,
  mstimePluginUseLocalStorage,
}
