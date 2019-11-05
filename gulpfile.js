//Require packages
const {src, dest, series, parallel, watch} = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const maps = require('gulp-sourcemaps');
const image = require('gulp-image');
const del = require('del');
const connect = require('gulp-connect');

//Function to concatinate the given JS files into one files call all.js and save it in the js dir
function concatJS(cb) {
	return src([
		'js/circle/autogrow.js',
		'js/circle/circle.js',
		'js/global.js'])
	.pipe(maps.init())
	.pipe(concat('all.js'))
	.pipe(maps.write('./'))
	.pipe(dest('js'));

	cb()
}

//Function for minifying the all.js file and renaming it to all.min.js and saving it in the dist/scripts dir
function minifyJS(cb) {
	src('js/all.js')
	.pipe(uglify())
	.pipe(rename('all.min.js'))
	.pipe(dest('dist/scripts'));

	cb();
}

//Function to compile Sass into CSS and saving it in css dir
function compileSass(cb) {
	return src('sass/global.scss')
	.pipe(maps.init())
	.pipe(sass())
	.pipe(maps.write('./'))
	.pipe(dest('css'))

	cb()
}

//Function for minifying the global.css file and renaming it to all.min.css and saving it in the dist/styles dir
function minifyCSS(cb) {
	src('css/global.css')
	.pipe(cleanCSS())
	.pipe(rename('all.min.css'))
	.pipe(dest('dist/styles'));

	cb();
}

function optimizeImages(cb) {
	return src('images/*')
	.pipe(image())
	.pipe(dest('dist/content'));

	cb();
}

function clean(cb) {
	return del(['dist']);

	cb();
} 

function cleanTest(cb) {
	return del(['css', 'js/all.js', 'js/all.js.map']);
	
	cb();
}

function serve(cb) {
	connect.server({
		root: '',
		livereaload: true,
		port: '3000'
	});

	cb();
}

function watchTask(cb){
	watch('sass/**/*.scss', series(styles));

}

//Creating a gulp task called scrips which first runs concatJS function, then minifyJS function
const scripts = series(concatJS, minifyJS);
exports.scripts = scripts;

//Creating a gulp task called styles which first runs compileSass function, then minifyCSS function
const styles = series(compileSass, minifyCSS);
exports.styles = styles;

//Creating a gulp task called images
const images = series(optimizeImages);
exports.images = images;

//Creating a gulp task called clean
exports.clean = series(clean);
exports.clean = clean;

//Creating a gulp task called cleanDev, which runs clean function, before running cleanDev
const cleanDev = series(clean, cleanTest);
exports.cleanDev = cleanDev;

exports.serve = serve;

exports.watch = watchTask;

//Creating a gulp task called styles which first runs compileSass function, then minifyCSS function
const build = series(clean, parallel(scripts, styles, images));
exports.build = build;

//Default
exports.default = series(build, parallel(serve, watchTask));

//Tests
exports.doBoth = series(scripts, styles);

