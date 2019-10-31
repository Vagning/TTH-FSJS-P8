//Require packages
const {src, dest, series} = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

function concatJS(cb) {
	return src([
		'js/circle/autogrow.js',
		'js/circle/circle.js',
		'js/global.js'])
	.pipe(concat('all.js'))
	.pipe(dest('js'));

 	cb();
}

function minifyJS(cb) {
	src('js/all.js')
	.pipe(uglify())
	.pipe(rename('all.min.js'))
	.pipe(dest('dist/scripts'));

	cb();
}

exports.scripts = series(concatJS, minifyJS);

