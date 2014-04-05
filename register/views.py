from django.shortcuts import render
from django.core import serializers
from register.models import *
from inventory.models import *
from django.views.decorators.csrf import csrf_exempt

def index(request):
    current_transaction = Transaction.get_current()
    line_items = current_transaction.lineitem_set.all()
    transaction_total = current_transaction.get_totals()
    context = { 'line_items': line_items, 'transaction_total': transaction_total }
    return render(request, 'register/index.html', context)

def process_upc(request):
    upc = Upc(request.POST['upc'])
    quantity = request.POST['quantity']

    if upc.verify_check_digit():
        check = 'true'
        item = Item.objects.get(upc=upc.upc[:-1])
        transaction = Transaction.get_current()
        line_item = transaction.create_line_item(item, 1)
    else:
        check = 'false'
        item = None

    context_instance = { 'item': item, 'quantity': quantity, 'check_passed': check, 'transaction': transaction.get_totals(), 'line_item': line_item }
 
    return render(request, 'register/process_upc.json', context_instance)

def tender_transaction(request):
    tender = request.POST['tender']
    transaction = Transaction.objects.get(finish_date = None)
    transaction.create_tender(float(tender) / 100, 'CASH')

    context_instance = { 'transaction': transaction.get_totals() }
    return render(request, 'register/tender_transaction.json', context_instance)

def end_shift(request):
    shift = Shift.objects.get(finish_date = None)
    shift.end_shift()
    context_instance = { 'shift': shift.get_totals() }
    return render(request, 'register/end_shift.json', context_instance)

def product_search(request):
    search = request.GET['search']
    results = Item.objects.filter(name__contains=search) | Item.objects.filter(price__contains=search) | Item.objects.filter(vendor__name__contains=search).order_by('name')
    context_instance = { 'search': search, 'results': results}
    return render(request, 'register/product_search.html', context_instance)

def cancel_line(request):
    line_item = LineItem.objects.get(id=request.POST['id'])
    line_item.cancel()
    line_item.save()
    context_instance = { 'line_item': line_item  }
    return render(request, 'register/cancel_line.json', context_instance, content_type="application/json")

def cancel_transaction(request):
    current_transaction = Transaction.get_current()
    current_transaction.cancel()
    current_transaction.save()
    context_instance = { 'transaction': current_transaction }
    return render(request, 'register/cancel_transaction.json', context_instance, content_type="application/json")

@csrf_exempt
def transaction_total(request):
    current_transaction = Transaction.get_current()
    context = { 'transaction_total': current_transaction.get_totals() }
    return render(request, 'register/transaction_total.json', context)
