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

from inventory.models import Item, Vendor
from register.models import Shift, Transaction, LineItem
from rest_framework import serializers


class ItemSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Item
        fields = (
            'url',
            'upc',
            'name',
            'price',
            'scalable',
            'taxable',
            'vendor'
        )


class VendorSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Vendor
        fields = ('url', 'name')


class ShiftSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Shift
        fields = ('url', 'begin_date', 'finish_date')


class TransactionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Transaction
        fields = ('url', 'shift', 'begin_date', 'finish_date', 'status')


class LineItemSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = LineItem
        fields = (
            'url',
            'transaction',
            'upc',
            'quantity',
            'scale',
            'description',
            'price',
            'item'
        )