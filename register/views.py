from django.shortcuts import render, get_object_or_404
from register.models import LineItem, Transaction, Shift, PrinterNotFound
from inventory.models import Grocery, Produce
from django.views.decorators.csrf import csrf_exempt


def index(request):
    current_transaction = Transaction.get_current()
    line_items = current_transaction.lineitem_set.all()
    context = {
        'transaction': Transaction.get_current(),
        'line_items': line_items,
        'transaction_total': current_transaction.get_totals()
    }
    return render(request, 'register/index.html', context)


def product_search(request):
    search = request.GET['search']
    grocery_results =\
        Grocery.objects.filter(name__contains=search) |\
        Grocery.objects.filter(price__contains=search) |\
        Grocery.objects.filter(vendor__name__contains=search).order_by('name')
    produce_results =\
        Produce.objects.filter(name__contains=search) |\
        Produce.objects.filter(price__contains=search)
    context_instance = {
        'search': search,
        'grocery_results': grocery_results,
        'produce_results': produce_results
    }
    return render(request, 'register/product_search.html', context_instance)
