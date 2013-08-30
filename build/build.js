
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("component-event/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Bind `el` event `type` to `fn`.\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} type\n\
 * @param {Function} fn\n\
 * @param {Boolean} capture\n\
 * @return {Function}\n\
 * @api public\n\
 */\n\
\n\
exports.bind = function(el, type, fn, capture){\n\
  if (el.addEventListener) {\n\
    el.addEventListener(type, fn, capture || false);\n\
  } else {\n\
    el.attachEvent('on' + type, fn);\n\
  }\n\
  return fn;\n\
};\n\
\n\
/**\n\
 * Unbind `el` event `type`'s callback `fn`.\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} type\n\
 * @param {Function} fn\n\
 * @param {Boolean} capture\n\
 * @return {Function}\n\
 * @api public\n\
 */\n\
\n\
exports.unbind = function(el, type, fn, capture){\n\
  if (el.removeEventListener) {\n\
    el.removeEventListener(type, fn, capture || false);\n\
  } else {\n\
    el.detachEvent('on' + type, fn);\n\
  }\n\
  return fn;\n\
};\n\
//@ sourceURL=component-event/index.js"
));
require.register("component-keyname/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Key name map.\n\
 */\n\
\n\
var map = {\n\
  8: 'backspace',\n\
  9: 'tab',\n\
  13: 'enter',\n\
  16: 'shift',\n\
  17: 'ctrl',\n\
  18: 'alt',\n\
  20: 'capslock',\n\
  27: 'esc',\n\
  32: 'space',\n\
  33: 'pageup',\n\
  34: 'pagedown',\n\
  35: 'end',\n\
  36: 'home',\n\
  37: 'left',\n\
  38: 'up',\n\
  39: 'right',\n\
  40: 'down',\n\
  45: 'ins',\n\
  46: 'del',\n\
  91: 'meta',\n\
  93: 'meta',\n\
  224: 'meta'\n\
};\n\
\n\
/**\n\
 * Return key name for `n`.\n\
 *\n\
 * @param {Number} n\n\
 * @return {String}\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(n){\n\
  return map[n];\n\
};//@ sourceURL=component-keyname/index.js"
));
require.register("konami-code/index.js", Function("exports, require, module",
"\n\
'use strict';\n\
\n\
var ev = require('event'),\n\
    keyname = require('keyname');\n\
\n\
/**\n\
 * Invoke `fn` when the Konami Code is entered\n\
 *\n\
 * @api public\n\
 * @param {HTMLElement} [element]\n\
 * @param {Function} fn\n\
 * @return {Function} bound keydown listener\n\
 */\n\
exports = module.exports = function (element, fn) {\n\
  if (typeof element === 'function') {\n\
    fn = element;\n\
    element = window;\n\
  }\n\
\n\
  var arr = exports.code,\n\
      index = 0,\n\
      done = arr.length;\n\
\n\
  return ev.bind(element, 'keydown', function (keyboardEvent) {\n\
    var which = keyboardEvent.which,\n\
        name = keyname(which) || String.fromCharCode(which).toLowerCase();\n\
\n\
    if (arr[index] === name) {\n\
      index++;\n\
    } else {\n\
      index = 0;\n\
    }\n\
\n\
    if (index === done) {\n\
      fn();\n\
      index = 0;\n\
    }\n\
  });\n\
};\n\
\n\
// ↑ ↑ ↓ ↓ ← → ← → b a\n\
exports.code = [ 'up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a' ];\n\
//@ sourceURL=konami-code/index.js"
));


require.alias("component-event/index.js", "konami-code/deps/event/index.js");
require.alias("component-event/index.js", "event/index.js");

require.alias("component-keyname/index.js", "konami-code/deps/keyname/index.js");
require.alias("component-keyname/index.js", "keyname/index.js");

require.alias("konami-code/index.js", "konami-code/index.js");