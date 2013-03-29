from inventory.models import Item, Vendor
from register.models import Shift, Transaction, LineItem
from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.reverse import reverse
from rest_framework.response import Response
from orthosie.serializers import ItemSerializer, VendorSerializer, ShiftSerializer, TransactionSerializer, LineItemSerializer

@api_view(['GET'])
def api_root(request, format=None):
    """
    The entry endpoint of our API.
    """
    return Response({
        'item': reverse('item-list', request=request),
    })

class ItemList(generics.ListCreateAPIView):
    """
    API endpoint that represents a list of items.
    """
    model = Item
    serializer_class = ItemSerializer

class ItemDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint that represents a single item.
    """
    model = Item
    serializer_class = ItemSerializer

class VendorList(generics.ListCreateAPIView):
    """
    API endpoint that represents a list of vendors.
    """
    model = Vendor
    serializer_class = VendorSerializer

class VendorDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint that represents a single vendor.
    """
    model = Vendor
    serializer_class = VendorSerializer

class ShiftList(generics.ListCreateAPIView):
    """
    API endpoint that represents a list of shift.
    """
    model = Shift
    serializer_class = ShiftSerializer

class ShiftDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint that represents a single vendor.
    """
    model = Shift
    serializer_class = ShiftSerializer

class TransactionList(generics.ListCreateAPIView):
    """
    API endpoint that represents a list of transaction.
    """
    model = Transaction
    serializer_class = TransactionSerializer

class TransactionDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint that represents a single transaction.
    """
    model = Transaction
    serializer_class = TransactionSerializer

class LineItemList(generics.ListCreateAPIView):
    """
    API endpoint that represents a list of line items.
    """
    model = LineItem
    serializer_class = LineItemSerializer

class LineItemDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint that represents a single line items.
    """
    model = LineItem
    serializer_class = LineItemSerializer
