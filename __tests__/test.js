/* eslint-disable no-unused-vars */
import mstime from '../src'

describe('mstime', () => {
  // helper
  const dummyLoop = () => {
    let j = 0
    for (let i = 0; i < 999999; i += 1) {
      j += 1
    }
  }

  it('measure time', () => {
    mstime.start('block1')
    dummyLoop()
    const item = mstime.end('block1')
    expect(item.start).not.toBeNull()
    expect(Array.isArray(item.start)).toBeTruthy()
    expect(item.end).not.toBeNull()
    expect(Array.isArray(item.end)).toBeTruthy()
  })

  it('measure time multiple times', () => {
    const LOOPS = 3
    for (let i = 0; i < LOOPS; i += 1) {
      mstime.start('block2')
      dummyLoop()
      const item = mstime.end('block2')
    }
    expect(mstime.timers.block2.start.length).toBe(LOOPS)
    expect(mstime.timers.block2.end.length).toBe(LOOPS)
    expect(mstime.timers.block2.sum).toBeGreaterThan(0)
    expect(mstime.timers.block2.avg).toBeGreaterThan(0)
  })

  it('get config object', () => {
    mstime.config({ decimalDigits: 5 })
    const config = mstime.config()
    expect(config.decimalDigits).toBe(5)
  })

  it('update config with mstime.config', () => {
    let decialPointIdx = -1
    mstime.start('block3')
    dummyLoop()
    mstime.end('block3')
    decialPointIdx = mstime.timers.block3.last.toString().indexOf('.')
    expect(decialPointIdx).toBeGreaterThan(0)
    // update config to have zero decimal digits
    mstime.config({ decimalDigits: 0 })
    mstime.start('block3')
    mstime.end('block3')
    decialPointIdx = mstime.timers.block3.last.toString().indexOf('.')
    expect(decialPointIdx).toBe(-1)
  })

  it('attach data object', () => {
    mstime.start('block4', { moreData: 123 })
    dummyLoop()
    mstime.end('block4')
    expect(mstime.timers.block4.data.moreData).toBe(123)
  })
})
