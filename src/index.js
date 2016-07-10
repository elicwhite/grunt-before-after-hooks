'use strict';

const hooker = require('hooker');
const argv = process.argv.slice(2);

module.exports = function(grunt, options) {
  const beforeEach = options.beforeEach || function() {};

  const afterEach = options.afterEach || function() {};

  const after = options.after || function() {};

  if (typeof(beforeEach) !== 'function') {
    throw new Error('The beforeEach hook must be a function');
  }

  if (typeof(afterEach) !== 'function') {
    throw new Error('The afterEach hook must be a function');
  }

  if (typeof(after) !== 'function') {
    throw new Error('The after hook must be a function');
  }

  if (argv.indexOf('--help') !== -1 ||
    argv.indexOf('-h') !== -1 ||
    // for `quiet-grunt`
    argv.indexOf('--quiet') !== -1 ||
    argv.indexOf('-q') !== -1 ||
    argv.indexOf('--version') !== -1 ||
    argv.indexOf('-V') !== -1) {
    return;
  }

  // crazy hack to work around stupid node-exit
  // Can this be removed now that node-exit#4 has been resolved?
  // https://github.com/cowboy/node-exit/issues/4
  const originalExit = process.exit;

  const interval = setInterval(intervalFunc, 100);

  let exited = false;

  function exit(exitCode) {
    if (exited) {
      return;
    }

    clearInterval(interval);
    process.emit('wraphookgruntexit', exitCode);
    exited = true;
  }

  function intervalFunc() {
    process.exit = exit;
  }

  process.exit = exit;

  let prevTask;

  hooker.hook(grunt.log, 'header', () => {
    if (prevTask) {
      afterEach(prevTask);
    }

    beforeEach(grunt.task.current);

    prevTask = grunt.task.current;
  });

  process.on('SIGINT', () => {
    process.exit();
  });

  process.once('wraphookgruntexit', (exitCode) => {
    clearInterval(interval);

    if (prevTask) {
      afterEach(prevTask);
    }

    after();
    process.exit = originalExit;
    hooker.unhook(grunt.log, 'header');

    process.exit(exitCode);
  });

};
