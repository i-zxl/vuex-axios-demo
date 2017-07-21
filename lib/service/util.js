const request = require('request');
/*
formatDate: 日期格式化
 */
const formatDate = (function () {
  const withZero = (n)=> n < 10 ? '0' + n : n;
  const dateGetter = {
    Y: (date) => date.getFullYear(),
    m: (date) => withZero(date.getMonth() + 1),
    d: (date) => withZero(date.getDate()),
    H: (date) => withZero(date.getHours()),
    i: (date) => withZero(date.getMinutes()),
    s: (date) => withZero(date.getSeconds()),
  }
  return function (date, format = '%Y-%m-%d %H:%i:%s') {
    return format.replace(/%([A-Za-z]?)/g,  (match, $1) => dateGetter[$1] ? dateGetter[$1](date) : $1);
  }
})();

const http_request = (options) => {

  if (typeof(options) === 'string') {
    options = {
      url: options,
      method: 'get'
    }
  }
  console.log(options);
  if (!options.method) {
    options.method = 'get';
  }
  console.log('api -> ', options.url);
  return new Promise((resolve, reject) => {
    request(options.url, (err, response, body) => {
      if (err) {
        console.log(err);
        reject('api faild');
      } else {
        if (typeof(body) === 'string') {
          try {
            body = JSON.parse(body);
          } catch (e) {
            reject("api aberrant");
          }
        }
        resolve(body);
      }
    })
  })
}

module.exports = {
  formatDate,
  http_request
}
