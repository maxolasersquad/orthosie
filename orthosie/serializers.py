from inventory.models import Item, Vendor
from register.models import Shift, Transaction, LineItem
from rest_framework import serializers

class ItemSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Item
        fields = ('url', 'upc', 'name', 'price', 'scalable', 'taxable', 'vendor')

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
        fields = ('url', 'transaction', 'upc', 'quantity', 'scale', 'description', 'price', 'item')
