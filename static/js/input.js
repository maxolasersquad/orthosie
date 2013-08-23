//    Copyright 2013 Jack David Baucum
//
//    This file is part of Orthosie.
//
//    Orthosie is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    Orthosie is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with Orthosie.  If not, see <http://www.gnu.org/licenses/>.

if (Orthosie === undefined) {
  var Orthosie = {};
}

Orthosie.input = {
  input_mode: 'upc',

  append: function(key) {
    $('#register_input').append(key);
  },

  backspace: function() {
    $('#register_input').html($('#register_input').html().substring(0, $('#register_input').html().length - 1));
  },

  submit: function() {
    switch (Orthosie.input.input_mode) {
      case 'upc':
        post_args = {
          upc: $('#register_input').html(),
          quantity: 1
        };
        post_args[$('#csrf_token>input').attr('name')] = $('#csrf_token>input').attr('value');
        $.ajax({
          url: '/register/process_upc/',
          data: post_args,
          type: 'POST',
          dataType: 'json',
          success: function(data, status) {
            if (data.success) {
              $('#transactions>table tbody:last').after('<tr><td>' + data.vendor + ' ' + data.name + '</td><td>' + data.quantity + ' @ $' + data.price + '</td></tr>');
              $('#sub_total_value').html('$' + data.subtotal);
              $('#tax_total_value').html('$' + data.taxtotal);
              $('#paid_total_value').html('$' + data.paidtotal);
              $('#total_value').html('$' + data.total);
              $('#transactions').scrollTop($("#transactions")[0].scrollHeight);
            }
            else {
              alert(data.error);
            }
          },
          error: function(xhr, text, error) {
            alert('There was an error processing the request.')
          }
        });
        break;
      case 'tender':
        post_args = {
          tender: $('#register_input').html(),
          quantity: 1
        };
        post_args[$('#csrf_token>input').attr('name')] = $('#csrf_token>input').attr('value');
        $.ajax({
          url: '/register/tender_transaction/',
          data: post_args,
          type: 'POST',
          dataType: 'json',
          success: function(data, status) {
            $('#sub_total_value').html('$' + data.subtotal);
            $('#tax_total_value').html('$' + data.taxtotal);
            $('#paid_total_value').html('$' + data.paidtotal);
            $('#total_value').html('$' + data.total);
          },
          error: function(xhr, text, error) {
            alert('There was an error processing the request.')
          }
        });
        break;
        
    }
    $('#register_input').html('');
  },
  set_inputtype: function(type) {
    $('.selected_ringtype').removeClass('selected_ringtype');
    switch (type) {
      case 'upc':
        Orthosie.input.input_mode = 'upc';
        $('#ring_upc').addClass('selected_ringtype');
      break;
      case 'tender':
        Orthosie.input.input_mode = 'tender';
        $('#ring_tender').addClass('selected_ringtype');
      break;
    }
  }
}
