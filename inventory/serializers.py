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

from inventory.models import Item, Grocery, Produce, Vendor
from rest_framework import serializers


class ItemSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Item
        depth = 1


class GrocerySerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Grocery
        depth = 1


class ProduceSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Produce
        depth = 1


class VendorSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Vendor
        depth = 1
