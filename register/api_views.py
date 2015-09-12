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

from django.shortcuts import get_object_or_404
from rest_framework import renderers, status, viewsets
from rest_framework.decorators import api_view, detail_route, list_route
from rest_framework.response import Response
from rest_framework.reverse import reverse
from register.models import Shift, Transaction, LineItem
from inventory.models import Grocery, Produce
from register.serializers import ShiftSerializer, TransactionSerializer
from register.serializers import LineItemSerializer


@api_view(['GET'])
def api_root(request, format=None):
    """
    The entry endpoint of our API.
    """
    return Response({
        'shift': reverse('shift-list', request=request),
        'transaction': reverse('transaction-list', request=request),
        'lineitem': reverse('lineitem-list', request=request),
    })


class ShiftViewSet(viewsets.ModelViewSet):

    """
    API endpoint that allows shifts to be viewed or edited.
    """
    queryset = Shift.objects.all()
    serializer_class = ShiftSerializer


class TransactionViewSet(viewsets.ModelViewSet):

    """
    API endpoint that allows transactions to be viewed or edited.
    """
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

    @detail_route(
        methods=['post']
    )
    def ring_upc(self, request, *args, **kwargs):
        upc = request.POST['upc']
        quantity = request.POST['quantity']
        if len(upc) != 12:
            return Response('Invalid UPC', status=status.HTTP_400_BAD_REQUEST)
        grocery = get_object_or_404(Grocery, upc=upc)
        transaction = self.get_object()
        line_item = transaction.create_line_item(grocery, quantity)
        serializer = LineItemSerializer(line_item, context={'request': request, 'format': self.format_kwarg, 'view': LineItemViewSet})
        return Response(serializer.data)

    @detail_route(
        methods=['post'],
        renderer_classes=[renderers.StaticHTMLRenderer]
    )
    def ring_plu(self, request, *args, **kwargs):
        plu = request.GET['plu']
        quantity = request.GET['quantity']
        if 4 <= len(plu) <= 5:
            return Response('Invalid PLU', status=status.HTTP_400_BAD_REQUEST)
        produce = get_object_or_404(Produce, plu=plu)
        transaction = self.get_object()
        line_item = transaction.create_line_item(produce, quantity)
        return Response({'success': True})

    @detail_route(
        methods=['post'],
        renderer_classes=[renderers.StaticHTMLRenderer]
    )
    def get_totals(self, request, *args, **kwargs):
        transaction = self.get_object
        return Response({'success': True})

    @list_route()
    def get_current(self, request, *args, **kwargs):
        transaction = Transaction.get_current()
        serializer = self.get_serializer(transaction)
        return Response(serializer.data)


class LineItemViewSet(viewsets.ModelViewSet):

    """
    API endpoint that allows line items to be viewed or edited.
    """
    queryset = LineItem.objects.all()
    serializer_class = LineItemSerializer
