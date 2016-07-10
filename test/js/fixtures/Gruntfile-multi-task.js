const path = require('path');
const write = process.stdout.write.bind(process.stdout);

function log(str) {
  write(str + '\n', 'utf8');
}

module.exports = function(grunt) {

  require('../../..')(grunt, {
    before(args) {
      log(JSON.stringify(args));
    },
    after(args) {
      log(JSON.stringify(args));
    }
  });

  grunt.initConfig({});

  grunt.registerTask('multi', ['plugin_tester', 'plugin_tester2']);

  grunt.registerTask('plugin_tester', () => {
    grunt.log.writeln('Plugin is printing');
  });

  grunt.registerTask('plugin_tester2', () => {
    grunt.log.writeln('Plugin tester 2 is printing');
  });
};
