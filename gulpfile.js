// get gulp and modules
var gulp = require('gulp'),
	connect = require('gulp-connect'),
	sass = require('gulp-sass'),
	bourbon = require('node-bourbon'),
	neat = require('node-neat'),
	autoprefix = require('gulp-autoprefixer'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	imagemin = require('gulp-imagemin'),	
	plumber = require('gulp-plumber'),
	concat = require('gulp-concat'),
	jade = require('gulp-jade'),
	clean = require('gulp-clean'),
	deploy = require('gulp-gh-pages'),
	sitemap = require('gulp-sitemap');

// link public assets
var publicDir = "www";

// start server
gulp.task('connect', function() {
  connect.server({
    root: publicDir,
    port: 9009,
    livereload: true
  });
});

// minify images
gulp.task('imagemin', function () {
	return gulp.src(['img/*', 'img/**/*'])
		.pipe(plumber())
		.pipe(imagemin({progressive: true}))
		.pipe(gulp.dest(publicDir + '/img'))
		.pipe(connect.reload());
});

// compile sass to css and prefix
gulp.task('sass', function () {
	gulp.src('sass/*.scss')
		.pipe(plumber())
		.pipe(sass({
	    	includePaths: neat.includePaths
	    }))
		.pipe(autoprefix('last 10 version'))
		.pipe(gulp.dest(publicDir + '/css'))
		.pipe(connect.reload());
});

// compiles jade
gulp.task('jade', function() {
	var news = require('./data/news.json'),
		events = require('./data/events.json'),
		challenges = require('./data/challenges.json');

 	gulp.src('./jade/*.jade')
 		.pipe(plumber())
	    .pipe(jade({
	    	pretty: true,
	    	locals: {
	    		"news": news, 	
	    		"events": events, 	
	    		"challenges": challenges 	
	    	}
	    }))
	    .pipe(gulp.dest(publicDir))
	    .pipe(connect.reload());
});

// clean
gulp.task('clean', function() {
	gulp.src(publicDir + '/*', {read: false})
		.pipe(plumber())
		.pipe(clean());
});

// contact js and minify
gulp.task('uglify', function() {
	gulp.src(['js/**/jquery.js', 'js/**/*.js', 'js/*.js'])
		.pipe(plumber())
		.pipe(concat('main.js'))
		// .pipe(uglify())
		.pipe(gulp.dest(publicDir + '/js'))
		.pipe(connect.reload());
});

// copy video
gulp.task('video', function() {
	gulp.src(['video/*'])
		.pipe(plumber())
		.pipe(gulp.dest(publicDir + '/video'))
		.pipe(connect.reload());
});

// copy other resources
gulp.task('copy', function() {
	gulp.src(['favicon.ico', 'humans.txt', 'robots.txt'])
		.pipe(gulp.dest(publicDir))
		.pipe(connect.reload());
});

gulp.task('watch', function() {
    gulp.watch(['js/*.js', 'js/**/*.js'], ['uglify']);
    gulp.watch(['img/*', 'img/**/*'], ['imagemin']);
    gulp.watch(['sass/*.scss', 'sass/**/*.scss'], ['sass']);
    gulp.watch(['jade/*.jade', 'jade/**/*.jade'], ['jade']);
    gulp.watch(['favicon.ico', 'humans.txt', 'robots.txt', 'cd'], ['copy']);
    gulp.watch(['video/*'], ['video']);
});

gulp.task('build', function() {
	gulp.start('sass', 'jade', 'uglify', 'imagemin', 'video', 'copy');
}); 

gulp.task('stage', function () {
    return gulp.src(['./www/**/*', './data/**/*'])
        .pipe(deploy());
});

gulp.task('live', function () {
    var options = { 
    	remoteUrl: "https://github.com/latcraft/latcraft.github.io.git",
    	branch: "master"
    };	
    return gulp.src(['./www/**/*', './data/**/*', 'CNAME'])
        .pipe(deploy(options));
});

gulp.task('default', ['connect', 'build', 'watch']);