const {dest, src, parallel, watch, series} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const minifyCss = require('gulp-clean-css');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const del = require('del')

//To bundle the css in a specific order:
//const cssFiles = ['./src/css/FILE1.CSS', './src/css/FILE2.CSS']


//compile scss into css
function compileSass() {
    // Where is my scss 
    return src('./src/scss/**/*.scss')
    //pass that file through sass compiler
        .pipe(sass().on('error', sass.logError))
    //where do I save the compiled css?
        .pipe(dest('./src/css'))
    //stream changes to all browsers
        .pipe(browserSync.stream())
}

const bundleCss = () => {
    //To bundle the css in a specific order:
    //return src(cssFiles)
    return src('./src/css/**/*.css', { allowEmpty: true })
    .pipe(minifyCss())
    .pipe(concat('bundle.css'))
    .pipe(dest('./dist/css/'))

    
}

const bundleJs = () => {
    return src('./src/js/**/*.js', { allowEmpty: true }) 
        .pipe(minify({noSource: true}))
        .pipe(concat('bundle.js'))
        .pipe(dest('./dist/js'))
}


const htmlDist = () => {
    return src('./src/**/*.html', { allowEmpty: true })
    .pipe(dest('./dist'))
}

const cssDist = () => {
    return src('./src/css/bundle.css', { allowEmpty: true })
    .pipe(dest('./dist/css/'))
}

const jsDist = () => {
    return src('./src/css/bundle.js', { allowEmpty: true })
    .pipe(dest('./dist/js/'))
}

const cleanDist = () => {
    return del('./dist')
}

function start() {
    browserSync.init({
        server: {
            baseDir: "./src"
        }
    });

    watch('./src/scss**/*.scss', series(style, bundleCss));
    watch('./src/*.html').on('change', browserSync.reload);
    watch('./src/js**/*.js').on('change', series(bundleJs, browserSync.reload));
   
}





exports.bundleCss = bundleCss;
exports.bundleJs = bundleJs;
exports.htmlDist = htmlDist;
exports.jsDist = jsDist;
exports.cssDist = cssDist;
exports.cleanDist = cleanDist;
exports.compileSass = compileSass;
exports.start = start;
exports.bundle = parallel(bundleCss, bundleJs)
exports.build = series(compileSass, bundleCss, bundleJs, htmlDist, cssDist, jsDist)




