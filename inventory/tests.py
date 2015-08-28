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
from inventory.models import Grocery
from inventory.models import Upc
from inventory.models import Produce


class VendorTest(TestCase):

    def setUp(self):
        self.vendor = Vendor(name='Brand X')

    def test_vendor_name(self):
        self.assertEqual(self.vendor.name, 'Brand X')


class GroceryTest(TestCase):

    def setUp(self):
        self.vendor = Vendor(name='Brand X')
        self.grocery = Grocery(
            upc='12345',
            name='Product X',
            vendor=self.vendor
        )

    def test_grocery_upc(self):
        self.assertEqual(self.grocery.upc, '12345')

    def test_grocery_name(self):
        self.assertEqual(self.grocery.name, 'Product X')

    def test_grocery_vendor(self):
        self.assertEqual(self.grocery.vendor.name, 'Brand X')


class ProduceTest(TestCase):

    def setUp(self):
        self.produce = Produce(
            name='Kumquat',
            plu=4303,
            botanical='Fortunella spp.'
        )


class UpcTest(TestCase):

    def test_verify_correct_check_digit(self):
        self.test_upc = Upc('008274000061')
        self.assertEqual(self.test_upc.get_check_digit(), 1)
        self.test_upc = Upc('090341100019')
        self.assertEqual(self.test_upc.get_check_digit(), 9)

    def test_verify_check_digit_passes(self):
        self.test_upc = Upc('008274000061')
        self.assertTrue(self.test_upc.verify_check_digit())

    def test_verify_check_digit_fails(self):
        self.test_upc = Upc('008274000065')
        self.assertFalse(self.test_upc.verify_check_digit())
