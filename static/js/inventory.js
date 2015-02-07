require(['jquery', 'bootstrap.min'], function($) {

  $('.vendor-name').each(function() {
    $(this).click(function() {
      edit_vendor($(this).data('upc'));
    });
  });

  $('.inventory-name').each(function() {
    $(this).click(function() {
      edit_name($(this).data('upc'));
    });
  });

  $('.inventory-price').each(function() {
    $(this).click(function() {
      edit_price($(this).data('upc'));
    });
  });

  $('.inventory-scalable').each(function() {
    $(this).click(function() {
      toggle_scalable($(this).data('upc'));
    });
  });

  $('.inventory-taxable').each(function() {
    $(this).click(function() {
      toggle_taxable($(this).data('upc'));
    });
    $('.new-inventory').each(function() {
      $(this).blur(function() {
        switch ($('body').data('tab')) {
            case 'upc':
                new_grocery();
                break;
            default:
                new_produce();
        }
      });
    });
  });

  $('#upc').click(function(){
    $('body').data('tab', 'upc');
  });

  $('#plu').click(function(){
    $('body').data('tab', 'plu');
  });

  function edit_vendor(upc) {
    if ($('#' + upc + '_vendor > input').length == 0) {
      $('#' + upc + '_vendor').html("<input type='text' id='" + upc + "_vendor_edit' class='inventory-vendor-edit' value='" + $('#' + upc + '_vendor').html() + "'>");
      $('#' + upc + '_vendor_edit').focus().blur(function() {
        save_vendor(upc);
      });
    }
  }

  function save_vendor(upc) {
    new_vendor = $('#' + upc + '_vendor_edit').val();
    post_args = {
      upc: upc,
      vendor: new_vendor
    };
    post_args[$('#csrf_token>input').attr('name')] = $('#csrf_token>input').attr('value');

    $.ajax({
      url: '/inventory/update_grocery/',
      data: post_args,
      type: 'POST',
      dataType: 'json',
      success: function(data, status) {
        $('#' + upc + '_vendor').html(data.vendor_name);
      },
      error: function(xhr, text, error) {
        alert('There was an error processing the request.' + '\n' + text + '\n' + error);
      }
    });

  }

  function edit_name(upc) {
    if ($('#' + upc + '_name > input').length == 0) {
      $('#' + upc + '_name').html("<input type='text' id='" + upc + "_name_edit' class='inventory-name-edit' value='" + $('#' + upc + '_name').html() + "'>");
      $('#' + upc + '_name_edit').focus().blur(function() {
        save_name(upc);
      });
    }
  }

  function save_name(upc) {
    new_name = $('#' + upc + '_name_edit').val();
    post_args = {
      upc: upc,
      name: new_name
    };
    post_args[$('#csrf_token>input').attr('name')] = $('#csrf_token>input').attr('value');

    $.ajax({
      url: '/inventory/update_grocery/',
      data: post_args,
      type: 'POST',
      dataType: 'json',
      success: function(data, status) {
        $('#' + upc + '_name').html(data.name);
      },
      error: function(xhr, text, error) {
        alert('There was an error processing the request.' + '\n' + text + '\n' + error);
      }
    });

  }

  function edit_price(upc) {
    if ($('#' + upc + '_price > input').length == 0) {
      $('#' + upc + '_price').html("<input type='number' id='" + upc + "_price_edit' class='inventory-price-edit' value='" + $('#' + upc + '_price').html() + "'>");
      $('#' + upc + '_price_edit').focus().blur(function() {
        save_price(upc);
      });
    }
  }

  function save_price(upc) {
    new_price = $('#' + upc + '_price_edit').val();

    post_args = {
      upc: upc,
      price: new_price
    };
    post_args[$('#csrf_token>input').attr('name')] = $('#csrf_token>input').attr('value');

    $.ajax({
      url: '/inventory/update_grocery/',
      data: post_args,
      type: 'POST',
      dataType: 'json',
      success: function(data, status) {
        $('#' + upc + '_price').html(data.price);
      },
      error: function(xhr, text, error) {
        alert('There was an error processing the request.' + '\n' + text + '\n' + error);
      }
    });

  }

  function toggle_taxable(upc) {
    var taxable;
    if ($('#' + upc + '_taxable').html() == 'Taxable') {
      taxable = false;
    }
    else {
      taxable = true;
    }

    post_args = {
      upc: upc,
      taxable: taxable
    };
    post_args[$('#csrf_token>input').attr('name')] = $('#csrf_token>input').attr('value');

    $.ajax({
      url: '/inventory/update_grocery/',
      data: post_args,
      type: 'POST',
      dataType: 'json',
      success: function(data, status) {
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

  function toggle_scalable(upc) {
    var scalable;
    if ($('#' + upc + '_scalable').html() == 'Scalable') {
      scalable = false;
    }
    else {
      scalable = true;
    }

    post_args = {
      upc: upc,
      scalable: scalable
    };
    post_args[$('#csrf_token>input').attr('name')] = $('#csrf_token>input').attr('value');

    $.ajax({
      url: '/inventory/update_grocery/',
      data: post_args,
      type: 'POST',
      dataType: 'json',
      success: function(data, status) {
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
    if ($('#grocery > input').val() == '' || $('#grocery_vendor > input').val() == '' || $('#grocery_name > input').val() == '' || $('#grocery_price > input').val() == '') {
      return
    }
    else if ($('#grocery_upc :invalid').length === 1) {
      alert('Invalid UPC');
      return;
    }

    var scalable, taxable;
    scalable = $('#grocery_scalable').html() == 'Scalable';
    taxable = $('#grocery_taxable').html() == 'Taxable';

    post_args = {
      upc: $('#grocery_upc > input').val(),
      vendor: $('#grocery_vendor > input').val(),
      name: $('#grocery_name > input').val(),
      price: $('#grocery_price > input').val(),
      scalable: scalable,
      taxable: taxable
    };

    post_args[$('#csrf_token>input').attr('name')] = $('#csrf_token>input').attr('value');

    $.ajax({
      url: '/inventory/create_grocery',
      data: post_args,
      type: 'POST',
      dataType: 'json',
      success: function(data, status) {
        location.reload();
      },
      error: function(xhr, text, error) {
        alert('There was an error processing the request.' + '\n' + text + '\n' + error);
      }
    });
  }

  function new_produce() {
    if ($('#produce_plu > input').val() == '' || $('#produce_name > input').val() == '' || $('#produce_price > input').val() == '') {
      return
    }
    else if ($('#produce_plu :invalid').length === 1) {
      alert('Invalid PLU');
      return;
    }

    var scalable, taxable;
    scalable = $('#produce_scalable').html() == 'Scalable';
    taxable = $('#produce_taxable').html() == 'Taxable';

    post_args = {
      plu: $('#produce_plu > input').val(),
      name: $('#produce_name > input').val(),
      variety: $('#produce_variety > input').val(),
      size: $('#produce_size > input').val(),
      botanical: $('#produce_botanical > input').val(),
      price: $('#produce_price > input').val(),
      scalable: scalable,
      taxable: taxable
    };

    post_args[$('#csrf_token>input').attr('name')] = $('#csrf_token>input').attr('value');

    $.ajax({
      url: '/inventory/create_produce',
      data: post_args,
      type: 'POST',
      dataType: 'json',
      success: function(data, status) {
        location.reload();
      },
      error: function(xhr, text, error) {
        alert('There was an error processing the request.' + '\n' + text + '\n' + error);
      }
    });
  }

});
