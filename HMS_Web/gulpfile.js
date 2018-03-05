var gulp = require("gulp");
var concat = require("gulp-concat");
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var del = require('del');

var path = {
	script : [
		"./bower_components/angular/angular.min.js",
		"./bower_components/jquery/dist/jquery.min.js",
		"./bower_components/**/*.min.js", 
		"!./bower_components/**/require.js",
		"!./bower_components/moment/min/locales.min.js",
		"!./bower_components/moment/min/moment-with-locales.min.js",
		"!./bower_components/jquery/dist/jquery.slim.min.js",
		"!./bower_components/jquery/sizzle/dist/sizzle.min.js"
	],
	script_dist : "./src/main/resources/static/js/lib",
	
	css: [
		"./@publishing/css/**/*.css"
	],
	css_dist : "./src/main/resources/static/css/",
	
	image: [
		"./@publishing/images/**/*"
	],
	image_dist: "./src/main/resources/static/images/",
	
	font: [
		"./@publishing/font/**/*"
	],
	font_dist: "./src/main/resources/static/font"
}

gulp.task("script", function() {
	return gulp.src(path.script)
	.pipe(sourcemaps.init())
		.pipe(concat("vendor.min.js"))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest(path.script_dist));
});

gulp.task("css", function() {
	return gulp.src(path.css)
	.pipe(sourcemaps.init())
		.pipe(cssnano())
		.pipe(concat("app.min.css"))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest(path.css_dist));
});

gulp.task("image", function () {
	return gulp.src(path.image)
	.pipe(imagemin())
	.pipe(gulp.dest(path.image_dist));
});

gulp.task("font", function () {
	return gulp.src(path.font)
	.pipe(gulp.dest(path.font_dist));
});

gulp.task("default", ["script", "css", "image", "font"]);
