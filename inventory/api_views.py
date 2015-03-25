#    Copyright 2013 Jack David Baucum
#
#    This file is part of Orthosie.
#
#    Orthosie is free software: you can redistribute it and/or modify
#    it under the terms of the GNU General Public License as published by
#    the Free Software Foundation, either version 3 of the License, or
#    (at your option) any later version.
#
#    Orthosie is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU General Public License for more details.
#
#    You should have received a copy of the GNU General Public License
#    along with Orthosie.  If not, see <http://www.gnu.org/licenses/>.

from rest_framework import viewsets, renderers
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from inventory.serializers import ItemSerializer, GrocerySerializer
from inventory.serializers import ProduceSerializer, VendorSerializer
from inventory.models import Item, Grocery, Produce, Vendor


@api_view(['GET'])
def api_root(request, format=None):
    """
    The entry endpoint of our API.
    """
    return Response({
        'item': reverse('item-list', request=request),
        'grocery': reverse('grocery-list', request=request),
        'produce': reverse('produce-list', request=request),
        'vendor': reverse('vendor-list', request=request)
    })


class ItemViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows items to be viewed or edited.
    """
    queryset = Item.objects.all()
    serializer_class = ItemSerializer


class GroceryViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groceries to be viewed or edited.
    """
    queryset = Grocery.objects.all()
    serializer_class = GrocerySerializer


class ProduceViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows produce to be viewed or edited.
    """
    queryset = Produce.objects.all()
    serializer_class = ProduceSerializer


class VendorViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows vendors to be viewed or edited.
    """
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
