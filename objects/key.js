// ----------- Key Object -----------

// The key class stores the most recently pressed key.
// We examine last_key_pressed on each loop.

var Key = {
  last_key_pressed: null,

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,

  onKeydown: function(event) {
    this.last_key_pressed = event.keyCode;
  },
};