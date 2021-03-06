const fs = require('fs');
const path = require('path')
const crypto = require('crypto');


const STATIC_FILE = /\.(min\.js|eot|svg|ttf|woff|woff2|png|jpe?g|gif|svg)(\?\S*)?$/;
const IS_COMMON = /\/common\//;

const FILE_CACHE = {};


module.exports = function () {
  return function(file, next, done) {
    const ext =  path.parse(file.path).ext;

    let content;
    try {
      content = fs.readFileSync(file.path);
    } catch (err) {
      return done(new Error(err));
    }
    if (STATIC_FILE.test(file.path) || IS_COMMON.test(file.path)) {
      file.content = fs.readFileSync(file.path);
      return done(file);
    }
    const hash = crypto.createHash('md5');
    // 对文件原始内容做md5
    const md5 = hash.update(content).digest('hex');
    const cacheFile = FILE_CACHE[md5];
    if ( cacheFile && cacheFile.done ) {
      return done(cacheFile);
    }
    file.content = content;
    FILE_CACHE[md5] = file;
    next(file);
  }
}
