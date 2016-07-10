'use strict';

const hooker = require('hooker');

module.exports = function(grunt, options) {
  const before = options.before || function() {};

  const after = options.after || function() {};

  if (typeof(before) !== 'function') {
    throw new Error('The before hook must be a function');
  }

  if (typeof(after) !== 'function') {
    throw new Error('The after hook must be a function');
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

  hooker.hook(grunt.log, 'header', () => {
    before(grunt.task.current);
  });

  process.on('SIGINT', () => {
    process.exit();
  });

  process.once('wraphookgruntexit', (exitCode) => {
    clearInterval(interval);
    after();
    process.exit = originalExit;
    hooker.unhook(grunt.log, 'header');

    process.exit(exitCode);
  });

};
