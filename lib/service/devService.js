const axon = require('axon');


module.exports = function (options) {
  const clientFileSocket = axon.socket('req');
  clientFileSocket.bind(options.port);

  const requireFn = function (params) {
    return new Promise(function (resolve) {
      clientFileSocket.send(params, resolve);
    })
  }
  return async function (ctx, next) {
    if (ctx.body) {
      return await next();
    }
    let url = ctx.request.url;
    if (url === '/') {
      // 未命中路由
      return await next();
    }
    let { code, error, contentType } = await requireFn(url);
    // 支持 buffer 类型数据，例如字体文件
    code = new Buffer(code);
    if (error) {
      await ctx.render('Error', {
        method: ctx.method,
        url: ctx.url,
        errorText: error.toString(),
        stack: error.stack
      });
    } else if (code) {
      ctx.set('Content-Type', contentType);
      ctx.body = code;
    } else {
      await next()
    }
  }
}
