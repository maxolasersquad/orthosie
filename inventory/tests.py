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

from django.test import TestCase
from inventory.models import Vendor
from inventory.models import Item

class VendorTest(TestCase):
    def setUp(self):
        self.vendor = Vendor(name='Brand X')
    def test_vendor_name(self):
        self.assertEqual(self.vendor.name, 'Brand X')

class ItemTest(TestCase):
    def setUp(self):
        self.vendor = Vendor(name='Brand X')
        self.item = Item(upc='12345', name='Product X', vendor=self.vendor)
    def test_item_upc(self):
        self.assertEqual(self.item.upc, '12345')
    def test_item_name(self):
        self.assertEqual(self.item.name, 'Product X')
    def test_item_vendor(self):
        self.assertEqual(self.item.vendor.name, 'Brand X')
