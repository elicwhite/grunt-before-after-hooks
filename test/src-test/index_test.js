'use strict';

const grunt = require('grunt');
const path = require('path');
const assert = require('assert');

const emptyHooks = path.join(__dirname, '..', 'js', 'fixtures', 'Gruntfile-empty-hooks.js');
const beforeAfter = path.join(__dirname, '..', 'js', 'fixtures', 'Gruntfile-before-after.js');
const taskInformation = path.join(__dirname, '..', 'js', 'fixtures', 'Gruntfile-task-information.js');
const multiTask = path.join(__dirname, '..', 'js', 'fixtures', 'Gruntfile-multi-task.js');
const afterEach = path.join(__dirname, '..', 'js', 'fixtures', 'Gruntfile-after-each.js');
const afterAfterEach = path.join(__dirname, '..', 'js', 'fixtures', 'Gruntfile-after-after-each.js');

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

  it('should run hooks before each and after', (done) => {
    grunt.util.spawn({
      cmd: 'grunt',
      args: ['--gruntfile', beforeAfter, 'plugin_tester']
    }, (error, result) => {
      const beforeEach = result.stdout.indexOf('beforeEach!');
      const during = result.stdout.indexOf('Plugin is printing');
      const after = result.stdout.indexOf('after!');

      assert(beforeEach >= 0 && during >= 0 && after >= 0);
      assert(beforeEach < during < after);

      done();
    });
  });

  it('should print task information before each', (done) => {
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

  it('should print multi task beforeEach information', (done) => {
    grunt.util.spawn({
      cmd: 'grunt',
      args: ['--gruntfile', multiTask, 'multi']
    }, (error, result) => {
      const first = result.stdout.indexOf('"nameArgs":"plugin_tester"');
      const during = result.stdout.indexOf('Plugin is printing');
      const second = result.stdout.indexOf('"nameArgs":"plugin_tester2"', first + 1);
      const during2 = result.stdout.indexOf('Plugin tester 2 is printing');
      const after = result.stdout.indexOf('after!');

      assert(first >= 0 && second >= 0);
      assert(first < during < second < during2 < after);
      done();
    });
  });

  it('should call afterEach hooks with information', (done) => {
    grunt.util.spawn({
      cmd: 'grunt',
      args: ['--gruntfile', afterEach, 'multi']
    }, (error, result) => {
      const during = result.stdout.indexOf('Plugin is printing');
      const first = result.stdout.indexOf('"nameArgs":"plugin_tester"');
      const during2 = result.stdout.indexOf('Plugin tester 2 is printing');
      const second = result.stdout.indexOf('"nameArgs":"plugin_tester2"', first + 1);

      assert(during >= 0 && first >= 0);
      assert(during < first < during2 < second);
      done();
    });
  });

  it('should call afterEach before after', (done) => {
    grunt.util.spawn({
      cmd: 'grunt',
      args: ['--gruntfile', afterAfterEach, 'plugin_tester']
    }, (error, result) => {
      const afterEach = result.stdout.indexOf('afterEach!');
      const after = result.stdout.indexOf('after!');

      assert(afterEach >= 0 && afterEach < after);
      done();
    });
  });

  it('should print nothing when grunt is run with -q', (done) => {
    grunt.util.spawn({
      cmd: 'grunt',
      args: ['--gruntfile', beforeAfter, 'plugin_tester', '-q']
    }, (error, result) => {
      assert(result.stdout.indexOf('beforeEach!') === -1);
      assert(result.stdout.indexOf('after!') === -1);
      done();
    });
  });

  it('should print nothing when grunt is run with --quiet', (done) => {
    grunt.util.spawn({
      cmd: 'grunt',
      args: ['--gruntfile', beforeAfter, 'plugin_tester', '--quiet']
    }, (error, result) => {
      assert(result.stdout.indexOf('beforeEach!') === -1);
      assert(result.stdout.indexOf('after!') === -1);
      done();
    });
  });
});
