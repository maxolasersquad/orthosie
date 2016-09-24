var axios = require('axios');

document.addEventListener("DOMContentLoaded", function () {

  function get_id_from_upc(upc) {
    return document.querySelector("[id='" + upc + "']").dataset.id;
  }

  function get_id_from_plu(plu) {
    return get_id_from_upc(plu);
  }

  function save_vendor(upc) {
    var new_vendor = document.querySelector("[id='" + upc + "_vendor_edit']").value,
      id = get_id_from_upc(upc);

    axios({
      method: 'post',
      url: '/groceries/' + id + '/update_vendor/',
      data: {vendor: new_vendor},
      responseType: 'json'
    }).then(function (data) {
      "use strict";
      document.querySelector("[id='" + upc + "_vendor']").innerHTML = data.vendor.name;
    }).catch(function (error) {
      "use strict";
      alert('There was an error processing the request.\n' + error);
    });
  }

  function edit_vendor(upc) {
    var upc_vendor = document.querySelector("[id='" + upc + "_vendor']");
    if (upc_vendor.querySelector('input').length === 0) {
      upc_vendor.innerHTML = '<input type="text" id="' + upc + '_vendor_edit" class="grocery-edit grocery-vendor-edit" value="' + upc_vendor.innerHTML + '">';
      var vendor_edit = document.querySelector("[id=['" + upc + "_vendor_edit']");
      vendor_edit.focus();
      vendor_edit.addEventListener('blur', function() {
        save_vendor(upc);
      });
    }
  }

  function save_name(upc) {
    var new_name = document.querySelector("[id='" + upc + "_name_edit']").value,
      id = get_id_from_upc(upc);

    axios({
      method: 'post',
      url: '/groceries/' + id + '/update_name/',
      data: {name: new_name},
      responseType: 'json'
    }).then(function(data){
        document.querySelector("[id=['" + upc + "_name']").innerHTML = data.name;
    }).catch(function(error){
        alert('There was an error processing the request.\n' + error);
    });

  }

  function edit_name(upc) {
    var upc_name = document.querySelector("[id='" + upc + "_name']");
    if (upc_name.querySelector('input').length === 0) {
      upc_name.innerHTML = "<input type='text' id='" + upc + "_name_edit' class='grocery-name-edit' value='" + upc_name.innerHTML() + "'>";
      var name_edit = document.querySelector("[id='" + upc + "_name_edit']");
      name_edit.focus();
      name_edit.addEventListener('blur', function() {
        save_name(upc);
      });
    }
  }

  function save_price(upc) {
    var new_price = document.querySelector("[id='" + upc + "_price_edit']").value,
      id = get_id_from_upc(upc);

    axios({
      method: 'post',
      url: '/groceries/' + id + '/update_price/',
      data: {price: new_price},
      responseType: 'json'
    }).then(function(data) {
        document.querySelector("[id='" + upc + "_price']").innerHTML = data.price;
    }).catch(function(error){
        alert('There was an error processing the request.\n' + error);
    });

  }

  function edit_price(upc) {
    if (document.querySelector("[id='" + upc + "_price'] > input").length === 0) {
      var upc_price = document.querySelector("[id='" + upc + "_price']");
      upc_price.innerHTML = "<input type='number' id='" + upc + "_price_edit' class='grocery-price-edit' value='" + upc_price.innerHTML + "'>";
      var price_edit = document.querySelector("[id='" + upc + "_price_edit']");
      price_edit.focus()
      price_edit.addEventListener('blur', function() {
        save_price(upc);
      });
    }
  }

  function toggle_grocery_taxable(upc) {
    var taxable = !(document.querySelector("[id='" + upc + "_taxable']").innerHTML === 'Taxable'),
      id = get_id_from_upc(upc);

    axios({
      method: 'post',
      url: '/groceries/' + id + '/update_taxable/',
      data: {taxable: taxable},
      responseType: 'json'
    }).then(function(data) {
      if (data.taxable) {
        document.querySelector("[id='" + upc + "_taxable']").innerHTML = 'Taxable';
      }
      else {
        document.querySelector("[id='" + upc + "_taxable']").innerHTML = 'Non-Taxable';
      }
    }).catch(function(error) {
      alert('There was an error processing the request.\n' + error);
    });

  }

  function toggle_grocery_scalable(upc) {
    var scalable = !(document.querySelector("[id='" + upc + "_scalable']").innerHTML === 'Scalable'),
      id = get_id_from_upc(upc);

    axios({
      method: 'post',
      url: '/groceries/' + id + '/update_scalable/',
      data: {scalable: scalable},
      responseType: 'json'
    }).then(function(data) {
      var scalable = document.querySelector("id=['" + upc + "_scalable']");
      if (data.scalable) {
        scalable.innerHTML = 'Scalable';
      }
      else {
        scalable.innerHTML = 'Non-Scalable';
      }
    }).catch(function(error) {
      alert('There was an error processing the request.\n' + error);
    });

  }

  function new_grocery() {
    var grocery_input = document.querySelector('#grocery').querySelector('input'),
      grocery_vendor_input = document.querySelector('#grocery_vendor').querySelector('input'),
      grocery_name_input = document.querySelector('#grocery_name').querySelector('input'),
      grocery_price_input = document.querySelector('#grocery_price').querySelector('input'),
      grocery_upc_input = document.querySelector('#grocery_upc').querySelector('input'),
      scalable = document.querySelector('#grocery_scalable').innerHTML === 'Scalable',
      taxable = document.querySelector('#grocery_taxable').innerHTML === 'Taxable',
      csrf_token_input = document.querySelector('#csrf_token').querySelector('input'),
      post_args = {
        upc: grocery_upc_input.value,
        vendor: grocery_vendor_input.value,
        name: grocery_name_input.value,
        price: grocery_price_input.value,
        scalable: scalable,
        taxable: taxable
      };
    if (grocery_input.value === '' || grocery_vendor_input.value === '' || grocery_name_input.value === '' || grocery_price_input.value === '') {
      return;
    }
    if (grocery_upc_input.querySelector(':invalid').length === 1) {
      alert('Invalid UPC');
      return;
    }

    post_args[csrf_token_input.attr('name')] = csrf_token_input.attr('value');

    axios({
      method: 'post',
      url: '/groceries/',
      data: post_args,
      responseType: 'json'
    }).then(function(data){
        console.log(data);
        //location.reload();
    }).catch(function(error){
      alert('There was an error processing the request.\n' + error);
    });

  }

  function save_produce_name(plu) {
    var new_name = document.querySelector("[id='" + plu + "_name_edit']").value,
      id = get_id_from_plu(plu);

    axios({
      method: 'post',
      url: '/produce/' + id + '/update_name/',
      data: {name: new_name},
      returnType: 'json'
    }).then(function(data){
        document.querySelector("[id='" + plu + "_name']").innerHTML = data.name;
    }).catch(function(error){
        alert('There was an error processing the request.\n' + error);
        document.querySelector("[id='" + plu + "_name']").focus;
    });

  }

  function edit_produce_name(plu) {
    var plu_name = document.querySelector("[id='" + plu + "_name']");
    if (plu_name.querySelector('input').length === 0) {
      plu_name.innerHTML = '<input type="text" placeholder="Name" id="' + plu + '_name_edit" class="produce-name-edit" value="' + plu_name.innerHTML + '">';
      document.querySelector("[id='" + plu + "_name_edit']").focus().addEventListener('blur', function () {
        save_produce_name(plu);
      });
    }
  }

  function save_produce_variety(plu) {
    var new_variety = document.querySelector("[id='" + plu + "_variety_edit']").value,
      id = get_id_from_plu(plu);

    axios({
      method: 'post',
      url: '/produce/' + id + '/update_variety/',
      data: {variety: new_variety},
      returnType: 'json'
    }).then(function(data) {
        document.querySelector("[id='" + plu + "_variety']").innerHTML = data.variety;
    }).catch(function(data) {
        alert('There was an error processing the request.\n' + error);
        document.querySelector("[id='" + plu + "_variety']").focus();
    });
  }

  function edit_produce_variety(plu) {
    var plu_variety = document.querySelector("[id='" + plu + "_variety']");
    if (plu_variety.querySelector('input').length === 0) {
      plu_variety.innerHTML = '<input type="text" placeholder="Variety" id="' + plu + '_variety_edit" class="produce-variety-edit" value="' + plu_variety.innerHTML + '">';
      document.querySelector("[id='" + plu + "_variety_edit']").focus().addEventListener('blur', function () {
        save_produce_variety(plu);
      });
    }
  }

  function save_produce_size(plu) {
    var new_size = document.querySelector("[id='" + plu + "_size_edit']").value,
      id = get_id_from_plu(plu);

    axios({
      method: 'post',
      url: '/produce/' + id + '/update_size/',
      data: {size: new_size},
      returnType: 'json'
    }).then(function(data) {
        document.querySelector("[id='" + plu + "_size']").innerHTML = data.size;
    }).catch(function(error) {
        alert('There was an error processing the request.\n' + error);
        document.querySelector("[id='" + plu + "_size']").focus();
    });

}

  function edit_produce_size(plu) {
    var plu_size = document.querySelector("[id='" + plu + "_size']");
    if (plu_size.querySelector('input').length === 0) {
      plu_size.innerHTML = '<input type="text" placeholder="Size" id="' + plu + '_size_edit" class="produce-size-edit" value="' + plu_size.innerHTML + '">';
      document.querySelector("[id='" + plu + "_size_edit']").focus().addEventListener('blur', function () {
        save_produce_size(plu);
      });
    }
  }

  function save_produce_botanical(plu) {
    var new_botanical = document.querySelector("[id='" + plu + "_botanical_edit']").value,
      id = get_id_from_plu(plu);

    axios({
      method: 'post',
      url: '/produce/' + id + '/update_botanical/',
      data: {botanical: new_botanical},
      returnType: 'json'
    }).then(function(data) {
        document.querySelector("[id='" + plu + "_botanical']").innerHTML = data.botanical;
    }).catch(function(error) {
        alert('There was an error processing the request.\n' + error);
        document.querySelector("[id='" + plu + "_botanical']").focus();
    });
  }

  function edit_produce_botanical(plu) {
    var plu_botanical = document.querySelector("[id='" + plu + "_botanical']");
    if (plu_botanical.querySelector('input').length === 0) {
      plu_botanical.innerHTML = '<input type="text" placeholder="Botanical" id="' + plu + '_botanical_edit" class="produce-botanical-edit" value="' + plu_botanical.innerHTML + '">';
      document.querySelector("[id='" + plu + "_botanical_edit']").focus().addEventListener('blur', function () {
        save_produce_botanical(plu);
      });
    }
  }

  function save_produce_price(plu) {
    var new_price = document.querySelector("[id='" + plu + "_price_edit']").value,
      id = get_id_from_plu(plu);

    axios({
      method: 'post',
      url: '/produce/' + id + '/update_price/',
      data: {price: new_price},
      returnType: 'json'
    }).then(function(data) {
        document.querySelector("[id='" + plu + "_price']").innerHTML = data.price;
    }).catch(function(error) {
        alert('There was an error processing the request.\n' + error);
        document.querySelector("[id='" + plu + "_price']").focus();
    });

  }

  function edit_produce_price(plu) {
    var plu_price = document.querySelector("[id='" + plu + "_price']");
    if (plu_price.querySelector('input').length === 0) {
      plu_price.innerHTML = '<input type="number" id="' + plu + '_price_edit" class="produce-price-edit" value="' + plu_price.innerHTML + '">';
      document.querySelector("[id='" + plu + "_price_edit']").focus().addEventListener('blur', function () {
        save_produce_price(plu);
      });
    }
  }

  function toggle_produce_scalable(plu) {
    var scalable = !(document.querySelector("[id='" + plu + "_scalable']").innerHTML === 'Scalable'),
      id = get_id_from_upc(plu);

    axios({
      method: 'post',
      url: '/produce/' + id + '/update_scalable/',
      data: {scalable: scalable},
      returnType: 'json'
    }).then(function(data) {
        if (data.scalable) {
          document.querySelector("[id='" + plu + "_scalable']").innerHTML = 'Scalable';
        }
        else {
          document.querySelector("[id='" + plu + "_scalable']").innerHTML = 'Non-Scalable';
        }
    }).catch(function(error) {
        alert('There was an error processing the request.\n' + error);
    });

  }

  function toggle_produce_taxable(plu) {
    var taxable = !(document.querySelector("[id='" + plu + "_taxable']").innerHTML === 'Taxable'),
      id = get_id_from_upc(plu);

    axios({
      method: 'post',
      url: '/produce/' + id + '/update_taxable/',
      data: {taxable: taxable},
      returnType: 'json'
    }).then(function(data) {
        if (data.taxable) {
          document.querySelector("[id='" + plu + "_taxable']").innerHTML = 'Taxable';
        }
        else {
          document.querySelector("[id='" + plu + "_taxable']").innerHTML = 'Non-Taxable';
        }
    }).catch(function(error) {
        alert('There was an error processing the request.\n' + error);
    });

  }

  function new_produce() {
    var produce_plu_input = document.querySelector('#produce_plu').querySelector('input'),
      produce_name_input = document.querySelector('#produce_name').querySelector('input'),
      produce_price_input = document.querySelector('#produce_price').querySelector('input'),
      produce_variety_input = document.querySelector('#produce_variety').querySelector('input'),
      produce_size_input = document.querySelector('#produce_size').querySelector('input'),
      produce_botanical_input = document.querySelector('#produce_botanical').querySelector('input'),
      scalable = document.querySelector('#produce_scalable').innerHTML === 'Scalable',
      taxable = document.querySelector('#produce_taxable').innerHTML === 'Taxable',
      csrf_token_input = document.querySelector('#csrf_token').querySelector('input'),
      produce_list_tr_last = document.querySelector('#produce-list').querySelector('tr:last'),
      post_args = {
        plu: produce_plu_input.value,
        name: produce_name_input.value,
        variety: produce_variety_input.value,
        size: produce_size_input.value,
        botanical: produce_botanical_input.value,
        price: produce_price_input.value,
        scalable: scalable,
        taxable: taxable
      };
    if (produce_plu_input.value === '' || produce_name_input.value === '' || produce_price_input.value === '') {
      return;
    }
    if (produce_plu_input.querySelector(':invalid').length === 1) {
      alert('Invalid PLU');
      return;
    }

    post_args[csrf_token_input.attr('name')] = csrf_token_input.attr('value');

    axios({
      method: 'post',
      url: '/inventory/create_produce',
      data: post_args,
      returnType: 'json'
    }).then(function(data) {
        produce_list_tr_last.querySelector('input').val('');
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
    }).catch(function(data) {
        alert('There was an error processing the request.\n' + error);
    });
  }

  var vendorNames = document.querySelectorAll('.vendor-name');
  for (var i = 0; i < vendorNames.length; ++i) {
    vendorNames[i].addEventListener('click', function () {
      edit_vendor(document.querySelector(this).dataset.upc);
    });
  }

  var groceryNames = document.querySelectorAll('.grocery-name');
  for (var i = 0; i < groceryNames.length; ++i) {
    groceryNames[i].addEventListener('click', function () {
      edit_name(document.querySelector(this).dataset.upc);
    });
  }

  var groceryPrices = document.querySelectorAll('.grocery-price');
  for (var i = 0; i < groceryPrices.length; ++i) {
    groceryPrices[i].addEventListener('click', function () {
      edit_price(document.querySelector(this).dataset.upc);
    });
  }

  var groceryScalables = document.querySelectorAll('.grocery-scalable');
  for (var i = 0; i < groceryScalables.length; ++i) {
    groceryScalables[i].addEventListener('click', function () {
      console.log('[groceryScalables][this]', this);
      toggle_grocery_scalable(this.dataset.upc);
    });
  }

  var groceryTaxables = document.querySelectorAll('.grocery-taxable');
  for (var i = 0; i < groceryTaxables.length; ++i) {
    groceryTaxables[i].addEventListener('click', function () {
      toggle_grocery_taxable(this.dataset.upc);
    });
  };

  var newInventories = document.querySelectorAll('.new-inventory');
  for (var i = 0; i < newInventories.length; ++i) {
    newInventories[i].addEventListener('blur', function () {
      if (document.querySelector('body').dataset.tab === 'upc') {
        new_grocery();
      }
      else {
        new_produce();
      }
    });
  };

  var produceNames = document.querySelectorAll('.produce-name');
  for (var i = 0; i < produceNames.length; ++i) {
    produceNames[i].addEventListener('click', function () {
      edit_produce_name(document.querySelector(this).dataset.plu);
    });
  }

  var produceVarieties = document.querySelectorAll('.produce-variety');
  for (var i = 0; i < produceVarieties.length; ++i) {
    produceVarieties[i].addEventListener('click', function () {
      edit_produce_variety(document.querySelector(this).dataset.plu);
    });
  }

  var produceSizes = document.querySelectorAll('.produce-size');
  for (var i = 0; i < produceSizes.length; ++i) {
    produceSizes[i].addEventListener('click', function () {
      edit_produce_size(document.querySelector(this).dataset.plu);
    });
  }

  var produceBotanicals = document.querySelectorAll('.produce-botanical');
  for (var i = 0; i < produceBotanicals.length; ++i) {
    produceBotanicals[i].addEventListener('click', function () {
      edit_produce_botanical(document.querySelector(this).dataset.plu);
    });
  }

  var producePrices = document.querySelectorAll('.produce-price');
  for (var i = 0; i < producePrices.length; ++i) {
    producePrices[i].addEventListener('click', function () {
      edit_produce_price(document.querySelector(this).dataset.plu);
    });
  }

  var produceScalables = document.querySelectorAll('.produce-scalable');
  for (var i = 0; i < produceScalables.length; ++i) {
    produceScalables[i].addEventListener('click', function () {
      toggle_produce_scalable(document.querySelector(this).dataset.plu);
    });
  }

  var produceTaxables = document.querySelectorAll('.produce-taxable');
  for (var i = 0; i < produceTaxables.length; ++i) {
    produceTaxables[i].addEventListener('click', function () {
      toggle_produce_taxable(document.querySelector(this).dataset.plu);
    });
  }

  var upcs = document.querySelector('#upc');
  for (var i = 0; i < upcs.length; ++i) {
    upcs[i].addEventListener('click', function () {
      document.querySelector('body').dataset.tab =  'upc';
    });
  }

  var plus = document.querySelector('#plu');
  for (var i = 0; i < plus.length; ++i) {
    plus[i].addEventListener('click', function () {
      document.querySelector('body').dataset.tab = plu;
    });
  }

});
