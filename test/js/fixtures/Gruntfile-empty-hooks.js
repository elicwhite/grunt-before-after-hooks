'use strict';

module.exports = function(grunt) {

  require('../../../src/index')(grunt, {
    beforeEach() {},

    after() {}
  });

  grunt.initConfig({});

  grunt.registerTask('plugin_tester', () => {
    grunt.log.writeln('Plugin is printing');
  });
};
