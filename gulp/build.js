'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
// var es = require('event-stream');
// var wiredep = require('wiredep');
// var _ = require('lodash');
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});
var template = require('gulp-es6-template-strings')

gulp.task('clean', function (done) {
    return $.del([path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/')], done);
});

gulp.task('build-partials-templates', function () {
    return gulp.src('src/template/*.html')
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe($.angularTemplatecache({
            module: 'denningOnline',
            root: 'template',
        }))
        .pipe($.sourcemaps.init())
        .pipe($.concat('templateCacheHtml1.js'))
        // .pipe($.sourcemaps.write())
        .pipe(gulp.dest(path.join(conf.paths.dist, 'partials/')));
});

gulp.task('build-partials-views', function () {
    return gulp.src('src/views/*.html')
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe($.angularTemplatecache({
            module: 'denningOnline',
            root: 'views',
        }))
        .pipe($.sourcemaps.init())
        .pipe($.concat('templateCacheHtml2.js'))
        // .pipe($.sourcemaps.write())
        .pipe(gulp.dest(path.join(conf.paths.dist, 'partials/')));
});

gulp.task('build-fonts', function () {
    gulp.src($.mainBowerFiles())
        .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
        .pipe($.flatten())
        .pipe(gulp.dest(path.join(conf.paths.dist, 'fonts/')));
});

gulp.task('build-other', function () {
    var fileFilter = $.filter(function (file) {
        return file.stat.isFile();
    });

    gulp.src([
        path.join(conf.paths.src, '/**/*'),
        path.join('!' + conf.paths.src, '/**/*.{html,css,js}')
    ])
    .pipe(fileFilter)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
});

gulp.task('build', ['build-partials-templates','build-partials-views', 'build-fonts', 'build-other'], function () {

    var injectStyles = gulp.src(objPath.CSS)
        //.pipe($.concat('app' + '_' + new Date().getTime() + '.css'))
        .pipe($.concat('app.css'))
        .pipe($.csso({ reduceIdents: false }))
        .pipe(gulp.dest(path.join(conf.paths.dist, 'css')));

    var injectAppStream = gulp.src(objPath.JS)
        .pipe($.angularFilesort()).on('error', conf.errorHandler('AngularFilesort'))
        //.pipe($.concat('app' + '_' + new Date().getTime() + '.js'))
        .pipe($.concat('app.js'))
        .pipe($.ngAnnotate())
        .pipe($.uglify({  mangle: false })).on('error', conf.errorHandler('Uglify'))
        .pipe(gulp.dest(path.join(conf.paths.dist, 'scripts')));

    var injectVendor = gulp.src(objPath.VENDOR_ALL)
        .pipe($.concat('vendor.js'))
        .pipe($.ngAnnotate())
        .pipe($.uglify())
        .pipe(gulp.dest(path.join(conf.paths.dist, 'scripts')));

    return gulp.src(path.join(conf.paths.src, 'index.html'))
        .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
        .pipe($.inject(injectStyles, {relative: true}))
        .pipe($.inject(injectVendor, {
            starttag: '<!-- inject:vendor.js -->',
            relative: true
        }))
        .pipe($.inject(injectAppStream, {relative: true}))
        .pipe($.sourcemaps.write())
        .pipe($.minifyHtml({
          empty: true,
          spare: true,
          quotes: true,
          conditionals: true
        }))
        .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
});



var objPath = {
    CSS: [
        "vendors/bower_components/animate.css/animate.min.css",
        "vendors/bower_components/material-design-iconic-font/dist/css/material-design-iconic-font.min.css",
        "vendors/bower_components/bootstrap-sweetalert/lib/sweet-alert.css",
        "vendors/bower_components/angular-loading-bar/src/loading-bar.css",
        "vendors/bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.min.css",
        "vendors/bower_components/angular-material/angular-material.css",
        "vendors/bower_components/fullcalendar/dist/fullcalendar.min.css",
        "vendors/intl-tel-input/css/intlTelInput.css",

        "src/css/app.min.1.css",
        "src/css/app.min.2.css",
        "src/css/demo.css",
        "src/css/extra.css",
        "src/css/formly.css"
    ],
    VENDOR_ALL: [
        "vendors/bower_components/jquery/dist/jquery.min.js",
        "vendors/bower_components/angular/angular.min.js",
        "vendors/bower_components/angular-animate/angular-animate.min.js",
        "vendors/bower_components/angular-resource/angular-resource.min.js",
        "vendors/bower_components/angular-messages/angular-messages.js",
        "vendors/bower_components/angular-aria/angular-aria.js",
        "vendors/bower_components/angular-material/angular-material.js",
        "vendors/bower_components/angular-ui-router/release/angular-ui-router.min.js",
        "vendors/bower_components/angular-loading-bar/src/loading-bar.js",
        "vendors/bower_components/oclazyload/dist/ocLazyLoad.min.js",
        "vendors/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
        "vendors/bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min.js",
        "vendors/bower_components/bootstrap-sweetalert/lib/sweet-alert.min.js",
        "vendors/bower_components/Waves/dist/waves.min.js",
        "vendors/bower_components/ng-table/dist/ng-table.min.js",
        "vendors/bower_components/fingerprintjs2/dist/fingerprint2.min.js",
        "vendors/bower_components/flot/jquery.flot.js",
        "vendors/bower_components/flot.curvedlines/curvedLines.js",
        "vendors/bower_components/flot/jquery.flot.resize.js",
        "vendors/bower_components/flot/jquery.flot.categories.js",
        "vendors/bower_components/moment/min/moment.min.js",
        "vendors/bower_components/fullcalendar/dist/fullcalendar.min.js",
        "vendors/bower_components/flot-orderBars/js/jquery.flot.orderBars.js",
        "vendors/bower_components/flot/jquery.flot.pie.js",
        "vendors/bower_components/flot.tooltip/js/jquery.flot.tooltip.min.js",
        "vendors/bower_components/angular-nouislider/src/nouislider.min.js",
        "vendors/bower_components/angular-base64-upload/dist/angular-base64-upload.min.js",
        "vendors/bower_components/clipboard/dist/clipboard.min.js",
        "vendors/bower_components/ngclipboard/dist/ngclipboard.min.js",
        "vendors/bower_components/jquery.easy-pie-chart/dist/jquery.easypiechart.min.js",

        "vendors/sparklines/jquery.sparkline.min.js",
        "vendors/input-mask/input-mask.min.js",
        "vendors/angular-formly/api-check.js",
        "vendors/angular-formly/formly.js",
        "vendors/angular-formly/angular-formly-templates-bootstrap.js",
        "vendors/ngClipboard.js",
        "vendors/bootstrap-growl/bootstrap-growl.min.js",
        "vendors/intl-tel-input/js/intlTelInput.min.js",
        "vendors/intl-tel-input/js/utils.js",
        "vendors/intl-tel-input/js/international-phone-number.js"
    ],
    JS: [
        'src/js/**/*.js',
        'dist/partials/templateCacheHtml1.js',
        'dist/partials/templateCacheHtml2.js',
    ],

    // template markups
    HTML: [
        'src/**/*.html'
    ],
    DIST: './dist'
};

