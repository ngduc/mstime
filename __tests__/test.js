/* eslint-disable no-unused-vars */
import mstime from '../src'

describe('mstime', () => {
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
    expect(mstime.map.block2.start.length).toBe(LOOPS)
    expect(mstime.map.block2.end.length).toBe(LOOPS)
    expect(mstime.map.block2.sum).toBeGreaterThan(0)
    expect(mstime.map.block2.average).toBeGreaterThan(0)
  })

  it('update config with mstime.config', () => {
    let decialPointIdx = -1
    mstime.start('block3')
    dummyLoop()
    mstime.end('block3')
    decialPointIdx = mstime.map.block3.last.toString().indexOf('.')
    expect(decialPointIdx).toBeGreaterThan(0)
    // update config to have zero decimal digits
    mstime.config({ decimalDigits: 0 })
    mstime.start('block3')
    mstime.end('block3')
    decialPointIdx = mstime.map.block3.last.toString().indexOf('.')
    expect(decialPointIdx).toBe(-1)
  })
})
