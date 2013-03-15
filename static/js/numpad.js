if (Orthosie === undefined) {
  var Orthosie = {};
}

Orthosie.numpad = {
  append: function(key) {
  console.log(key);
    $('#register_input').append(key);
  },
  backspace: function() {
    $('#register_input').html($('#register_input').html().substring(0, $('#register_input').html().length - 1));
  }
}
