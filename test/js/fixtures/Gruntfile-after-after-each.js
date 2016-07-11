'use strict';

const write = process.stdout.write.bind(process.stdout);

function log(str) {
  write(str + '\n', 'utf8');
}

module.exports = function(grunt) {

  require('../../../src/index')(grunt, {
    afterEach() {
      log('afterEach!');
    },

    after() {
      log('after!');
    }
  });

  grunt.initConfig({});

  grunt.registerTask('plugin_tester', () => {
    grunt.log.writeln('Plugin is printing');
  });
};
