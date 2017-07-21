const {http_request} = require('../util.js');
var sleep = function (duration) {
  return new Promise(function (resolve) {
    setTimeout(resolve, duration);
  });
}

module.exports = {
  index: async function (ctx, next) {
    await sleep(2000)
    ctx.body = {
      status: 'success',
      result: 'World'
    }
  },

  show: async function(ctx, next) {
    let result = await [
      http_request('http://10.126.39.12:9700/user/log-on?uid=284286913'),
    ];
    ctx.body = {
      status: 'success',
      result: result
    }
  }
}
