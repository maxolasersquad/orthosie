require(['jquery', 'bootstrap.min'], function($) {

  var input_mode = 'upc';

  document.ready = function () {
    $('#transactions').scrollTop($("#transactions")[0].scrollHeight);
  };
  document.onkeypress = function(e) {
    if (e.keyCode == 13) {
      submit();
    }
    else if (e.keyCode == 32 || (e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 97 && e.keyCode <= 122) || (e.keyCode >= 48 && e.keyCode <= 57)) {
      append(String.fromCharCode(e.keyCode));
    }
  }
  document.onkeydown = function(e) {
    if (e.keyCode == 8) {
      backspace();
    }
  }

  $('.numpad_key').each(function() {
    $(this).click(function() {
      if (!isNaN($(this).data('key'))) {
        append($(this).data('key'));
      }
      else {
        switch ($(this).data('key')) {
          case 'back':
            backspace();
            break;
          case 'enter':
            submit();
            break;
        }
      }
    })
  });

  $('.void-line').each(function() {
    $(this).click(function() {
      void_line($(this).data('id'));
    });
  });

  $('.ringtype').each(function() {
    $(this).click(function() {
      set_inputtype($(this).children('a').data('input-type'));
    });
  });

  $('#confirm-end-shift').click(function() {
    end_shift();
  });

  function backspace() {
    $('#register_input').html($('#register_input').html().substring(0, $('#register_input').html().length - 1));
  };

  function append(key) {
    $('#register_input').append(key);
  };

  function submit() {
    switch (input_mode) {
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
              $('#transactions>table').append('<tr id="line-' + data.id + '"><td>' + data.vendor + ' ' + data.name + '</td><td>' + data.quantity + ' @ $' + data.price + '</td><td><i class="fa fa-times text-danger void-line"></i></td></tr>').click(function() {void_line(data.id)});
              update_totals();
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
        product_search($('#register_input').html());
        break;
    }
    $('#register_input').html('');
  }

  function product_search(search) {
    $('#product_search').load('/register/product_search/?search=' + search + '&csrfmiddlewaretoken=' + $('#csrf_token>input').attr('value'), function() {
        $('#transactions').addClass('hidden');
        $('#product_search').removeClass('hidden');
        $('.search-result').each(function() {
          $(this).click(function() {
            select_item($(this).data('upc'));
          });
        });
        $('#cancel-search').click(function() {
          disable_product_search();
        });
    });
  };

  function void_line(id) {
    post_args = {
      id: id
    };
    post_args[$('#csrf_token>input').attr('name')] = $('#csrf_token>input').attr('value');
    $.ajax({
      url: '/register/cancel_line/',
      data: post_args,
      type: 'POST',
      dataType: 'json',
      success: function(data, status) {
        $('#line-' + id).addClass('danger');
        $('#line-' + id + ' td:nth-child(3)').html('')
        update_totals();
      }
    });
  };

  function update_totals() {
    $.ajax({
      url: '/register/transaction_total',
      dataType: 'json',
      success: function(data) {
        $('#sub_total_value').html('$' + data.subtotal);
        $('#tax_total_value').html('$' + data.taxtotal);
        $('#paid_total_value').html('$' + data.paidtotal);
        $('#total_value').html('$' + data.total);
      }
    })
  }

  function set_inputtype(type) {
    var Type = $('#ringtype-' + type + ' > a').html();
    var header = $('#ringtype > button');
    var selected = $('#ringtype-' + type);
    var foo = $('#ringtype-' + header.attr('data-ringtype'));

    $(header.children()[0]).html(Type);
    selected.css('display', 'none');
    foo.css('display', 'list-item');
    header.attr('data-ringtype', type);
    input_mode = type;
  }

  function end_shift() {
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
  }

  function select_item(item) {
    set_inputtype('upc');
    $('#register_input').html(item.toString() + get_upc_check_digit(item));
    disable_product_search();
  }

  function get_upc_check_digit(upc) {
    upc = upc.toString();
    var check_digit = 0;
    var odd_pos = true;
    for (var i=0;i < upc.length;i++) {
      if (odd_pos) {
        check_digit += parseInt(upc.charAt(i)) * 3;
      }
      else {
        check_digit += parseInt(upc.charAt(i));
      }
      odd_pos = !odd_pos;
    }
    check_digit = (10 - check_digit % 10) % 10;
    return check_digit;
  }

  function disable_product_search() {
    $('#product_search').addClass('hidden');
    $('#transactions').removeClass('hidden');
  }

});
