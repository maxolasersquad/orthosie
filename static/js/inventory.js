require(['./config'], function (config) {
  require(['jquery', 'bootstrap.min'], function($) {

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
      if ($('#' + upc + '_vendor > input').length === 0) {
        $('#' + upc + '_vendor').html("<input type='text' id='" + upc + "_vendor_edit' class='grocery-vendor-edit' value='" + $('#' + upc + '_vendor').html() + "'>");
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
      if ($('#' + upc + '_name > input').length === 0) {
        $('#' + upc + '_name').html("<input type='text' id='" + upc + "_name_edit' class='grocery-name-edit' value='" + $('#' + upc + '_name').html() + "'>");
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
      if ($('#' + upc + '_price > input').length === 0) {
        $('#' + upc + '_price').html("<input type='number' id='" + upc + "_price_edit' class='grocery-price-edit' value='" + $('#' + upc + '_price').html() + "'>");
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

    function toggle_grocery_taxable(upc) {
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

    function toggle_grocery_scalable(upc) {
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
      if ($('#grocery > input').val() === '' || $('#grocery_vendor > input').val() === '' || $('#grocery_name > input').val() === '' || $('#grocery_price > input').val() === '') {
        return;
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
      if ($('#produce_plu > input').val() === '' || $('#produce_name > input').val() === '' || $('#produce_price > input').val() === '') {
        return;
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
            $('#produce-list tr:last').find('input').val('');
            $('#produce-list tr:last').before(
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

    function edit_produce_name(plu) {
      if ($('#' + plu + '_name > input').length === 0) {
        $('#' + plu + '_name').html('<input type="text" placeholder="Name" id="' + plu + '_name_edit" class="produce-name-edit" value="' + $('#' + plu + '_name').html() + '">');
        $('#' + plu + '_name_edit').focus().blur(function() {
          save_produce_name(plu);
        });
      }
    }

    function save_produce_name(plu) {
      new_name = $('#' + plu + '_name_edit').val();

      post_args = {
        plu: plu,
        name: new_name
      };
      post_args[$('#csrf_token>input').attr('name')] = $('#csrf_token>input').attr('value');

      $.ajax({
        url: '/inventory/update_produce/',
        data: post_args,
        type: 'POST',
        dataType: 'json',
        success: function(data, status) {
          $('#' + plu + '_name').html(data.name);
        },
        error: function(xhr, text, error) {
          alert('There was an error processing the request.' + '\n' + text + '\n' + error);
          $('#' + plu + '_name').focus();
        }
      });

    }

    function edit_produce_variety(plu) {
      if ($('#' + plu + '_variety > input').length === 0) {
        $('#' + plu + '_variety').html('<input type="text" placeholder="Variety" id="' + plu + '_variety_edit" class="produce-variety-edit" value="' + $('#' + plu + '_variety').html() + '">');
        $('#' + plu + '_variety_edit').focus().blur(function() {
          save_produce_variety(plu);
        });
      }
    }

    function save_produce_variety(plu) {
      new_variety = $('#' + plu + '_variety_edit').val();

      post_args = {
        plu: plu,
        variety: new_variety
      };
      post_args[$('#csrf_token>input').attr('name')] = $('#csrf_token>input').attr('value');

      $.ajax({
        url: '/inventory/update_produce/',
        data: post_args,
        type: 'POST',
        dataType: 'json',
        success: function(data, status) {
          $('#' + plu + '_variety').html(data.variety);
        },
        error: function(xhr, text, error) {
          alert('There was an error processing the request.' + '\n' + text + '\n' + error);
          $('#' + plu + '_variety').focus();
        }
      });
    }

    function edit_produce_size(plu) {
      if ($('#' + plu + '_size > input').length === 0) {
        $('#' + plu + '_size').html('<input type="text" placeholder="Size" id="' + plu + '_size_edit" class="produce-size-edit" value="' + $('#' + plu + '_size').html() + '">');
        $('#' + plu + '_size_edit').focus().blur(function() {
          save_produce_size(plu);
        });
      }
    }

    function save_produce_size(plu) {
      new_size = $('#' + plu + '_size_edit').val();

      post_args = {
        plu: plu,
        size: new_size
      };
      post_args[$('#csrf_token>input').attr('name')] = $('#csrf_token>input').attr('value');

      $.ajax({
        url: '/inventory/update_produce/',
        data: post_args,
        type: 'POST',
        dataType: 'json',
        success: function(data, status) {
          $('#' + plu + '_size').html(data.size);
        },
        error: function(xhr, text, error) {
          alert('There was an error processing the request.' + '\n' + text + '\n' + error);
          $('#' + plu + '_size').focus();
        }
      });
    }

    function edit_produce_botanical(plu) {
      if ($('#' + plu + '_botanical > input').length === 0) {
        $('#' + plu + '_botanical').html('<input type="text" placeholder="Botanical" id="' + plu + '_botanical_edit" class="produce-botanical-edit" value="' + $('#' + plu + '_botanical').html() + '">');
        $('#' + plu + '_botanical_edit').focus().blur(function() {
          save_produce_botanical(plu);
        });
      }
    }

    function save_produce_botanical(plu) {
      new_botanical = $('#' + plu + '_botanical_edit').val();

      post_args = {
        plu: plu,
        botanical: new_botanical
      };
      post_args[$('#csrf_token>input').attr('name')] = $('#csrf_token>input').attr('value');

      $.ajax({
        url: '/inventory/update_produce/',
        data: post_args,
        type: 'POST',
        dataType: 'json',
        success: function(data, status) {
          $('#' + plu + '_botanical').html(data.botanical);
        },
        error: function(xhr, text, error) {
          alert('There was an error processing the request.' + '\n' + text + '\n' + error);
          $('#' + plu + '_botanical').focus();
        }
      });
    }


    function edit_produce_price(plu) {
      if ($('#' + plu + '_price > input').length === 0) {
        $('#' + plu + '_price').html('<input type="number" id="' + plu + '_price_edit" class="produce-price-edit" value="' + $('#' + plu + '_price').html() + '">');
        $('#' + plu + '_price_edit').focus().blur(function() {
          save_produce_price(plu);
        });
      }
    }

    function save_produce_price(plu) {
      new_price = $('#' + plu + '_price_edit').val();

      post_args = {
        plu: plu,
        price: new_price
      };
      post_args[$('#csrf_token>input').attr('name')] = $('#csrf_token>input').attr('value');

      $.ajax({
        url: '/inventory/update_produce/',
        data: post_args,
        type: 'POST',
        dataType: 'json',
        success: function(data, status) {
          $('#' + plu + '_price').html(data.price);
        },
        error: function(xhr, text, error) {
          alert('There was an error processing the request.' + '\n' + text + '\n' + error);
          $('#' + plu + '_price').focus();
        }
      });

    }

    function toggle_produce_scalable(plu) {
      var scalable;
      if ($('#' + plu + '_scalable').html() == 'Scalable') {
        scalable = false;
      }
      else {
        scalable = true;
      }

      post_args = {
        plu: plu,
        scalable: scalable
      };
      post_args[$('#csrf_token>input').attr('name')] = $('#csrf_token>input').attr('value');

      $.ajax({
        url: '/inventory/update_produce/',
        data: post_args,
        type: 'POST',
        dataType: 'json',
        success: function(data, status) {
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
      var taxable;
      if ($('#' + plu + '_taxable').html() == 'Taxable') {
        taxable = false;
      }
      else {
        taxable = true;
      }

      post_args = {
        plu: plu,
        taxable: taxable
      };
      post_args[$('#csrf_token>input').attr('name')] = $('#csrf_token>input').attr('value');

      $.ajax({
        url: '/inventory/update_produce/',
        data: post_args,
        type: 'POST',
        dataType: 'json',
        success: function(data, status) {
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

  });
});
