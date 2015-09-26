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

from register.models import Shift, Transaction, LineItem, Tender, TransactionTotal
from rest_framework import serializers


class ShiftSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Shift


class TransactionSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Transaction


class LineItemSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = LineItem


class TenderSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Tender


class TransactionTotalSerializer(serializers.Serializer):

    class Meta:
        model = TransactionTotal

