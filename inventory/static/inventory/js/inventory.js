require(['/static/js/config.js'], function () {
  require(['jquery', 'bootstrap'], function($) {

    $('.vendor-name').click(function() {
      edit_vendor($(this).data('upc'));
    });

    $('.grocery-name').click(function() {
      edit_name($(this).data('upc'));
    });

    $('.grocery-price').click(function() {
      edit_price($(this).data('upc'));
    });

    $('.grocery-scalable').click(function() {
      toggle_grocery_scalable($(this).data('upc'));
    });

    $('.grocery-taxable').each(function() {
      $(this).click(function() {
        toggle_grocery_taxable($(this).data('upc'));
      });
      $('.new-inventory').each(function() {
        $(this).blur(function() {
          if ( $('body').data('tab') === 'upc' ) {
            new_grocery();
          }
          else {
            new_produce();
          }
        });
      });
    });

    $('.produce-name').click(function() {
      edit_produce_name($(this).data('plu'));
    });

    $('.produce-variety').click(function() {
      edit_produce_variety($(this).data('plu'));
    });

    $('.produce-size').click(function() {
      edit_produce_size($(this).data('plu'));
    });

    $('.produce-botanical').click(function() {
      edit_produce_botanical($(this).data('plu'));
    });

    $('.produce-price').click(function() {
      edit_produce_price($(this).data('plu'));
    });

    $('.produce-scalable').click(function() {
      toggle_produce_scalable($(this).data('plu'));
    });

    $('.produce-taxable').click(function() {
      toggle_produce_taxable($(this).data('plu'));
    });

    $('#upc').click(function(){
      $('body').data('tab', 'upc');
    });

    $('#plu').click(function(){
      $('body').data('tab', 'plu');
    });

    function edit_vendor(upc) {
      var upc_vendor = $('#' + upc + '_vendor');
      if (upc_vendor.find('input').length === 0) {
        upc_vendor.html('<input type="text" id="' + upc + '_vendor_edit" class="grocery-edit grocery-vendor-edit" value="' + upc_vendor.html() + '">');
        $('#' + upc + '_vendor_edit').focus().blur(function() {
          save_vendor(upc);
        });
      }
    }

    function save_vendor(upc) {
      var new_vendor = $('#' + upc + '_vendor_edit').val(),
        id = get_id_from_upc(upc);

      $.ajax({
        url: '/groceries/' + id + '/update_vendor/',
        data: { vendor: new_vendor },
        type: 'POST',
        dataType: 'json',
        success: function(data) {
          $('#' + upc + '_vendor').html(data.vendor.name);
        },
        error: function(xhr, text, error) {
          alert('There was an error processing the request.' + '\n' + text + '\n' + error);
        }
      });

    }

    function edit_name(upc) {
      var upc_name = $('#' + upc + '_name');
      if (upc_name.find('input').length === 0) {
        upc_name.html("<input type='text' id='" + upc + "_name_edit' class='grocery-name-edit' value='" + upc_name.html() + "'>");
        $('#' + upc + '_name_edit').focus().blur(function() {
          save_name(upc);
        });
      }
    }

    function save_name(upc) {
      var new_name = $('#' + upc + '_name_edit').val(),
        id = get_id_from_upc(upc);

      $.ajax({
        url: '/groceries/' + id + '/update_name/',
        data: { name: new_name },
        type: 'POST',
        dataType: 'json',
        success: function(data) {
          $('#' + upc + '_name').html(data.name);
        },
        error: function(xhr, text, error) {
          alert('There was an error processing the request.' + '\n' + text + '\n' + error);
        }
      });

    }

    function edit_price(upc) {
      if ($('#' + upc + '_price > input').length === 0) {
        var upc_price = $('#' + upc + '_price');
        upc_price.html("<input type='number' id='" + upc + "_price_edit' class='grocery-price-edit' value='" + upc_price.html() + "'>");
        $('#' + upc + '_price_edit').focus().blur(function() {
          save_price(upc);
        });
      }
    }

    function save_price(upc) {
      var new_price = $('#' + upc + '_price_edit').val(),
        id = get_id_from_upc(upc);

      $.ajax({
        url: '/groceries/' + id + '/update_price/',
        data: { price: new_price },
        type: 'POST',
        dataType: 'json',
        success: function(data) {
          $('#' + upc + '_price').html(data.price);
        },
        error: function(xhr, text, error) {
          alert('There was an error processing the request.' + '\n' + text + '\n' + error);
        }
      });

    }

    function toggle_grocery_taxable(upc) {
      var taxable = !($('#' + upc + '_taxable').html() == 'Taxable'),
        id = get_id_from_upc(upc);

      $.ajax({
        url: '/groceries/' + id + '/update_taxable/',
        data: { taxable: taxable },
        type: 'POST',
        dataType: 'json',
        success: function(data) {
          if (data.taxable) {
            $('#' + upc + '_taxable').html('Taxable');
          }
          else {
            $('#' + upc + '_taxable').html('Non-Taxable');
          }
        },
        error: function(xhr, text, error) {
          alert('There was an error processing the request.' + '\n' + text + '\n' + error);
        }
      });

    }

    function toggle_grocery_scalable(upc) {
      var scalable = !($('#' + upc + '_scalable').html() == 'Scalable'),
        id = get_id_from_upc(upc);

      $.ajax({
        url: '/groceries/' + id + '/update_scalable/',
        data: { scalable: scalable },
        type: 'POST',
        dataType: 'json',
        success: function(data) {
          if (data.scalable) {
            $('#' + upc + '_scalable').html('Scalable');
          }
          else {
            $('#' + upc + '_scalable').html('Non-Scalable');
          }
        },
        error: function(xhr, text, error) {
          alert('There was an error processing the request.' + '\n' + text + '\n' + error);
        }
      });

    }

    function new_grocery() {
      var grocery_input = $('#grocery').find('input'),
        grocery_vendor_input = $('#grocery_vendor').find('input'),
        grocery_name_input = $('#grocery_name').find('input'),
        grocery_price_input = $('#grocery_price').find('input'),
        grocery_upc_input = $('#grocery_upc').find('input');
      if (grocery_input.val() === '' || grocery_vendor_input.val() === '' || grocery_name_input.val() === '' || grocery_price_input.val() === '') {
        return;
      }
      else if (grocery_upc_input.find(':invalid').length === 1) {
        alert('Invalid UPC');
        return;
      }

      var scalable = $('#grocery_scalable').html() == 'Scalable',
        taxable = $('#grocery_taxable').html() == 'Taxable',
        csrf_token_input = $('#csrf_token').find('input'),
        post_args = {
          upc: grocery_upc_input.val(),
          vendor: grocery_vendor_input.val(),
          name: grocery_name_input.val(),
          price: grocery_price_input.val(),
          scalable: scalable,
          taxable: taxable
        };

      post_args[csrf_token_input.attr('name')] = csrf_token_input.attr('value');

      $.ajax({
        url: '/groceries/',
        data: post_args,
        type: 'POST',
        dataType: 'json',
        success: function(data) {
          console.log(data);
          //location.reload();
        },
        error: function(xhr, text, error) {
          alert('There was an error processing the request.' + '\n' + text + '\n' + error);
        }
      });
    }

    function get_id_from_upc(upc) {
      return $('#' + upc).data('id');
    }

    function edit_produce_name(plu) {
      var plu_name = $('#' + plu + '_name');
      if (plu_name.find('input').length === 0) {
        plu_name.html('<input type="text" placeholder="Name" id="' + plu + '_name_edit" class="produce-name-edit" value="' + plu_name.html() + '">');
        $('#' + plu + '_name_edit').focus().blur(function() {
          save_produce_name(plu);
        });
      }
    }

    function save_produce_name(plu) {
      var new_name = $('#' + plu + '_name_edit').val(),
        id = get_id_from_plu(plu);

      $.ajax({
        url: '/produce/' + id + '/update_name/',
        data: { name: new_name },
        type: 'POST',
        dataType: 'json',
        success: function(data) {
          $('#' + plu + '_name').html(data.name);
        },
        error: function(xhr, text, error) {
          alert('There was an error processing the request.' + '\n' + text + '\n' + error);
          $('#' + plu + '_name').focus();
        }
      });

    }

    function edit_produce_variety(plu) {
      var plu_variety = $('#' + plu + '_variety');
      if (plu_variety.find('input').length === 0) {
        plu_variety.html('<input type="text" placeholder="Variety" id="' + plu + '_variety_edit" class="produce-variety-edit" value="' + plu_variety.html() + '">');
        $('#' + plu + '_variety_edit').focus().blur(function() {
          save_produce_variety(plu);
        });
      }
    }

    function save_produce_variety(plu) {
      var new_variety = $('#' + plu + '_variety_edit').val(),
        id = get_id_from_plu(plu);

      $.ajax({
        url: '/produce/' + id + '/update_variety/',
        data: { variety: new_variety },
        type: 'POST',
        dataType: 'json',
        success: function(data) {
          $('#' + plu + '_variety').html(data.variety);
        },
        error: function(xhr, text, error) {
          alert('There was an error processing the request.' + '\n' + text + '\n' + error);
          $('#' + plu + '_variety').focus();
        }
      });
    }

    function edit_produce_size(plu) {
      var plu_size = $('#' + plu + '_size');
      if (plu_size.find('input').length === 0) {
        plu_size.html('<input type="text" placeholder="Size" id="' + plu + '_size_edit" class="produce-size-edit" value="' + plu_size.html() + '">');
        $('#' + plu + '_size_edit').focus().blur(function() {
          save_produce_size(plu);
        });
      }
    }

    function save_produce_size(plu) {
      var new_size = $('#' + plu + '_size_edit').val(),
        id = get_id_from_plu(plu);

      $.ajax({
        url: '/produce/' + id + '/update_size/',
        data: { size: new_size },
        type: 'POST',
        dataType: 'json',
        success: function(data) {
          $('#' + plu + '_size').html(data.size);
        },
        error: function(xhr, text, error) {
          alert('There was an error processing the request.' + '\n' + text + '\n' + error);
          $('#' + plu + '_size').focus();
        }
      });
    }

    function edit_produce_botanical(plu) {
      var plu_botanical = $('#' + plu + '_botanical');
      if (plu_botanical.find('input').length === 0) {
        plu_botanical.html('<input type="text" placeholder="Botanical" id="' + plu + '_botanical_edit" class="produce-botanical-edit" value="' + plu_botanical.html() + '">');
        $('#' + plu + '_botanical_edit').focus().blur(function() {
          save_produce_botanical(plu);
        });
      }
    }

    function save_produce_botanical(plu) {
      var new_botanical = $('#' + plu + '_botanical_edit').val(),
        id = get_id_from_plu(plu);

      $.ajax({
        url: '/produce/' + id + '/update_botanical/',
        data: { botanical: new_botanical },
        type: 'POST',
        dataType: 'json',
        success: function(data) {
          $('#' + plu + '_botanical').html(data.botanical);
        },
        error: function(xhr, text, error) {
          alert('There was an error processing the request.' + '\n' + text + '\n' + error);
          $('#' + plu + '_botanical').focus();
        }
      });
    }


    function edit_produce_price(plu) {
      var plu_price = $('#' + plu + '_price');
      if (plu_price.find('input').length === 0) {
        plu_price.html('<input type="number" id="' + plu + '_price_edit" class="produce-price-edit" value="' + plu_price.html() + '">');
        $('#' + plu + '_price_edit').focus().blur(function() {
          save_produce_price(plu);
        });
      }
    }

    function save_produce_price(plu) {
      var new_price = $('#' + plu + '_price_edit').val(),
        id = get_id_from_plu(plu);

      $.ajax({
        url: '/produce/' + id + '/update_price/',
        data: { price: new_price },
        type: 'POST',
        dataType: 'json',
        success: function(data) {
          $('#' + plu + '_price').html(data.price);
        },
        error: function(xhr, text, error) {
          alert('There was an error processing the request.' + '\n' + text + '\n' + error);
          $('#' + plu + '_price').focus();
        }
      });

    }

    function toggle_produce_scalable(plu) {
      var scalable = !($('#' + plu + '_scalable').html() == 'Scalable'),
        id = get_id_from_upc(plu);

      $.ajax({
        url: '/produce/' + id + '/update_scalable/',
        data: { scalable: scalable },
        type: 'POST',
        dataType: 'json',
        success: function(data) {
          if (data.scalable) {
            $('#' + plu + '_scalable').html('Scalable');
          }
          else {
            $('#' + plu + '_scalable').html('Non-Scalable');
          }
        },
        error: function(xhr, text, error) {
          alert('There was an error processing the request.' + '\n' + text + '\n' + error);
        }
      });

    }

    function toggle_produce_taxable(plu) {
      var taxable = !($('#' + plu + '_taxable').html() == 'Taxable'),
        id = get_id_from_upc(plu);

      $.ajax({
        url: '/produce/' + id + '/update_taxable/',
        data: { taxable: taxable },
        type: 'POST',
        dataType: 'json',
        success: function(data) {
          if (data.taxable) {
            $('#' + plu + '_taxable').html('Taxable');
          }
          else {
            $('#' + plu + '_taxable').html('Non-Taxable');
          }
        },
        error: function(xhr, text, error) {
          alert('There was an error processing the request.' + '\n' + text + '\n' + error);
        }
      });

    }

    function get_id_from_plu(plu) {
      return get_id_from_upc(plu);
    }

    function new_produce() {
      var produce_plu_input = $('#produce_plu').find('input'),
        produce_name_input = $('#produce_name').find('input'),
        produce_price_input = $('#produce_price').find('input'),
        produce_variety_input = $('#produce_variety').find('input'),
        produce_size_input = $('#produce_size').find('input'),
        produce_botanical_input = $('#produce_botanical').find('input');
      if (produce_plu_input.val() === '' || produce_name_input.val() === '' || produce_price_input.val() === '') {
        return;
      }
      else if (produce_plu_input.find(':invalid').length === 1) {
        alert('Invalid PLU');
        return;
      }

      var scalable = $('#produce_scalable').html() == 'Scalable',
        taxable = $('#produce_taxable').html() == 'Taxable',
        csrf_token_input = $('#csrf_token').find('input'),
        produce_list_tr_last = $('#produce-list').find('tr:last'),
        post_args = {
          plu: produce_plu_input.val(),
          name: produce_name_input.val(),
          variety: produce_variety_input.val(),
          size: produce_size_input.val(),
          botanical: produce_botanical_input.val(),
          price: produce_price_input.val(),
          scalable: scalable,
          taxable: taxable
        };

      post_args[csrf_token_input.attr('name')] = csrf_token_input.attr('value');

      $.ajax({
        url: '/inventory/create_produce',
        data: post_args,
        type: 'POST',
        dataType: 'json',
        success: function(data) {
          produce_list_tr_last.find('input').val('');
          produce_list_tr_last.before(
            '<tr id="' + data.plu + '" class="grocery-row">' +
            '<td id="' + data.plu + '_plu" class="produce-plu form-control-static">' + data.plu + '</td>' +
            '<td id="' + data.plu + '_name" class="form-control-static">' + data.name + '</td>' +
            '<td id="' + data.plu + '_variety" class="form-control-static">' + data.variety + '</td>' +
            '<td id="' + data.plu + '_size" class="form-control-static">' + data.size + '</td>' +
            '<td id="' + data.plu + '_botanical" class="form-control-static">' + data.botanical + '</td>' +
            '<td id="' + data.plu + '_price " class="form-control-static">' + data.price + '</td>' +
            '<td id="' + data.upc + '_scalable" class="produce-scalable" data-upc="' + data.upc + '</td>' +
            '<td id="' + data.upc + '_taxable" class="grocery-taxable" data-upc="' + data.upc + '</td>' +
            '<td id="' + data.upc + '_scalable" class="grocery-scalable" data-upc="' + data.upc + '">' + (!data.scalable?'Non-':'') + 'Scalable</td>' +
            '<td id="' + data.upc + '_taxable" class="grocery-taxable" data-upc="' + data.upc + '">' + (!data.taxable?'Non-':'') + 'Taxable</td>' +
            '</tr>'
          );
        },
        error: function(xhr, text, error) {
          alert('There was an error processing the request.' + '\n' + text + '\n' + error);
        }
      });
    }

  });
});
