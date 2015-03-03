(function() {
    
    var yaml   = require('js-yaml'),
        fs     = require('fs');

    /**
     * @property {Object} config
     * @property {String} config.components
     */
    var config = yaml.safeLoad(fs.readFileSync('.gulp.yml', 'utf8'));

    var gulp   = require('gulp'),
        uglify = require('gulp-uglify'),
        rename = require('gulp-rename'),
        karma  = require('gulp-karma'),
        jshint = require('gulp-jshint');

    gulp.task('build', function gulpBuild() {

        gulp.src(config.components)
            .pipe(rename(config.build.development))
            .pipe(gulp.dest(config.build.directory))
            .pipe(gulp.dest(config.build.copy))
            .pipe(rename(config.build.production))
            .pipe(uglify())
            .pipe(gulp.dest(config.build.directory));

    });

    gulp.task('karma', function gulpKarma() {

        var testFiles = [
            'example/js/vendor/angular/angular.js',
            'example/js/vendor/angular-mocks/angular-mocks.js',
            'tests/Spec.js',
            config.components
        ];

        return gulp.src(testFiles).pipe(karma({
            configFile: 'karma.conf.js',
            action: 'run'
        })).on('error', function onError(error) {
            throw error;
        });

    });

    gulp.task('hint', function gulpHint() {

        return gulp.src(config.components)
            .pipe(jshint('.jshintrc'))
            .pipe(jshint.reporter('default'));

    });

    gulp.task('test', ['karma', 'hint']);
    gulp.task('default', ['test', 'build']);
    gulp.task('watch', function watch() {
        gulp.watch('components/*.js', ['build']);
    });

})();