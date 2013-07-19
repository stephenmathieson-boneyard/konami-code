
'use strict';

var ev = require('event'),
    keyname = require('keyname');

/**
 * Invoke `fn` when the Konami Code is entered
 *
 * @api public
 * @param {HTMLElement} [element]
 * @param {Function} fn
 * @return {Function} bound keydown listener
 */
exports = module.exports = function (element, fn) {
  if (typeof element === 'function') {
    fn = element;
    element = window;
  }

  var arr = exports.code,
      index = 0,
      done = arr.length;

  return ev.bind(element, 'keydown', function (keyboardEvent) {
    var which = keyboardEvent.which,
        name = keyname(which) || String.fromCharCode(which).toLowerCase();

    if (arr[index] === name) {
      index++;
    } else {
      index = 0;
    }

    if (index === done) {
      fn();
      index = 0;
    }
  });
};

// ↑ ↑ ↓ ↓ ← → ← → b a
exports.code = [ 'up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a' ];
