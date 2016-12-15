var util = require(__dirname + '/../libs/util.js'),
    path = require('path'),
    nunjucks = require('nunjucks');

module.exports = function (express, app) {

    // nunjucks
    app.set('view engine', 'html');

    nunjucks.configure('views', {
        autoescape: true,
        express: app
    });

    // Make sure build folders exist
    app.use(require('less-middleware')(path.join(__dirname, '../public')));
    app.use(express.static(path.join(__dirname, '../public')));

};