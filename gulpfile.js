const gulp = require('gulp');

const babel = require('gulp-babel');

gulp.task('compile:js', () => {
    return gulp.src('./src/**/*.js')
        .pipe(babel({
            presets: ['env'],
        }))
        .pipe(gulp.dest('./build/js'));
});

gulp.task('build', ['compile:js']);