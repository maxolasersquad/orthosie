from django.shortcuts import render
from register.models import *
from inventory.models import *

def index(request):
    current_transaction = Transaction.objects.get(finish_date = None)
    line_items = current_transaction.lineitem_set.all()
    transaction_total = current_transaction.get_totals()
    context = { 'line_items': line_items, 'transaction_total': transaction_total }
    return render(request, 'register/index.html', context)

def process_upc(request):
    upc = request.POST['upc']
    quantity = request.POST['quantity']
    check_digit = 0
    odd_pos = True
    for char in upc[:-1]:
        if odd_pos:
            check_digit += int(char) * 3
        else:
            check_digit += int(char)
        odd_pos = not odd_pos
    check_digit = (10 - check_digit % 10) % 10

    if str(check_digit) != upc[-1]:
        check = 'false'
        item = None
    else:
        check = 'true'
        item = Item.objects.get(upc=upc[:-1])
        transaction = Transaction.objects.get(finish_date = None) 
        transaction.create_line_item(item, 1)

    context_instance = { 'item': item, 'quantity': quantity, 'check_passed': check, 'transaction': transaction.get_totals() }
 
    return render(request, 'register/process_upc.json', context_instance)

def tender_transaction(request):
    tender = request.POST['tender']
    transaction = Transaction.objects.get(finish_date = None)
    transaction.create_tender(float(tender) / 100, 'CASH')

    context_instance = { 'transaction': transaction.get_totals() }
    return render(request, 'register/tender_transaction.json', context_instance)
