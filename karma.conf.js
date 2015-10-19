// Karma configuration
// Generated on Sun Sep 27 2015 17:07:09 GMT-0400 (Eastern Daylight Time)

module.exports = function(config) {
  config.set({

// base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

// testing framework to use (jasmine/mocha/qunit/...)
    frameworks: [ 'jasmine', 'browserify'],

// list of files / patterns to load in the browser
    files: [
      'http://maps.googleapis.com/maps/api/js?sensor=false&language=en',
      'www/lib/jquery/dist/*.js',
      'www/lib/ionic/js/ionic.bundle.js',
      'www/lib/ngmap/build/scripts/ng-map.js',
      'www/lib/angular-mocks/angular-mocks.js',
      'www/lib/ngCordova/dist/*.js',
      'www/js/modules.js',
      'www/js/user.js',
      'www/js/authService.js',
      'www/js/locationService.js',
      'www/js/mapService.js',
      'www/js/app.js',
      'www/js/*.js',
      'www/templates/*.html',
      'www/*.html',
      'tests/*.js'
    ],

// list of files / patterns to exclude
    exclude: [
    ],

// preprocess matching files before serving them to the browser
// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '**/*.html': ['ng-html2js'],
      'www/**/*.js': ['browserify']
    },

    browserify: {
      debug: true,
      transform: [ 'brfs' ]
    },
    ngHtml2JsPreprocessor: {
      // strip this from the file path
      stripPrefix: 'src/',
      // prepend this to the


      // setting this option will create only a single module that contains templates
      // from all the files, so you can load them all with module('foo')
      moduleName: 'templatesForTest'
    },

// test results reporter to use
// possible values: 'dots', 'progress', 'spec'
// available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


// web server port
    port: 9876,


// enable / disable colors in the output (reporters and logs)
    colors: true,


// level of logging
// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


// enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


// start these browsers
// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'PhantomJS'],


// Continuous Integration mode
// if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
