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
              if ($('#transactions').data('status') == 'end') {
                $('#transactions>table>tbody').html('');
                $('#transactions').data('status', 'ring');
              }
              $('#transactions>table').append('<tr><td>' + data.vendor + ' ' + data.name + '</td><td>' + data.quantity + ' @ $' + data.price + '</td></tr>');
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
            alert('There was an error processing the request.');
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
            if (data.total <= 0) {
              $('#transactions').data('status', 'end');
            }
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
      case 'product-search':
        Orthosie.input.product_search($('#register_input').html());
        break;
    }
    $('#register_input').html('');
  },
  set_inputtype: function(type) {
    var Type = $('#ringtype-' + type + ' > a').html();
    var header = $('#ringtype > button');
    var selected = $('#ringtype-' + type);
    var foo = $('#ringtype-' + header.attr('data-ringtype'));

    $(header.children()[0]).html(Type);
    selected.css('display', 'none');
    foo.css('display', 'list-item');
    header.attr('data-ringtype', type);
    Orthosie.input.input_mode = type;
  },
  end_shift: function() {
    $.ajax({
      url: '/register/end_shift/',
      dataType: 'json',
      success: function(data, status) {
        $('#confirm_endshift > div').modal('hide');
      },
      error: function(xhr, text, error) {
        alert('An error was encountered while trying to end the shift.')
      }
    });
  },
  product_search: function(search) {
    $('#product_search').load('/register/product_search/?search=' + search + '&csrfmiddlewaretoken=' + $('#csrf_token>input').attr('value'), function() {
        $('#transactions').addClass('hidden');
        $('#product_search').removeClass('hidden');
    });
  },
  disable_product_search: function() {
    $('#product_search').addClass('hidden');
    $('#transactions').removeClass('hidden');
  }
}
