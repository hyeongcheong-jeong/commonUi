const { src, dest, task, watch, series, parallel } = require('gulp');
const options = require("./package.json").options;
const browserSync = require('browser-sync').create();
const gutil = require('gulp-util');
const jshint = require('gulp-jshint');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');



task('livepreview', (done) => {
  browserSync.init({
    server: {
      baseDir: './', index: "curation_health_life.html"
    },
    ghostMode: { clicks: false, scroll: false },
    port: 8000
  });
  done();
});


function previewReload(done) {
  browserSync.reload();
  done();
}

// Error
const onError = (error) => {
  console.log([error.message, error.plugin]);
};

const plumberOption = {
  errorHandler: onError
};



task('html', (done) => {
  return src(options.paths.root + '/*.html')
    .pipe(plumber(plumberOption))
    .pipe(rename((path) => {
      path.dirname += '';
    }))
    .pipe(dest(options.paths.root))
  done();
});

// task('styles', () => {
//   return src(options.paths.src.css + '/**/*')
//     .pipe(plumber(plumberOption))
//     .pipe(sass().on('error', sass.logError))
//     .pipe(postcss([
//       require('autoprefixer'), require('cssnano')
//     ]))
//     .pipe(dest(options.paths.resources.css))
// });


//Watch files for changes
task('watch-changes', (done) => {

  //Watching HTML Files edits
  watch(options.root + '/*.html', series(previewReload));

  //Watching css Files edits
  // watch(options.paths.src.css + '/**/*', series('styles', previewReload));

  //Watching JS Files edits
  // watch(options.paths.src.js + '/**/*.js', series('scripts', previewReload));

  //Watching Img Files updates
  // watch(options.paths.src.img + '/**/*', series('imgs', previewReload));

  console.log("\n\t", "Watching for Changes made to files.\n");

  done();
});

task('development', series('html', (done) => {
  console.log("\n\t", "npm run dev is complete. Files are located at ./dist\n");
  done();
}));


exports.default = series('development', 'livepreview', 'watch-changes');