var fs         = require('fs');
var _          = require('lodash');
var colors     = require('colors');
var browserify = require('browserify');
var watchify   = require('watchify');

module.exports = function(options) {
  // config
  var files = options.files;
  var outputName = (options.outputFile || '_site-compiled.js');
  var basedir = __dirname + '/../public/js/';
  var outputFile = basedir + outputName;
  var development = options.development;
  var verbose = options.verbose || true;
  var notifications = options.notifications;

  var browserifyOptions = {
    cache: {},
    packageCache: {},
    'opts.basedir': basedir,
    // if we are in development mode we want fullPaths to enable sourceMaps
    fullPaths: development,
    // enable sourceMaps in development
    debug: development
  };
  browserifyOptions = _.merge(browserifyOptions, options.browserifyOptions || {});


  // Compile
  var b = browserify(browserifyOptions);

  if(development) {
      // enable source maps in watchify mode
      b = watchify(b, { 'opts.basedir': basedir });
  }

  // add the files
  files.forEach( function(file) {
    b.add(file);
  });

  // if(es2015){
  //   // if called for, compile es2015 with babel
  //   b.transform(babelify, { presets: ['es2015'] });
  // }

  // create the bundled file
  function bundleAssets(cb) {
    b.bundle( function(err, output) {
      if(err) {
        console.error('There was an issue running browserify! No new output file was created.'.red.bold);
        console.error('Error: '.red + err.message);

        // crash the server, but only in production mode.
        if(!development) {
          return callback(err);
        }

        if(development && notifications) {
          notifier.notify({
            title: 'Browserify Build Failed',
            message: err.message
          });
        }

        return cb(err);
      }

      // write our new file to the public/js folder
      fs.writeFile(outputFile, output, function (err) {
        if(err) {
          console.error('There was an error while writing the freshly-bundled front end code in apostrophe-browserify.');
          console.error(err.message);
        }
        return cb(err);
      });
    });
  };

  // if we're in development mode we want to bind watchify's 'update' event
  if(development) {
    b.on('update', function(ids) {
      if(verbose) {
        process.stdout.write('Detected a change in frontend assets. Bundling... ');
      }
      bundleAssets(function(err) {
        if(verbose && !err) {
          console.error('Finished bundling.'.green.bold + ' ' + Date().gray);
        }
        return;
      });
    });
    if (verbose) {
      console.error('Watchify is running.'.yellow.bold);
    }
  }

  // run bundle on startup.
  bundleAssets( function(err) {
    if (verbose && !err) {
      console.error('Ran initial Browserify asset bundling.'.green.bold);
    }
  });
};
