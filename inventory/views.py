from django.shortcuts import render, get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from inventory.models import Item, Grocery, Produce, Vendor


def index(request):
    grocery = Grocery.objects.all()
    produce = Produce.objects.all()
    context = {'grocery_items': grocery, 'produce_items': produce}
    return render(request, 'inventory/index.html', context)


def update_grocery(request):
    item = get_object_or_404(Grocery, upc=request.POST['upc'])

    if 'price' in request.POST:
        item.price = request.POST['price']
    if 'name' in request.POST:
        item.name = request.POST['name']
    if 'scalable' in request.POST:
        if request.POST['scalable'] == 'true':
            item.scalable = True
        else:
            item.scalable = False
    if 'taxable' in request.POST:
        if request.POST['taxable'] == 'true':
            item.taxable = True
        else:
            item.taxable = False
    if 'vendor' in request.POST:
        try:
            vendor = Vendor.objects.get(name=request.POST['vendor'])
        except ObjectDoesNotExist:
            vendor = get_object_or_404(Vendor, name=request.POST['vendor'])
            vendor.save()
        item.vendor = vendor
    item.save()

    context_instance = {'item': item}

    return render(
        request,
        'inventory/update_grocery.json',
        context_instance,
        content_type="application/json"
    )


def create_grocery(request):
    item = Grocery(upc=request.POST['upc'])
    if 'price' in request.POST:
        item.price = request.POST['price']
    if 'name' in request.POST:
        item.name = request.POST['name']
    if 'scalable' in request.POST:
        if request.POST['scalable'] == 'true':
            item.scalable = True
        else:
            item.scalable = False
    if 'taxable' in request.POST:
        if request.POST['taxable'] == 'true':
            item.taxable = True
        else:
            item.taxable = False
    if 'vendor' in request.POST:
        try:
            vendor = Vendor.objects.get(name=request.POST['vendor'])
        except ObjectDoesNotExist:
            vendor = get_object_or_404(Vendor, request.POST['vendor'])
            vendor.save()
        item.vendor = vendor
    item.save()

    context_instance = {'item': item}
    return render(
        request,
        'inventory/update_grocery.json',
        context_instance,
        content_type="application/json"
    )


def update_produce(request):
    item = get_object_or_404(Produce, plu=request.POST['plu'])

    if 'price' in request.POST:
        item.price = request.POST['price']
    if 'name' in request.POST:
        item.name = request.POST['name']
    if 'scalable' in request.POST:
        if request.POST['scalable'] == 'true':
            item.scalable = True
        else:
            item.scalable = False
    if 'taxable' in request.POST:
        if request.POST['taxable'] == 'true':
            item.taxable = True
        else:
            item.taxable = False
    if 'variety' in request.POST:
        item.variety = request.POST['variety']
    if 'size' in request.POST:
        item.size = request.POST['size']
    if 'botanical' in request.POST:
        item.botanical = request.POST['botanical']
    item.save()

    context_instance = {'item': item}

    return render(
        request,
        'inventory/update_produce.json',
        context_instance,
        content_type="application/json"
    )


def create_produce(request):
    item = Produce(plu=request.POST['plu'])
    if 'price' in request.POST:
        item.price = request.POST['price']
    if 'name' in request.POST:
        item.name = request.POST['name']
    if 'variety' in request.POST:
        item.variety = request.POST['variety']
    if 'size' in request.POST:
        item.size = request.POST['size']
    if 'botanical' in request.POST:
        item.botanical = request.POST['botanical']
    if 'scalable' in request.POST:
        if request.POST['scalable'] == 'true':
            item.scalable = True
        else:
            item.scalable = False
    if 'taxable' in request.POST:
        if request.POST['taxable'] == 'true':
            item.taxable = True
        else:
            item.taxable = False
    item.save()

    context_instance = {'item': item}
    return render(
        request,
        'inventory/update_produce.json',
        context_instance,
        content_type="application/json"
    )
