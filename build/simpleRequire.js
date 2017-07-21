;(function () {
  var MODULES = {};
  var Mod = function (name, deps, factory) {
    this.name = name;
    this.deps = deps;
    this.factory = factory;
    this.instance = null
    this.init = function () {
      if (this.instance) {
        return;
      }
      var _module = {
        exports: {}
      };
      var depsModule = this.deps.map(function (dep) {
        switch (dep){
          case 'module':
            return _module
          case 'require':
            return require;
          case 'exports':
            return _module.exports;
          default:
            var depMod = MODULES[dep];
            depMod.init();
            return depMod.instance;
        }
      })
      if (this.deps.length === 0) {
        depsModule = [require, _module.exports, _module];
      }
      var ref = this.factory.apply(null, depsModule);
      // 优先使用return的值
      this.instance = ref || _module.exports;
    }
  }
  var define = function (moduleName, deps, factory) {
    if (arguments.length === 2) {
      factory = arguments[arguments.length - 1];
      if (typeof moduleName !== 'string') {
        // define([], factory)
        deps = moduleName;
        moduleName = 'unknow';
      } else {
        // define(name, factory)
        deps = [];
      }
    }
    MODULES[moduleName] = new Mod(moduleName, deps, factory);
  }
  var require = function (moduleID) {
    var mod = MODULES[moduleID];
    if (!mod) {
      return undefined;
    }
    mod.init();
    return mod.instance;
  }
  define.amd = true;
  window.define = define;
  window.require = require;

  define('module', function () {

  })


})();
