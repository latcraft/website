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
	resize = require('gulp-image-resize'),
	gulpif = require('gulp-if'),
	util = require('gulp-util'),
	gm = require('gulp-gm'),
	deploy = require('gulp-gh-pages'),
	// localScreenshots = require('gulp-local-screenshots'),
	sitemap = require('gulp-sitemap');

var env = util.env.environment ? util.env.environment : "local"

var events = require('./data/events.json'),
	challenges = require('./data/challenges.json');
	environment = require('./env/' + (env ? env : "local") + '/configuration.json')


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
	return gulp.src(['img/*', 'img/*/**'])
		.pipe(plumber())
	    .pipe(gulpif('speakers/*', resize({ 
			imageMagick: true,
			width : 180,
			height : 180,
			crop : true,
			upscale : true
		})))
		.pipe(imagemin({progressive: true}))
		.pipe(gulp.dest(publicDir + '/img'))
		.pipe(connect.reload());
});

gulp.task('fonts', function() {
	return gulp.src(['fonts/*'])
		.pipe(gulp.dest(publicDir + '/fonts' ))	
})

// compile sass to css and prefix
  gulp.task('sass', ['fonts'], function () {
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

	// var env = util.env.environment
	// if (!env) {
 //        throw new Error("--environment property is missing (possible values: local, stage, live")
	// }

	var news = require('./data/news.json'),
		events = require('./data/events.json'),
		challenges = require('./data/challenges.json');
		// environment = require('./env/' + env + '/host.json')

 	gulp.src(['./jade/*.jade', './jade/pages/*/**.jade'])
 		.pipe(plumber())
	    .pipe(jade({
	    	pretty: true,
	    	locals: {
	    		"news": news, 	
	    		"events": events, 	
	    		"challenges": challenges,
	    		"env": environment	
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
	return gulp.src(['favicon.ico', 'humans.txt', 'robots.txt', 'googlef8dbbdd1b207ac7f.html'])
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

// gulp.task('screens', ['copy', 'imagemin', 'fonts', 'sass'], function () {
// 	return gulp.src(publicDir + '/*/**.html')
//   		.pipe(localScreenshots({
//         path: publicDir + '/',
//         folder: publicDir + '/img',
//         type: 'png',
//         suffix: 'shot',
//         width: ['1300']
//    		}))
//   		.pipe(gulp.dest(publicDir + '/img'));
// });

gulp.task('build', function() {
	gulp.start('fonts', 'sass', 'jade', 'uglify', 'imagemin', 'video', 'copy' /*, 'screens'*/);
}); 

gulp.task('stage', function () {
    return gulp.src(['./www/**/*', './data/**/*', './env/stage/CNAME'])
        .pipe(deploy());
});

gulp.task('deploy', function () {
	if (env != "live" && env != "stage") {
		throw Error("Ooops, deployment target is missing. Should be one of '--environment stage' '--environment live'");
	}

    return gulp.src(['./www/**/*', './data/**/*', environment.cname])
        .pipe(deploy(environment.deployOptions));
});

gulp.task('default', ['connect', 'build', 'watch']);
