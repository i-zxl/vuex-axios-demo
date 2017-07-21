const path = require('path');
const loaders = require('./loaders');
const axon = require('axon');
const log = require('./logger');

const config = require(path.join(process.cwd(), 'conf.js'))
const loader = loaders({
  urlRoot: config.urlRoot,
  staticRoot: config.staticRoot
});

const sock = axon.socket('rep');
sock.connect(config.axonPort);

sock.on('message', async function(url, reply){
  // resize the image
  let start = Date.now();
  const result = await loader.require(url);
  log.debug('loader:', url, Date.now() - start);
  reply(result);
});
