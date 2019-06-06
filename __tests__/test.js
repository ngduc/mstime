/* eslint-disable no-unused-vars */
import mstime from '../src';
import msPluginTrimMean from '../src/plugins/msPluginTrimMean';
import msPluginChartist from '../src/plugins/msPluginChartist';

window.TEST_ENV = true;

describe('mstime', () => {
  // helper
  const dummyLoop = () => {
    let j = 0;
    for (let i = 0; i < 9999999; i += 1) {
      j += 1;
    }
  };

  it('measures time', () => {
    mstime.start('block1');
    dummyLoop();
    const item = mstime.end('block1');
    const entry = item.entries[item.entries.length - 1];
    expect(Array.isArray(item.entries)).toBeTruthy();
    expect(entry.start).not.toBeNull();
    expect(entry.end).not.toBeNull();
    expect(entry.diff).not.toBeNull();
  });

  it('measures time multiple times', () => {
    const LOOPS = 3;
    for (let i = 0; i < LOOPS; i += 1) {
      mstime.start('block2');
      dummyLoop();
      const item = mstime.end('block2');
    }
    expect(mstime.timers.block2.entries.length).toBe(LOOPS);
    expect(mstime.timers.block2.entries.length).toBe(LOOPS);
    expect(mstime.timers.block2.sum).toBeGreaterThan(0);
    expect(mstime.timers.block2.avg).toBeGreaterThan(0);
  });

  it('clears a timer', () => {
    mstime.start('clearTest');
    dummyLoop();
    mstime.end('clearTest');
    expect(mstime.timers.clearTest.sum).toBeGreaterThan(0);
    mstime.clear('clearTest');
    expect(mstime.timers.clearTest).toBeUndefined();
  });

  it('gets config object', () => {
    mstime.config({ decimalDigits: 5 });
    const config = mstime.config();
    expect(config.decimalDigits).toBe(5);
  });

  it('updates config with mstime.config', () => {
    let decialPointIdx = -1;
    mstime.start('block3');
    dummyLoop();
    mstime.end('block3');
    decialPointIdx = mstime.timers.block3.last.toString().indexOf('.');
    expect(decialPointIdx).toBeGreaterThan(0);
    // update config to have zero decimal digits
    mstime.config({ decimalDigits: 0, consoleTime: true });
    mstime.start('block3');
    mstime.end('block3');
    decialPointIdx = mstime.timers.block3.last.toString().indexOf('.'); // find decimal point
    expect(decialPointIdx).toBe(-1); // it should not exist (because decimalDigits = 0)
  });

  it('attachs data object', () => {
    mstime.start('block4', { moreData: 123 });
    dummyLoop();
    const item = mstime.end('block4');
    const entry = item.entries[item.entries.length - 1];
    expect(entry.data.moreData).toBe(123);
  });

  it('sets plugins & plugins get instantiated with configs', () => {
    let pluginInit1 = 0;
    let pluginInit2 = 0;
    const dummyPlugin1 = ({ config }) => {
      pluginInit1 = config.param;
    };
    const dummyPlugin2 = ({ config }) => {
      pluginInit2 = config.param;
    };
    mstime.plugins([
      { plugin: dummyPlugin1, config: { param: 100 } },
      { plugin: dummyPlugin2, config: { param: 200 } }
    ]);
    expect(mstime.plugins().length).toBe(2);
    expect(pluginInit1).toBe(100);
    expect(pluginInit2).toBe(200);
  });

  it('has plugin to process timers & set to output', () => {
    const pluginInit1 = 0;
    const dummyPlugin1 = ({ config }) => ({
      name: 'msplugin-dummy',
      run: (allData, timerData) => {
        const output = 'do something useful here...';
        return {
          createdAt: new Date().getTime(),
          output,
          totalEntries: timerData.entries.length
        };
      }
    });
    mstime.plugins([{ plugin: dummyPlugin1, config: { param: 100 } }]);
    mstime.start('block5');
    dummyLoop();
    mstime.end('block5');
    expect(mstime.timers.block5.plugins['msplugin-dummy'].totalEntries).toBe(1);
    // also test mstime.runPlugins
    mstime.runPlugins('block5');
  });

  it('msPluginTrimMean should work & return a mean value', () => {
    mstime.plugins([{ plugin: msPluginTrimMean, config: { percent: 0.1 } }]);
    const LOOPS = 10;
    for (let i = 0; i < LOOPS; i += 1) {
      mstime.start('block50');
      dummyLoop();
      const item = mstime.end('block50');
    }
    expect(mstime.timers.block50.plugins['msplugin-trim-mean']).not.toBeNull();
    expect(mstime.timers.block50.plugins['msplugin-trim-mean'].percent).toBe(0.1);
    expect(mstime.timers.block50.plugins['msplugin-trim-mean'].mean).toBeGreaterThan(0);
  });

  it('msPluginTrimMean default config', () => {
    mstime.plugins([{ plugin: msPluginTrimMean }]);
    mstime.start('block55');
    dummyLoop();
    const item = mstime.end('block55');
    expect(mstime.timers.block55.plugins['msplugin-trim-mean'].percent).toBe(0.2); // default 20%
  });

  it('msPluginChartist default config', () => {
    window.Chartist = { Line: () => {} }; // mock Chartist
    mstime.plugins([{ plugin: msPluginChartist }]);
    mstime.start('block60');
    dummyLoop();
    const item = mstime.end('block60');
    expect(mstime.timers.block60.plugins['msplugin-chartist'].idAttr).toBe('data-mstime-id'); // default
  });

  it('msPluginChartist set config', () => {
    window.Chartist = { Line: () => {} }; // mock Chartist
    mstime.plugins([{ plugin: msPluginChartist, config: { idAttr: 'data-chart-id' } }]);
    mstime.start('block61');
    dummyLoop();
    const item = mstime.end('block61');
    expect(mstime.timers.block61.plugins['msplugin-chartist'].idAttr).toBe('data-chart-id');
  });
});
