'use strict';

const argv = process.argv.slice(2);
const hooker = require('hooker');

const write = process.stdout.write.bind(process.stdout);

function log(str) {
  write(str + '\n', 'utf8');
}

module.exports = function(grunt, options) {
  const before = options.before || () => {};
  const after = options.after || () => {};

  if (typeof(before) !== 'function') {
    throw new Error('The before hook must be a function');
  }

  if (typeof(after) !== 'function') {
    throw new Error('The after hook must be a function');
  }

  let prevTask;

  // crazy hack to work around stupid node-exit
  // Can this be removed now that node-exit#4 has been resolved?
  // https://github.com/cowboy/node-exit/issues/4
  var originalExit = process.exit;

  var interval;

  var exit = function (exitCode) {
    clearInterval(interval);
    process.emit('wraphookgruntexit', exitCode);
    exit = function () {};
  };

  interval = setInterval(function () {
    process.exit = exit;
  }, 100);

  process.exit = exit;

  hooker.hook(grunt.log, 'header', function () {
    prevTask = grunt.task.current;
    before(grunt.task.current);
  });

  process.on('SIGINT', function () {
    process.exit();
  });

  process.once('wraphookgruntexit', function (exitCode) {
    clearInterval(interval);
    after();
    process.exit = originalExit;
    hooker.unhook(grunt.log, 'header');

    process.exit(exitCode);
  });

};
