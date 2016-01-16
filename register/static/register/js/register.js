require(['/static/js/config.js'], function () {
  'use strict';
  require(['jquery', 'bootstrap'], function($) {
    var input_mode = 'upc';

    function update_totals() {
      $.ajax({
        url: '/transactions/' + $('#input').data('transaction-id') + '/get_totals/',
        dataType: 'json'
      })
        /**
         * @param {{sub_total, tax_total, paid_total, total}} data
         */
        .done(function(data){
        $('#sub_total_value').html('$' + data.sub_total);
        $('#tax_total_value').html('$' + data.tax_total);
        $('#paid_total_value').html('$' + data.paid_total);
        $('#total_value').html('$' + data.total);
      });
    }

    function void_line(id) {
      var csrf_token_input = $('#csrf_token').find('input'),
        post_args = {
          id: id
        };
      post_args[csrf_token_input.attr('name')] = csrf_token_input.attr('value');
      $.ajax({
        url: '/line-items/' + id + '/cancel/',
        data: post_args,
        type: 'POST',
        dataType: 'json'
      }).done(function(){
        $('#line-' + id).addClass('danger');
        $('#line-' + id + ' td:nth-child(3)').html('');
        update_totals();
      });
    }

    function set_inputtype(type) {
      var Type = $('#ringtype-' + type + ' > a').html(),
        header = $('#ringtype').find('button'),
        selected = $('#ringtype-' + type),
        foo = $('#ringtype-' + header.attr('data-ringtype'));

      $(header.children()[0]).html(Type);
      selected.css('display', 'none');
      foo.css('display', 'list-item');
      header.attr('data-ringtype', type);
      input_mode = type;
    }

    function get_upc_check_digit(upc) {
      upc = upc.toString();
      var check_digit = 0,
        odd_pos = true,
        i;
      for (i=0; i < upc.length; i++) {
        if (odd_pos) {
          check_digit += parseInt(upc.charAt(i), 10) * 3;
        }
        else {
          check_digit += parseInt(upc.charAt(i), 10);
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

    function select_item(item) {
      set_inputtype('upc');
      if (item.toString().length === 11) {
        $('#register_input').html(item.toString() + get_upc_check_digit(item));
      } else {
        $('#register_input').html(item.toString());
      }
      disable_product_search();
    }

    function product_search(search) {
      $('#product_search').load('/register/product_search/?search=' + search + '&csrfmiddlewaretoken=' + $('#csrf_token').find('input').attr('value'), function() {
        $('#transactions').addClass('hidden');
        $('#product_search').removeClass('hidden');
        $('.grocery-search-result').each(function() {
          $(this).click(function() {
            select_item($(this).data('upc'));
          });
        });
        $('.produce-search-result').each(function() {
          $(this).click(function() {
            select_item($(this).data('plu'));
          });
        });
        $('#cancel-search').click(function() {
          disable_product_search();
        });
      });
    }

    function append(key) {
      $('#register_input').append(key);
    }

    function backspace() {
      var register_input = $('#register_input');
      register_input.html(register_input.html().substring(0, register_input.html().length - 1));
    }

    function submit() {
      var register_input = $('#register_input'),
        csrf_token_input = $('#csrf_token').find('input'),
        transactions = $('#transactions'),
        transaction_id = $('#input').data('transaction-id'),
        post_args = {};
      switch (input_mode) {
        case 'upc':
          post_args = {
            upc: register_input.html(),
            quantity: 1
          };
          post_args[csrf_token_input.attr('name')] = csrf_token_input.attr('value');
          $.ajax({
            url: '/transactions/' + transaction_id + '/ring_upc/',
            data: post_args,
            type: 'POST',
            dataType: 'json'
          })
            /**
             * @param {{description, url}} data
             */
            .done(function(data){
            if (transactions.data('status') === 'end') {
              transactions.find('table').find('tbody').html('');
              transactions.data('status', 'ring');
            }
            var parser = document.createElement('a'),
              id = parser.pathname.match(/[0-9]+/);
            parser.href = data.url;
            transactions.find('table').append('<tr id="line-' + id + '"><td>' + data.description + '</td><td>' + data.quantity + ' @ $' + data.price + '</td><td><i class="fa fa-times text-danger void-line"></i></td></tr>').click(function() {void_line(data.id);});
            update_totals();
            transactions.scrollTop(transactions[0].scrollHeight);
          }).fail(function(){
            alert('There was an error processing the request.');
          });
          break;
        case 'tender':
          post_args = {
            tender: register_input.html(),
            quantity: 1
          };
          post_args[csrf_token_input.attr('name')] = csrf_token_input.attr('value');
          $.ajax({
            url: '/transactions/' + transaction_id + '/tender_transaction/',
            data: post_args,
            type: 'POST',
            dataType: 'json'
          })
            /**
             * @param {{subtotal, taxtotal, paidtotal}} data
             */
            .done(function(data) {
            if (data.total <= 0) {
              transactions.data('status', 'end');
            }
            $('#sub_total_value').html('$' + data.subtotal);
            $('#tax_total_value').html('$' + data.taxtotal);
            $('#paid_total_value').html('$' + data.paidtotal);
            $('#total_value').html('$' + data.total);
            if (data.message !== '') {
              var div = document.createElement('div');
              div.innerHTML = data.message;
              alert(div.firstChild.nodeValue);
            }
          }).fail(function(){
            alert('There was an error processing the request.');
          });
          break;
        case 'product-search':
          product_search(register_input.html());
          break;
      }
      register_input.html('');
    }

    document.ready = function () {
      var transactions = $('#transactions');
      transactions.scrollTop(transactions[0].scrollHeight);
    };
    document.onkeypress = function(e) {
      if (e.keyCode === 13) {
        submit();
      }
      else if (e.keyCode === 32 || (e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 97 && e.keyCode <= 122) || (e.keyCode >= 48 && e.keyCode <= 57)) {
        append(String.fromCharCode(e.keyCode));
      }
    };
    document.onkeydown = function(e) {
      if (e.keyCode === 8) {
        backspace();
      }
    };

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
      });
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

    function end_shift() {
      $.ajax({
        url: '/shifts/'+ $('#input').data('shift-id') + '/end/',
        type: 'post',
        dataType: 'json'
      }).done(function(){
        $('#confirm_endshift').find('div').modal('hide');
      }).fail(function(){
        alert('An error was encountered while trying to end the shift.');
      });
    }

    $('#confirm-end-shift').click(function() {
      end_shift();
    });

    function cancel_transaction() {
      $.ajax({
        url: '/transactions/' + $('#input').data('transaction-id') + '/cancel/',
        type: 'post',
        dataType: 'json'
      }).done(function(){
        $('#confirm_cancel_transaction').find('div').modal('hide');
        $('#transactions').data('status', 'end');
        $('#transactions'.find('table').find('tbody').find('tr')).remove();
        update_totals();
      }).fail(function(){
        alert('An error was encountered while trying to cancel this transaction.');
      });
    }

    $('#confirm-cancel-transaction').click(function() {
      cancel_transaction();
    });
  });
});
