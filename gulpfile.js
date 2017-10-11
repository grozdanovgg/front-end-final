const gulp = require('gulp');
const babel = require('gulp-babel');
const clean = require('gulp-clean');
const shell = require('gulp-shell');
const gulpsync = require('gulp-sync')(gulp);
const imagemin = require('gulp-imagemin');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
// var uglify = require('gulp-uglify');


gulp.task('clean', function () {
    return gulp
        .src('build', {
            read: false,
        })
        .pipe(clean());
});

gulp.task('compile:js', () => {
    return gulp.src(['./src/public/**/*.js', '!./src/public/node_modules/**'])
        .pipe(babel({ presets: ['env'] }))
        .pipe(gulp.dest('./build/public'));
});

gulp.task('compile:css', () => {
    const plugins = [
        autoprefixer({browsers: ['last 6 version']}),
        cssnano()
    ];
    return gulp.src('./src/public/css/*.css')
        .pipe(postcss(plugins))
        .pipe(gulp.dest('./build/public/css/'));
});
gulp.task('copy:all', () => {
    return gulp
        .src([
            '!./src/public/**/*.js',
            './src/**/*.html',
            './src/**/*.js',
            './src/**/*.handlebars',
            './src/**/*.ttf',
            './src/**/*.css',
        ])
        .pipe(gulp.dest('./build'));
});
gulp.task('copy:images', () =>
    gulp.src('src/public/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('build/public/img'))
);

gulp.task('compile', ['compile:js','compile:css']);

gulp.task('copy', ['copy:all', 'copy:images']);

gulp.task('build', gulpsync.sync(['clean', 'compile', 'copy']));

gulp.task('deploy', ["build"],  shell.task(['firebase deploy']));