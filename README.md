# grunt-before-after-hooks [![Build Status](https://travis-ci.org/TheSavior/grunt-before-after-hooks.svg?branch=master)](https://travis-ci.org/TheSavior/grunt-before-after-hooks)

> Add hooks to run before every Grunt task and after they are all complete

## Install

```
$ npm install --save grunt-before-after-hooks
```


## Usage

```js
module.exports = grunt => {
  // require it at the top and pass in the grunt instance
  require('grunt-before-after-hooks')(grunt, {
    beforeEach(currentTask) {
      console.log(JSON.stringify(currentTask));
      /*
      {"nameArgs":"plugin_tester","name":"plugin_tester","args":[],"flags":{},"errorCount":0}
      */
    },
    afterEach(previousTask) {
      console.log(JSON.stringify(currentTask));
      /*
      {"nameArgs":"plugin_tester","name":"plugin_tester","args":[],"flags":{},"errorCount":0}
      */
    },
    after() {

    }
  });

  grunt.initConfig();
}
```

The argument given to the `beforeEach` and `afterEach` hooks are instances of [`grunt.task.current`](http://gruntjs.com/api/inside-tasks#this.name).
