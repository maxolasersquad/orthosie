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

Orthosie.inventory = {

  edit_vendor: function(upc) {
    if ($('#' + upc + '_vendor > input').length == 0) {
      $('#' + upc + '_vendor').html("<input type='text' id='" + upc + "_vendor_edit' class='inventory_vendor_edit' value='" + $('#' + upc + '_vendor').html() + "' onblur='Orthosie.inventory.save_vendor(\"" + upc + "\")' >");
      $('#' + upc + '_vendor_edit').focus();
    }
  },

  save_vendor: function(upc) {
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

  },

  edit_name: function(upc) {
    if ($('#' + upc + '_name > input').length == 0) {
      $('#' + upc + '_name').html("<input type='text' id='" + upc + "_name_edit' class='inventory_name_edit' value='" + $('#' + upc + '_name').html() + "' onblur='Orthosie.inventory.save_name(\"" + upc + "\")' >");
      $('#' + upc + '_name_edit').focus();
    }
  },

  save_name: function(upc) {
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

  },

  edit_price: function(upc) {
    if ($('#' + upc + '_price > input').length == 0) {
      $('#' + upc + '_price').html("<input type='number' id='" + upc + "_price_edit' class='inventory_price_edit' value='" + $('#' + upc + '_price').html() + "' onblur='Orthosie.inventory.save_price(\"" + upc + "\")' >");
      $('#' + upc + '_price_edit').focus();
    }
  },

  save_price: function(upc) {
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

  },

  toggle_taxable: function(upc) {
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

  },

  toggle_scalable: function(upc) {
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

  },

  new_inventory: function() {
    if ($('#input_upc > input').val() == '' || $('#input_vendor > input').val() == '' || $('#input_name > input').val() == '' || $('#input_price > input').val() == '') {
      console.log('Fail');
      return
    }
    else if ($('#input_upc :invalid').length === 1) {
      alert('Invalid UPC');
      return;
    }

    var scalable;
    if ($('#input_scalable').html() == 'Scalable') {
      scalable = false;
    }
    else {
      scalable = true;
    }

    var taxable;
    if ($('#input_taxable').html() == 'Taxable') {
      taxable = false;
    }
    else {
      taxable = true;
    }

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
}
