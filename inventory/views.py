from django.shortcuts import render
from inventory.models import *

def index(request):
    inventory = Item.objects.all()
    context = { 'inventory_items': inventory}
    return render(request, 'inventory/index.html', context)
