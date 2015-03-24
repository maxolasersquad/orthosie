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

from rest_framework import viewsets, generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from register.models import Shift, Transaction, LineItem
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


class LineItemViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows line items to be viewed or edited.
    """
    queryset = LineItem.objects.all()
    serializer_class = LineItemSerializer
