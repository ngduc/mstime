const present = require('present')

let allConfig = {
  decimalDigits: 2,
}
const config = (updateConfig) => {
  allConfig = { ...allConfig, ...updateConfig }
}

const map = {} // map of timers, ex: { code1: { start: [t1], end: [t2], diff: [t2-t1], average } }

const format = floatNum => parseFloat(floatNum.toFixed(allConfig.decimalDigits))

const start = (key) => {
  map[key] = map[key] || {
    start: [],
    end: [],
    // diff: [], // initialize these later to save cpu cycles.
    // sum: 0,
    // average: 0,
  }
  map[key].start.push(format(present()))
  return map[key]
}

const end = (key) => {
  map[key].end.push(format(present()))
  const item = map[key]
  item.diff = item.diff || []
  item.last = format(item.end[item.end.length - 1] - item.start[item.start.length - 1])
  item.diff.push(item.last)
  item.sum = format(item.diff.reduce((a, b) => a + b))
  item.average = format(item.sum / item.diff.length)
  return item
}

export default {
  config,
  map,
  start,
  end,
}
