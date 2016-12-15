var express = require('express'),
    http = require('http'),
    app = express(),
    opts = require(__dirname + '/config/opts.js');

// Load express configuration
require(__dirname + '/config/env.js')(express, app);

// Browserify config
require(__dirname + '/config/browserify.js')({
  files: ['./public/js/_site.js'],
  outputFile: '_site-compiled.js',
  development: true
});

// Load routes
require(__dirname + '/routes')(app);

// Start the server
http.createServer(app).listen(process.env.PORT || opts.port, function () {
    console.log("~ server listening on port %d in %s mode",
                opts.port, app.settings.env);
});
