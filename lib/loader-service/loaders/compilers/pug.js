
module.exports = function (code, filePath, options = {}) {
  const pug = require('pug');
  try{
    return pug.compile(code, options)
  } catch (e) {
    return e.toString()
  }
}
