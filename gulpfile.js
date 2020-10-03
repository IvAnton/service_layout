const project_folder = 'dist'
const source_folder = 'src'

const {src, dest} = require('gulp')
const gulp = require('gulp')
const browser_sync = require('browser-sync').create()
const del = require('del')
const scss = require('gulp-sass')
const groupMedia = require('gulp-group-css-media-queries')
const imageMin = require('gulp-imagemin')
const autoPrefixer = require('gulp-autoprefixer')
const fileIncluder = require('gulp-file-include')

const path = {
    build: {
        html: project_folder + '/',
        css: project_folder + '/css/',
        js: project_folder + '/js/',
        img: project_folder + '/img/',
        fonts: project_folder + '/fonts/'
    },
    src: {
        html: source_folder + '/index.html',
        css: source_folder + '/scss/**/*.scss',
        js: source_folder + '/js/**/*.js',
        img: source_folder + '/img/**/*.{jpg,png,svg,gif,ico,webp}',
        fonts: source_folder + '/fonts/*.ttf'
    },
    watch: {
        html: source_folder + '/**/*.html',
        css: source_folder + '/scss/**/*.scss',
        js: source_folder + '/js/**/*.js',
        img: source_folder + '/img/**/*.{jpg,png,svg,gif,ico}',
    },
    clean: './' + project_folder + '/'
}

function browserSync() {
    browser_sync.init({
        server: {
            baseDir: './' + project_folder + '/'
        },
        port: 4000,
        notify: true
    })

}

function html() {
    return src(path.src.html)
        .pipe(fileIncluder())
        .pipe(dest(path.build.html))
        .pipe(browser_sync.stream())
}

function js() {
    return src(path.src.js)
        .pipe(dest(path.build.js))
        .pipe(browser_sync.stream())
}

function css() {
    return src(path.src.css)
        .pipe(
            scss({
                outputStyle: 'expanded'
            })
        )
        .pipe(
            groupMedia()
        )
        .pipe(
            autoPrefixer({
                cascade: true
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browser_sync.stream())
}

function images() {
    return src(path.src.img)
        .pipe(
            imageMin()
        )
        .pipe(dest(path.build.img))
        .pipe(browser_sync.stream())
}

function fonts() {
    return src(path.src.fonts)
        .pipe(dest(path.build.fonts))
        .pipe(browser_sync.stream())
}

function watchFiles() {
    gulp.watch([path.watch.html], html)
    gulp.watch([path.watch.css], css)
    gulp.watch([path.watch.js], js)
    gulp.watch([path.watch.img],images)
}

function clean() {
    return del(path.clean)
}

const build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts))
const watch = gulp.parallel(build, watchFiles, browserSync)

exports.js = js
exports.css = css
exports.html = html
exports.images = images
exports.fonts = fonts
exports.build = build
exports.watch = watch
exports.default = watch


