
var path = require('path');
var exec = require('child_process').exec;
var resolve = require('bunyan').resolveLevel;
var assert = require('better-assert');

var file = path.join(__dirname, '../../examples', 'single-stream.js');

process.env.BUNYAN_ENABLED = '*stream';
process.env.BUNYAN_LEVEL = 'warn';

exec('node ' + file, function (err, stdout) {
  if (err) throw err;
  var logs = stdout
    .split('\n')
    .filter(Boolean)
    .map(JSON.parse);

  assert(3 == logs.length);
  assert(!hasLevel('trace'));
  assert(!hasLevel('debug'));
  assert(!hasLevel('info'));
  assert(hasLevel('warn'));
  assert(hasLevel('error'));
  assert(hasLevel('fatal'));

  function hasLevel(level) {
    level = resolve(level);
    return logs.some(function (log) {
      return level == log.level;
    });
  }
});
