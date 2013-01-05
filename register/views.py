from django.shortcuts import render
from register.models import *

def index(request):
    line_items = LineItem.objects.order_by('id')
    transaction_total = line_items[0].transaction.get_transaction_totals()
    context = { 'line_items': line_items }
    return render(request, 'register/index.html', context)
