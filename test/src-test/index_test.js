'use strict';

const grunt = require('grunt');
const path = require('path');
const assert = require('assert');

const emptyHooks = path.join(__dirname, '..', 'js', 'fixtures', 'Gruntfile-empty-hooks.js');
const beforeAfter = path.join(__dirname, '..', 'js', 'fixtures', 'Gruntfile-before-after.js');
const taskInformation = path.join(__dirname, '..', 'js', 'fixtures', 'Gruntfile-task-information.js');
const multiTask = path.join(__dirname, '..', 'js', 'fixtures', 'Gruntfile-multi-task.js');

describe('grunt-before-after-hooks', () => {
  it('should run tasks when given empty hooks', (done) => {
    grunt.util.spawn({
      cmd: 'grunt',
      args: ['--gruntfile', emptyHooks, 'plugin_tester']
    }, (error, result) => {
      assert(result.stdout.includes('Plugin is printing'));
      done();
    });
  });

  it('should run hooks before and after', (done) => {
    grunt.util.spawn({
      cmd: 'grunt',
      args: ['--gruntfile', beforeAfter, 'plugin_tester']
    }, (error, result) => {
      const before = result.stdout.indexOf('before!');
      const during = result.stdout.indexOf('Plugin is printing');
      const after = result.stdout.indexOf('after!');

      assert(before >= 0 && during >= 0 && after >= 0);
      assert(before < during < after);

      done();
    });
  });

  it('should print task information before', (done) => {
    grunt.util.spawn({
      cmd: 'grunt',
      args: ['--gruntfile', taskInformation, 'plugin_tester']
    }, (error, result) => {
      const first = result.stdout.indexOf('"nameArgs":"plugin_tester"');
      const during = result.stdout.indexOf('Plugin is printing');

      assert(first >= 0);
      assert(first < during);
      done();
    });
  });

  it('should print multi task information', (done) => {
    grunt.util.spawn({
      cmd: 'grunt',
      args: ['--gruntfile', multiTask, 'multi']
    }, (error, result) => {
      const first = result.stdout.indexOf('"nameArgs":"plugin_tester"');
      const during = result.stdout.indexOf('Plugin is printing');
      const second = result.stdout.indexOf('"nameArgs":"plugin_tester2"', first + 1);
      const during2 = result.stdout.indexOf('Plugin tester 2 is printing');

      assert(first >= 0 && second >= 0);
      assert(first < during < second < during2);
      done();
    });
  });
});
