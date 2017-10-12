# mstime

[![NPM version](https://img.shields.io/npm/v/mstime.svg?style=flat-square)](https://npmjs.org/package/mstime)
[![Build Status](https://img.shields.io/travis/ngduc/mstime/master.svg?style=flat-square)](https://travis-ci.org/ngduc/mstime) [![Coverage Status](https://img.shields.io/codecov/c/github/ngduc/mstime/master.svg?style=flat-square)](https://codecov.io/gh/ngduc/mstime/branch/master)
[![NPM](https://img.shields.io/npm/dt/mstime.svg?style=flat-square)](https://www.npmjs.com/package/mstime)

a module to measure code performance in time (ms)

## Install

    $ npm install --save mstime

## Usage

```js
import mstime from 'mstime'

mstime.start('codeblock1')
for (let i = 0; i < 999999; i += 1) {
  console.log('log')
}
const result = mstime.end('codeblock1')
```

`result` is a JSON object: (all values are in milliseconds)

    {
      start: [ 41991120.53 ],
      end: [ 41991133.04 ],
      diff: [ 12.50 ],
      last: 12.50,
      sum: 12.50,
      avg: 12.50
    }

Available builds (dist): CommonJS, ES, UMD.

## Example

https://runkit.com/ngduc/mstime

## Dependencies

`mstime` use `present` to get time (in ms)
<https://github.com/dbkaplun/present>

## License

MIT © [Duc Nguyen](https://github.com/ngduc)
