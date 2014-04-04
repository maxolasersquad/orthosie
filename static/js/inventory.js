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
        new_inventory();
      });
    });
  });

  function edit_vendor(upc) {
    if ($('#' + upc + '_vendor > input').length == 0) {
      $('#' + upc + '_vendor').html("<input type='text' id='" + upc + "_vendor_edit' class='inventory_vendor_edit' value='" + $('#' + upc + '_vendor').html() + "'>");
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
      url: '/inventory/update_inventory/',
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
      $('#' + upc + '_name').html("<input type='text' id='" + upc + "_name_edit' class='inventory_name_edit' value='" + $('#' + upc + '_name').html() + "'>");
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
      url: '/inventory/update_inventory/',
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
      $('#' + upc + '_price').html("<input type='number' id='" + upc + "_price_edit' class='inventory_price_edit' value='" + $('#' + upc + '_price').html() + "'>");
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
      url: '/inventory/update_inventory/',
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
      url: '/inventory/update_inventory/',
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
      url: '/inventory/update_inventory/',
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

  function new_inventory() {
    if ($('#input_upc > input').val() == '' || $('#input_vendor > input').val() == '' || $('#input_name > input').val() == '' || $('#input_price > input').val() == '') {
      console.log('Fail');
      return
    }
    else if ($('#input_upc :invalid').length === 1) {
      alert('Invalid UPC');
      return;
    }

    var scalable, taxable;
    scalable = $('#input_scalable').html() == 'Scalable';
    taxable = $('#input_taxable').html() == 'Taxable';

    post_args = {
      upc: $('#input_upc > input').val(),
      vendor: $('#input_vendor > input').val(),
      name: $('#input_name > input').val(),
      price: $('#input_price > input').val(),
      scalable: scalable,
      taxable: taxable
    };

    post_args[$('#csrf_token>input').attr('name')] = $('#csrf_token>input').attr('value');

    $.ajax({
      url: '/inventory/create_inventory/',
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
