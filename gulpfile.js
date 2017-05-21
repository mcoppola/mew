// Imports
var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var watch = require('gulp-watch');


var sassWatch = [ 
	'./css/*.scss', 
	'./css/*/*.scss', 
];


// STYLES ======================================================

// compile
gulp.task('sass', function(done) {
	gulp.src('./css/style.scss')
		.pipe(sass())
		.pipe(gulp.dest('./static/css'))
		.on('end', done);
});

// watch
gulp.task('watch-sass', function() {
	return watch(sassWatch, function(){
		gulp.run('sass');
	});
});

// Development task
gulp.task('dev-sass', ['sass','watch-sass']);
// Build task
gulp.task('build-sass', ['sass']);




// Main

gulp.task('dev', ['dev-sass']);