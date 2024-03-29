var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var sass = require('gulp-sass');
var inject = require('gulp-inject');
var cache = require('gulp-cache');
var del = require('del');
var cleanCache = require('gulp-cached');
var runSequence = require('run-sequence');

gulp.task('clean', function() {
	cleanCache.caches = {};
	del.sync('./build');
});

gulp.task('images', function(){
	gulp.src('./images/**/*')
		.pipe(cache(imagemin()))
    .pipe(gulp.dest('build/images'))
});

gulp.task('fonts', function() {
  gulp.src('./fonts/**/*')
  .pipe(gulp.dest('build/fonts'));
});

gulp.task('sounds', function() {
  gulp.src('./sounds/**/*')
  .pipe(gulp.dest('build/sounds'));
});

gulp.task('vendor-scripts', function() {
	gulp.src(['./node_modules/tone/Build/Tone.js', './node_modules/jquery/dist/jquery.js', './node_modules/pixi.js/bin/pixi.js', './node_modules/async/dist/async.js'])
		.pipe(concat('libraries.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./build/scripts'));
});

gulp.task('scripts', function() {
	gulp.src(['./scripts/index.js'])
	.pipe(concat('main.js'))
	// .pipe(uglify())
	.pipe(gulp.dest('./build/scripts'));
});

gulp.task('styles', function(){
	gulp.src(['./scss/**/*.scss'])
	.pipe(sass())
  .pipe(autoprefixer({ browsers: ['last 3 versions'] }))
  .pipe(cleanCSS({compatibility: 'ie8'}))
  .pipe(gulp.dest('build/styles/'))
});

gulp.task('html', function() {
	gulp.src('./index.html')
	.pipe(gulp.dest('build'))
});

gulp.task('inject', ['html', 'scripts', 'vendor-scripts', 'styles'], function() {
	var target = gulp.src('./build/index.html');
	var sources = gulp.src(['./**/*.js', './**/*.css'], {read: false, cwd: __dirname + '/build/'});

	return target.pipe(inject(sources, {addRootSlash: false}))
    .pipe(gulp.dest('./build'));
});

gulp.task('watch', function() {
	gulp.watch("./scss/**/*.scss", ['styles']);
	gulp.watch("./scripts/**/*.js", ['scripts']);
	gulp.watch("./index.html", ["inject"]);
	gulp.watch("./sounds/**/*", ["sounds"]);
	gulp.watch("./images/**/*", ["images"]);
	gulp.watch("./fonts/**/*", ["fonts"]);
})

gulp.task('build', function() {
	runSequence(
		'clean',
		[
			'images',
			'fonts',
			'sounds',
			'vendor-scripts',
			'scripts',
			'styles',
			'html'
		],
		'inject',
		'watch'
	);
});

