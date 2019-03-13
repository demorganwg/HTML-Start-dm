const syntax			= 'scss';

const gulp 				= require('gulp');
const	sass				= require('gulp-sass');
const	browserSync		= require('browser-sync');
const	concat			= require('gulp-concat');
const	uglify			= require('gulp-uglifyjs');
const	cssnano			= require('gulp-cssnano');
const	rename			= require('gulp-rename');
const	del				= require('del');
const	imagemin			= require('gulp-imagemin');
const	pngquant			= require('imagemin-pngquant');
const	cache				= require('gulp-cache');
const	autoprefixer	= require('gulp-autoprefixer');

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		open: false,
	});
});

gulp.task('sass', function() {
	return gulp.src('app/'+syntax+'/**/*.'+syntax+'')
	.pipe(sass({
		outputStyle: 'expanded'
	}))
	.pipe(rename({
		suffix: '.min',
		prefix: ''
	}))
	.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
		cascade: true
	}))
	.pipe(cssnano())
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({
		stream: true
	}))
});

gulp.task('js-libs', function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
	])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'));
});

gulp.task('code', function() {
	return gulp.src('app/**/*.html')
	.pipe(browserSync.reload({
		stream: true
	}))
});

gulp.task('js', function() {
	return gulp.src('app/js/*.js')
	.pipe(browserSync.reload({
		stream: true
	}))
});

gulp.task('clean', async function() {
	return del.sync('dist');
});

gulp.task('img', function() {
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{
			removeViewBox: false
		}],
		use: [pngquant()]
	})))
	.pipe(gulp.dest('dist/img'));
});

gulp.task('prebuild', async function() {
	var buildCss = gulp.src('app/css/main.min.css')
	.pipe(gulp.dest('dist/css'))
	var buildFonts = gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'))
	var buildJs = gulp.src('app/js/**/*')
	.pipe(gulp.dest('dist/js'))
	var buildHtml = gulp.src('app/*.html')
	.pipe(gulp.dest('dist'));
});

gulp.task('clear-cache', function(callback) {
	return cache.clearAll();
})

gulp.task('watch', function() {
	gulp.watch('app/'+syntax+'/**/*.'+syntax+'', gulp.parallel('sass'));
	gulp.watch(['app/*.html'], gulp.parallel('code'));
	gulp.watch(['app/js/scripts.js'], gulp.parallel('js'));
});

gulp.task('default', gulp.parallel('sass', 'js-libs', 'browser-sync', 'watch'));
gulp.task('build', gulp.parallel('prebuild', 'clean', 'img', 'sass', 'js-libs'));