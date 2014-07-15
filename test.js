var test = require('tape')
var replace = require('./')

test('replace css selector classes', function(t) {
  t.plan(1)

  var r = {
    hawk: 'red',
    eagle: 'blue'
  }
  t.equal(replace('.hawk .eagle > .yep', r), '.red .blue > .yep', 'should map css classes properly')
})
