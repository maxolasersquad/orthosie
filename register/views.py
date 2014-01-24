from django.shortcuts import render
from register.models import *
from inventory.models import *

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
        transaction.create_line_item(item, 1)
    else:
        check = 'false'
        item = None

    context_instance = { 'item': item, 'quantity': quantity, 'check_passed': check, 'transaction': transaction.get_totals() }
 
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
