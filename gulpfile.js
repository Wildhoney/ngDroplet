(function() {

    var mainModule = 'components/ngDroplet.js',
        vendorDest = 'example/js/vendor/ng-droplet',
        devDist    = 'ng-droplet.js',
        minDist    = 'ng-droplet.min.js';

    var gulp   = require('gulp'),
        uglify = require('gulp-uglify'),
        rename = require('gulp-rename'),
        karma  = require('gulp-karma'),
        jshint = require('gulp-jshint');

    gulp.task('build', function gulpBuild(){
        gulp.src(mainModule)
            .pipe(rename(devDist))
            .pipe(gulp.dest('dist'))
            .pipe(gulp.dest(vendorDest))
            .pipe(rename(minDist))
            .pipe(uglify())
            .pipe(gulp.dest('dist'))
    });

    gulp.task('karma', function gulpKarma() {

        var testFiles = [
            'example/js/vendor/angular/angular.js',
            'example/js/vendor/angular-mocks/angular-mocks.js',
            'tests/Spec.js',
            mainModule
        ];

        return gulp.src(testFiles).pipe(karma({
            configFile: 'karma.conf.js',
            action: 'run'
        })).on('error', function onError(error) {
            throw error;
        });
    });

    gulp.task('hint', function gulpHint() {

        return gulp.src(mainModule)
            .pipe(jshint('.jshintrc'))
            .pipe(jshint.reporter('default'));
    });

    gulp.task('test', ['hint']);
    gulp.task('default', ['hint', 'test']);

})();