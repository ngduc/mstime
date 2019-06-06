## [0.6.9] - 2019-06-05

### Added
- add mstime.runPlugins(timerName) to invoke plugins on a timer.

## [0.6.4] - 2018-10-21

### Added
- getTimers(), setTimers(): get/set all timer data.
### Changed
- fix: umd bundle doesn't include present.js & utils.js.

## [0.6.0] - 2018-10-04

### Added
- add mstimePluginChartist - plot data using Chartist.
- mstime.clear() will invoke plugin.clear()
### Changed
- BREAKING: rename "mstime-plugin-" prefixes to "msplugin-"
- BREAKING: move plugins to "src/plugins", exclude them from the main build.

## [0.3.3] - 2018-10-03

### Added
- use mstimePluginTrimMean for calculating trimmed mean (similar to Excel's TRIMMEAN).
### Changed
- BREAKING: refactor plugin run function's arguments.
- BREAKING: refactor plugin output to "plugin" property.
