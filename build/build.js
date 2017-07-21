const path = require('path');
const fs = require('fs');
const loaders = require('../lib/loader-service/loaders');
const requirejs = require('requirejs');
const stream = require('stream');
const UglifyJS = require("uglify-js");

const esprima = require('esprima');
const escodegen = require('escodegen');
const esprimaWalk = require('esprima-walk');

const buildConfig = {
  main: 'main.js',
  output: path.join(__dirname, '../client/dist.min.js'),
  loadConfigPath: path.join(__dirname, '../conf.js'),
  requireConfigPath: path.join(__dirname, '../client/common/requireConfig.js'),
  loadOptions: {
    writeModuleName: true
  }
}


const loaderConf = require(buildConfig.loadConfigPath);
const requireConf = require(buildConfig.requireConfigPath);

const loader = loaders({
  urlRoot: loaderConf.urlRoot,
  staticRoot: loaderConf.staticRoot
});

const INGORE_MODULE = ['module', 'got'];

const getModulePath = (function () {
  var paths = requireConf.paths;
  var replaces = [];
  for (var key in paths) {
    // 仅替换斜杠分隔的完整词路径 aaa/bbb -> ccc/bbb
    // 不替换 aaa-c/bbb
    replaces.push({
      reg:  new RegExp('^' + key + '(\/|$)+'),
      to: paths[key] + '$1'
    })
  }
  return function (name) {
    var basic = name;
    //console.log('replace start', name)
    replaces.forEach(function (item) {
      name = name.replace(item.reg, item.to);
      //console.log('--------replace:', item.reg, item.to, name)
    })
    if (/^[^\/]/.test(name)) {
      // 非 / 开头的，需要补上/
      name = '/' + name;
    }
    if (!/\.js$/.test(name)) {
      // 非.js结尾的，补上
      name = name + '.js';
    }
    //console.log('rename:', basic, ' --> ', name);
    return name;
  }
})();

const getStreamCode = function (stream) {
  return new Promise(function (resolve) {
    var chunk = "";
    stream.on('data', function (data) {
      chunk += data;
    })
    stream.on('end', function () {
      //console.log(moduleName, 'end')
      resolve(chunk);
    })
  })
}

const INCLUDE_MODULE = {};
const loadModule = async function (moduleName, options) {
  var moduleNameLiteral = {
    type: 'Literal',
    value: moduleName,
    raw: '\'' + moduleName + '\''
  };
  const modulePath = getModulePath(moduleName);
  console.log('start load...', modulePath);
  let module = await loader.require(modulePath);
  let code = module.code;
  if (code instanceof stream) {
    // 流式输出
    code = await getStreamCode(code);
  }
  let requireAST;
  try {
    requireAST = esprima.parse(code);
  } catch (e) {
    console.log('esprima parse err:', e.toString());
  }
  let deps = [];
  try{
    esprimaWalk(requireAST, function (node) {
      if (node && node.type === 'CallExpression' && node.callee.name === 'require'
        && node.arguments[0] && node.arguments[0].type === 'Literal') {
        // require('something')
        deps.push(node.arguments[0]);
      } else if (node && node.type === 'CallExpression' && node.callee.name === 'define') {
        if (node.arguments) {
          var len = node.arguments.length;
          if (len === 1) {
            // define(function () {});
            node.arguments.unshift(moduleNameLiteral);
          } else if (len === 2) {
            if (node.arguments[0].type === 'ArrayExpression') {
              // define([], function () {})
              deps = deps.concat(node.arguments[0].elements);
              node.arguments.unshift(moduleNameLiteral);
            } else if (node.arguments[0].type === 'Literal'){
              // define(name, function () {})
            }
          } else if (len === 3) {
            // define(name, [], function () {})
            deps = deps.concat(node.arguments[1].elements);
          }
        }
      }
    })
  } catch (e) {
    console.log("-----------------ERROR!!!", e.toString())
  }
  code = escodegen.generate(requireAST);
  if (options.writeModuleName) {
    code = "//# " + moduleName + ',size:' + code.length + '\n' + code;
  }
  deps = deps.map(function (elem) {
    return elem.value;
  }).filter(function (elem) {
    return (INGORE_MODULE.indexOf(elem) === -1) && !INCLUDE_MODULE[elem];
  });
  for (let i = 0, n = deps.length; i < n; i++) {
    let dep = deps[i];
    INCLUDE_MODULE[dep] = 1;
    const depCode = await loadModule(dep, options);
    code = depCode + '\n\n' + code;
  }
  return code;
}


var SIMPLE_REQUIRE_CODE = fs.readFileSync(path.join(__dirname, 'simpleRequire.js'), 'utf-8');

const start = async function (config) {
  let result = await loadModule(config.main, config.loadOptions);
  result += "require(['" + config.main + "'])";
  result = SIMPLE_REQUIRE_CODE + '\n' + result;
  console.log('minify start...')
  const minify = UglifyJS.minify(result, {
    compress: false
    /*
    fromString: true,
    output: {
      comments: '/^#/i'
    }
    */
  });
  if ( minify.error ){
    console.log('minify error:');
    return console.error(minify.error);
  }
  result = "//# build time:" + Date.now() + '\n' + minify.code;
  console.log('write file start...', config.output)

  fs.writeFile(config.output, result, function (err) {
    if (err) {
      console.error(err)
    } else {
      console.log('all finish')
    }
  });
}

start(buildConfig);



