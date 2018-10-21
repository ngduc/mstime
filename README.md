# mstime

[![NPM version](https://img.shields.io/npm/v/mstime.svg?style=flat-square)](https://npmjs.org/package/mstime)
[![Build Status](https://img.shields.io/travis/ngduc/mstime/master.svg?style=flat-square)](https://travis-ci.org/ngduc/mstime) [![Coverage Status](https://img.shields.io/codecov/c/github/ngduc/mstime/master.svg?style=flat-square)](https://codecov.io/gh/ngduc/mstime/branch/master)
[![NPM](https://img.shields.io/npm/dt/mstime.svg?style=flat-square)](https://www.npmjs.com/package/mstime)

a lightweight module (2KB gzip) to measure & visualize code performance in millisecond (ms), run on Node & browser. No dependencies!

_mstime_ uses [performance.now Web API](https://developers.google.com/web/updates/2012/08/When-milliseconds-are-not-enough-performance-now) (high resolution timer) to measure the difference between start & end points.

_mstime_ has an easy **Plugin System** which lets you write simple (yet powerful) plugins to process/visualize data in different ways.

## Example / Demo

* Example in Node: https://runkit.com/ngduc/mstime
* Example in Browser: https://rawgit.com/ngduc/mstime/master/docs/demo/index.html
* Example in Codesandbox: https://codesandbox.io/s/jlnp3owm2y

[![Demo Screenshot](/docs/screenshot-01.png)](https://rawgit.com/ngduc/mstime/master/docs/demo/index.html)

## Install

    $ npm install --save mstime

## Usage

```js
import mstime from "mstime";

mstime.start("codeblock1");
processData(); // your function
const result = mstime.end("codeblock1");
```

`result` is a JSON object: (all values are in milliseconds)

```
{
  entries: [
    { start: 41991120.53, end: 41991133.04, diff: 12.50 }
  ]
  last: 12.50,
  sum: 12.50,
  avg: 12.50
}
```

Available builds (dist): CommonJS, ES, UMD.

## Config

```js
mstime.config({
  decimalDigits: 4, // default: 2
  consoleTime: true // use console.time & console.timeEnd, default: false
});
```

## Plugins

Plugins offer more useful abilities on the captured data.

A plugin is just a function that processes data and returns this structure:

```js
const pluginExample = ({ config }) => ({
  name: "msplugin-example",
  run: (allData, timerData) => {
    const output = "do something useful here with allData & timerData...";
    return {
      // property & value can be anything
    };
  }
});
```

`run` function will get called on `mstime.end` and its result will be put in "timerData.plugins"

### List of Plugins:
```
- msplugin-use-local-storage   use localStorage to store timer data. 
- msplugin-trim-mean           calculate for trimmed mean.
- msplugin-chartist            plot data using Chartist.

- msplugin-find-outliers       (In Progress: find outliers)
- msplugin-save-to-db          (In Progress: save timer data to DB)
- (create your plugin & add it here...)
```

## Documentation

- [Change Log](/CHANGELOG.md)

## License

MIT © [Duc Nguyen](https://github.com/ngduc)
