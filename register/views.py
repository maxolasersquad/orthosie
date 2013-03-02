from django.shortcuts import render
from register.models import *

def index(request):
    current_transaction = Transaction.objects.get(finish_date = None)
    line_items = current_transaction.lineitem_set.all()
    transaction_total = current_transaction.get_totals()
    context = { 'line_items': line_items, 'transaction_total': transaction_total }
    return render(request, 'register/index.html', context)
