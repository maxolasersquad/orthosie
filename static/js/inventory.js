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
  edit_price: function(upc) {
    $('#' + upc + '_price').html("<input type='number' id='" + upc + "_price_edit' class='inventory_price_edit' value='" + $('#' + upc + '_price').html() + "' onblur='Orthosie.inventory.save_price(\"" + upc + "\")' >");
    $('#' + upc + '_price_edit').focus();
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

  }
}
