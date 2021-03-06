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
        autoprefixer({ browsers: ['last 1 version'] }),
        // cssnano()
    ];
    return gulp.src('./src/public/css/*.css')
        .pipe(postcss(plugins))
        .pipe(gulp.dest('./build/public/css/'));
});
gulp.task('copy:others', () => {
    return gulp
        .src([
            '!./src/public/node_modules',
            './src/**/*.html',
            './src/**/*.handlebars',
            './src/**/*.ttf',
            './src/**/*.otf',
            './src/**/*.eot',
            './src/**/*.svg',
            './src/**/*.woff',
            './src/**/*.woff2',
        ])
        .pipe(gulp.dest('./build'));
});
gulp.task('copy:node', () => {
    return gulp
        .src(['./src/public/node_modules/**/*'])
        .pipe(gulp.dest('./build/public/node_modules'));
});

gulp.task('copy:images', () =>
    gulp.src('src/public/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('build/public/img'))
);

gulp.task('compile', ['compile:js', 'compile:css']);

gulp.task('copy', ['copy:others', 'copy:images', 'copy:node']);

gulp.task('build', gulpsync.sync(['clean', 'compile', 'copy']));

gulp.task('deploy', ["build"], shell.task(['firebase deploy']));