
# konami-code

Execute a callback when the Konami Code is entered

## Installation

Install with [component(1)](http://component.io):

    $ component install stephenmathieson/konamicode

## API

`konamicode([element], fn)`

Bind a `keydown` listener to `element` and invoke `fn` when the Konami Code is entered.

## Example

```js
var konami = require('konami-code');

// bind to the window
konami(function () {
  alert('hooray')
});

// bind to #foo
konami(document.getElementById('foo'), function () {
  alert('hooray');
});
```

## License

  MIT
