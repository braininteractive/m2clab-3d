var vfs = require('vinyl-fs');
var through = require('through2');
var gutil = require('gulp-util');

function browserifyConcat() {

  var bundleFiles = require(process.cwd() + '/package.json')['browserify-concat'];
  if (!bundleFiles) return gutil.noop();

  var beforeBundle = bundleFiles.beforeBundle || [];
  var afterBundle = bundleFiles.afterBundle || [];

  if (!beforeBundle.length && !afterBundle.length) return gutil.noop();

  var bundleCache = [];

  function transform(file, enc, callback) {
    bundleCache.push(file);
    callback();
  }

  function flush(callback) {

    var stream = this;

    var beforeStream = vfs.src(beforeBundle)
      .pipe(through.obj(function (file, enc, cb) {
        stream.push(file);
        cb();
      }));

    beforeStream.on('finish', function () {
      bundleCache.forEach(function (file) {
        stream.push(file);
      });

      var afterStream = vfs.src(afterBundle)
        .pipe(through.obj(function (file, enc, cb) {
          stream.push(file);
          cb();
        }));

        afterStream.on('finish', callback);

    });
  }

  return through.obj(transform, flush);

}

module.exports = browserifyConcat;