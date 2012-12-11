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
