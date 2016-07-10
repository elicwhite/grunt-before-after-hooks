const path = require('path');

module.exports = function(grunt) {

  require('../../..')(grunt, {
    before() {},
    after() {}
  });

  grunt.initConfig({});

  grunt.registerTask('plugin_tester', () => {
    grunt.log.writeln('Plugin is printing');
  });
};
