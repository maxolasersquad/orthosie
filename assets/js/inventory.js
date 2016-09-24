var axios = require('axios');

document.addEventListener("DOMContentLoaded", function () {

  function get_id_from_upc(upc) {
    return document.querySelector('#' + upc).data('id');
  }

  function get_id_from_plu(plu) {
    return get_id_from_upc(plu);
  }

  function save_vendor(upc) {
    var new_vendor = document.querySelector('#' + upc + '_vendor_edit').value,
      id = get_id_from_upc(upc);

    axios({
      url: '/groceries/' + id + '/update_vendor/',
      data: {vendor: new_vendor},
      method: 'post',
      responseType: 'json'
    }).then(function (response) {
      "use strict";
      document.querySelector('#' + upc + '_vendor').html(response.vendor.name);
    }).catch(function (error) {
      "use strict";
      alert('There was an error processing the request.' + '\n' + error);
    });
  }

  function edit_vendor(upc) {
    var upc_vendor = document.querySelector('#' + upc + '_vendor');
    if (upc_vendor.find('input').length === 0) {
      upc_vendor.html('<input type="text" id="' + upc + '_vendor_edit" class="grocery-edit grocery-vendor-edit" value="' + upc_vendor.html() + '">');
      document.querySelector('#' + upc + '_vendor_edit').focus().blur(function () {
        save_vendor(upc);
      });
    }
  }

  function save_name(upc) {
    var new_name = document.querySelector('#' + upc + '_name_edit').val(),
      id = get_id_from_upc(upc);

    document.querySelector.ajax({
      url: '/groceries/' + id + '/update_name/',
      data: {name: new_name},
      type: 'POST',
      dataType: 'json',
      success: function (data) {
        document.querySelector('#' + upc + '_name').html(data.name);
      },
      error: function (xhr, text, error) {
        alert('There was an error processing the request.' + '\n' + text + '\n' + error);
      }
    });

  }

  function edit_name(upc) {
    var upc_name = document.querySelector('#' + upc + '_name');
    if (upc_name.find('input').length === 0) {
      upc_name.html("<input type='text' id='" + upc + "_name_edit' class='grocery-name-edit' value='" + upc_name.html() + "'>");
      document.querySelector('#' + upc + '_name_edit').focus().blur(function () {
        save_name(upc);
      });
    }
  }

  function save_price(upc) {
    var new_price = document.querySelector('#' + upc + '_price_edit').val(),
      id = get_id_from_upc(upc);

    document.querySelector.ajax({
      url: '/groceries/' + id + '/update_price/',
      data: {price: new_price},
      type: 'POST',
      dataType: 'json',
      success: function (data) {
        document.querySelector('#' + upc + '_price').html(data.price);
      },
      error: function (xhr, text, error) {
        alert('There was an error processing the request.' + '\n' + text + '\n' + error);
      }
    });

  }

  function edit_price(upc) {
    if (document.querySelector('#' + upc + '_price > input').length === 0) {
      var upc_price = document.querySelector('#' + upc + '_price');
      upc_price.html("<input type='number' id='" + upc + "_price_edit' class='grocery-price-edit' value='" + upc_price.html() + "'>");
      document.querySelector('#' + upc + '_price_edit').focus().blur(function () {
        save_price(upc);
      });
    }
  }

  function toggle_grocery_taxable(upc) {
    var taxable = !(document.querySelector('#' + upc + '_taxable').html() === 'Taxable'),
      id = get_id_from_upc(upc);

    document.querySelector.ajax({
      url: '/groceries/' + id + '/update_taxable/',
      data: {taxable: taxable},
      type: 'POST',
      dataType: 'json',
      success: function (data) {
        if (data.taxable) {
          document.querySelector('#' + upc + '_taxable').html('Taxable');
        }
        else {
          document.querySelector('#' + upc + '_taxable').html('Non-Taxable');
        }
      },
      error: function (xhr, text, error) {
        alert('There was an error processing the request.' + '\n' + text + '\n' + error);
      }
    });

  }

  function toggle_grocery_scalable(upc) {
    var scalable = !(document.querySelector('#' + upc + '_scalable').html() === 'Scalable'),
      id = get_id_from_upc(upc);

    document.querySelector.ajax({
      url: '/groceries/' + id + '/update_scalable/',
      data: {scalable: scalable},
      type: 'POST',
      dataType: 'json',
      success: function (data) {
        if (data.scalable) {
          document.querySelector('#' + upc + '_scalable').html('Scalable');
        }
        else {
          document.querySelector('#' + upc + '_scalable').html('Non-Scalable');
        }
      },
      error: function (xhr, text, error) {
        alert('There was an error processing the request.' + '\n' + text + '\n' + error);
      }
    });

  }

  function new_grocery() {
    var grocery_input = document.querySelector('#grocery').find('input'),
      grocery_vendor_input = document.querySelector('#grocery_vendor').find('input'),
      grocery_name_input = document.querySelector('#grocery_name').find('input'),
      grocery_price_input = document.querySelector('#grocery_price').find('input'),
      grocery_upc_input = document.querySelector('#grocery_upc').find('input'),
      scalable = document.querySelector('#grocery_scalable').html() === 'Scalable',
      taxable = document.querySelector('#grocery_taxable').html() === 'Taxable',
      csrf_token_input = document.querySelector('#csrf_token').find('input'),
      post_args = {
        upc: grocery_upc_input.val(),
        vendor: grocery_vendor_input.val(),
        name: grocery_name_input.val(),
        price: grocery_price_input.val(),
        scalable: scalable,
        taxable: taxable
      };
    if (grocery_input.val() === '' || grocery_vendor_input.val() === '' || grocery_name_input.val() === '' || grocery_price_input.val() === '') {
      return;
    }
    if (grocery_upc_input.find(':invalid').length === 1) {
      alert('Invalid UPC');
      return;
    }

    post_args[csrf_token_input.attr('name')] = csrf_token_input.attr('value');

    document.querySelector.ajax({
      url: '/groceries/',
      data: post_args,
      type: 'POST',
      dataType: 'json',
      success: function (data) {
        console.log(data);
        //location.reload();
      },
      error: function (xhr, text, error) {
        alert('There was an error processing the request.' + '\n' + text + '\n' + error);
      }
    });
  }

  function save_produce_name(plu) {
    var new_name = document.querySelector('#' + plu + '_name_edit').val(),
      id = get_id_from_plu(plu);

    document.querySelector.ajax({
      url: '/produce/' + id + '/update_name/',
      data: {name: new_name},
      type: 'POST',
      dataType: 'json',
      success: function (data) {
        document.querySelector('#' + plu + '_name').html(data.name);
      },
      error: function (xhr, text, error) {
        alert('There was an error processing the request.' + '\n' + text + '\n' + error);
        document.querySelector('#' + plu + '_name').focus();
      }
    });

  }

  function edit_produce_name(plu) {
    var plu_name = document.querySelector('#' + plu + '_name');
    if (plu_name.find('input').length === 0) {
      plu_name.html('<input type="text" placeholder="Name" id="' + plu + '_name_edit" class="produce-name-edit" value="' + plu_name.html() + '">');
      document.querySelector('#' + plu + '_name_edit').focus().blur(function () {
        save_produce_name(plu);
      });
    }
  }

  function save_produce_variety(plu) {
    var new_variety = document.querySelector('#' + plu + '_variety_edit').val(),
      id = get_id_from_plu(plu);

    document.querySelector.ajax({
      url: '/produce/' + id + '/update_variety/',
      data: {variety: new_variety},
      type: 'POST',
      dataType: 'json',
      success: function (data) {
        document.querySelector('#' + plu + '_variety').html(data.variety);
      },
      error: function (xhr, text, error) {
        alert('There was an error processing the request.' + '\n' + text + '\n' + error);
        document.querySelector('#' + plu + '_variety').focus();
      }
    });
  }

  function edit_produce_variety(plu) {
    var plu_variety = document.querySelector('#' + plu + '_variety');
    if (plu_variety.find('input').length === 0) {
      plu_variety.html('<input type="text" placeholder="Variety" id="' + plu + '_variety_edit" class="produce-variety-edit" value="' + plu_variety.html() + '">');
      document.querySelector('#' + plu + '_variety_edit').focus().blur(function () {
        save_produce_variety(plu);
      });
    }
  }

  function save_produce_size(plu) {
    var new_size = document.querySelector('#' + plu + '_size_edit').val(),
      id = get_id_from_plu(plu);

    document.querySelector.ajax({
      url: '/produce/' + id + '/update_size/',
      data: {size: new_size},
      type: 'POST',
      dataType: 'json',
      success: function (data) {
        document.querySelector('#' + plu + '_size').html(data.size);
      },
      error: function (xhr, text, error) {
        alert('There was an error processing the request.' + '\n' + text + '\n' + error);
        document.querySelector('#' + plu + '_size').focus();
      }
    });
  }

  function edit_produce_size(plu) {
    var plu_size = document.querySelector('#' + plu + '_size');
    if (plu_size.find('input').length === 0) {
      plu_size.html('<input type="text" placeholder="Size" id="' + plu + '_size_edit" class="produce-size-edit" value="' + plu_size.html() + '">');
      document.querySelector('#' + plu + '_size_edit').focus().blur(function () {
        save_produce_size(plu);
      });
    }
  }

  function save_produce_botanical(plu) {
    var new_botanical = document.querySelector('#' + plu + '_botanical_edit').val(),
      id = get_id_from_plu(plu);

    document.querySelector.ajax({
      url: '/produce/' + id + '/update_botanical/',
      data: {botanical: new_botanical},
      type: 'POST',
      dataType: 'json',
      success: function (data) {
        document.querySelector('#' + plu + '_botanical').html(data.botanical);
      },
      error: function (xhr, text, error) {
        alert('There was an error processing the request.' + '\n' + text + '\n' + error);
        document.querySelector('#' + plu + '_botanical').focus();
      }
    });
  }

  function edit_produce_botanical(plu) {
    var plu_botanical = document.querySelector('#' + plu + '_botanical');
    if (plu_botanical.find('input').length === 0) {
      plu_botanical.html('<input type="text" placeholder="Botanical" id="' + plu + '_botanical_edit" class="produce-botanical-edit" value="' + plu_botanical.html() + '">');
      document.querySelector('#' + plu + '_botanical_edit').focus().blur(function () {
        save_produce_botanical(plu);
      });
    }
  }

  function save_produce_price(plu) {
    var new_price = document.querySelector('#' + plu + '_price_edit').val(),
      id = get_id_from_plu(plu);

    document.querySelector.ajax({
      url: '/produce/' + id + '/update_price/',
      data: {price: new_price},
      type: 'POST',
      dataType: 'json',
      success: function (data) {
        document.querySelector('#' + plu + '_price').html(data.price);
      },
      error: function (xhr, text, error) {
        alert('There was an error processing the request.' + '\n' + text + '\n' + error);
        document.querySelector('#' + plu + '_price').focus();
      }
    });

  }

  function edit_produce_price(plu) {
    var plu_price = document.querySelector('#' + plu + '_price');
    if (plu_price.find('input').length === 0) {
      plu_price.html('<input type="number" id="' + plu + '_price_edit" class="produce-price-edit" value="' + plu_price.html() + '">');
      document.querySelector('#' + plu + '_price_edit').focus().blur(function () {
        save_produce_price(plu);
      });
    }
  }

  function toggle_produce_scalable(plu) {
    var scalable = !(document.querySelector('#' + plu + '_scalable').html() === 'Scalable'),
      id = get_id_from_upc(plu);

    document.querySelector.ajax({
      url: '/produce/' + id + '/update_scalable/',
      data: {scalable: scalable},
      type: 'POST',
      dataType: 'json',
      success: function (data) {
        if (data.scalable) {
          document.querySelector('#' + plu + '_scalable').html('Scalable');
        }
        else {
          document.querySelector('#' + plu + '_scalable').html('Non-Scalable');
        }
      },
      error: function (xhr, text, error) {
        alert('There was an error processing the request.' + '\n' + text + '\n' + error);
      }
    });

  }

  function toggle_produce_taxable(plu) {
    var taxable = !(document.querySelector('#' + plu + '_taxable').html() === 'Taxable'),
      id = get_id_from_upc(plu);

    document.querySelector.ajax({
      url: '/produce/' + id + '/update_taxable/',
      data: {taxable: taxable},
      type: 'POST',
      dataType: 'json',
      success: function (data) {
        if (data.taxable) {
          document.querySelector('#' + plu + '_taxable').html('Taxable');
        }
        else {
          document.querySelector('#' + plu + '_taxable').html('Non-Taxable');
        }
      },
      error: function (xhr, text, error) {
        alert('There was an error processing the request.' + '\n' + text + '\n' + error);
      }
    });

  }

  function new_produce() {
    var produce_plu_input = document.querySelector('#produce_plu').find('input'),
      produce_name_input = document.querySelector('#produce_name').find('input'),
      produce_price_input = document.querySelector('#produce_price').find('input'),
      produce_variety_input = document.querySelector('#produce_variety').find('input'),
      produce_size_input = document.querySelector('#produce_size').find('input'),
      produce_botanical_input = document.querySelector('#produce_botanical').find('input'),
      scalable = document.querySelector('#produce_scalable').html() === 'Scalable',
      taxable = document.querySelector('#produce_taxable').html() === 'Taxable',
      csrf_token_input = document.querySelector('#csrf_token').find('input'),
      produce_list_tr_last = document.querySelector('#produce-list').find('tr:last'),
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
    if (produce_plu_input.val() === '' || produce_name_input.val() === '' || produce_price_input.val() === '') {
      return;
    }
    if (produce_plu_input.find(':invalid').length === 1) {
      alert('Invalid PLU');
      return;
    }

    post_args[csrf_token_input.attr('name')] = csrf_token_input.attr('value');

    document.querySelector.ajax({
      url: '/inventory/create_produce',
      data: post_args,
      type: 'POST',
      dataType: 'json',
      success: function (data) {
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
          '<td id="' + data.upc + '_scalable" class="grocery-scalable" data-upc="' + data.upc + '">' + (!data.scalable ? 'Non-' : '') + 'Scalable</td>' +
          '<td id="' + data.upc + '_taxable" class="grocery-taxable" data-upc="' + data.upc + '">' + (!data.taxable ? 'Non-' : '') + 'Taxable</td>' +
          '</tr>'
        );
      },
      error: function (xhr, text, error) {
        alert('There was an error processing the request.' + '\n' + text + '\n' + error);
      }
    });
  }

  document.querySelector('.vendor-name').click(function () {
    edit_vendor(document.querySelector(this).data('upc'));
  });

  document.querySelector('.grocery-name').click(function () {
    edit_name(document.querySelector(this).data('upc'));
  });

  document.querySelector('.grocery-price').click(function () {
    edit_price(document.querySelector(this).data('upc'));
  });

  document.querySelector('.grocery-scalable').click(function () {
    toggle_grocery_scalable(document.querySelector(this).data('upc'));
  });

  document.querySelector('.grocery-taxable').each(function () {
    document.querySelector(this).click(function () {
      toggle_grocery_taxable(document.querySelector(this).data('upc'));
    });
    document.querySelector('.new-inventory').each(function () {
      document.querySelector(this).blur(function () {
        if (document.querySelector('body').data('tab') === 'upc') {
          new_grocery();
        }
        else {
          new_produce();
        }
      });
    });
  });

  document.querySelector('.produce-name').click(function () {
    edit_produce_name(document.querySelector(this).data('plu'));
  });

  document.querySelector('.produce-variety').click(function () {
    edit_produce_variety(document.querySelector(this).data('plu'));
  });

  document.querySelector('.produce-size').click(function () {
    edit_produce_size(document.querySelector(this).data('plu'));
  });

  document.querySelector('.produce-botanical').click(function () {
    edit_produce_botanical(document.querySelector(this).data('plu'));
  });

  document.querySelector('.produce-price').click(function () {
    edit_produce_price(document.querySelector(this).data('plu'));
  });

  document.querySelector('.produce-scalable').click(function () {
    toggle_produce_scalable(document.querySelector(this).data('plu'));
  });

  document.querySelector('.produce-taxable').click(function () {
    toggle_produce_taxable(document.querySelector(this).data('plu'));
  });

  document.querySelector('#upc').click(function () {
    document.querySelector('body').data('tab', 'upc');
  });

  document.querySelector('#plu').click(function () {
    document.querySelector('body').data('tab', 'plu');
  });

});
