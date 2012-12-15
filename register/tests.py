from django.test import TestCase
from register.models import Shift
from register.models import Transaction
from register.models import LineItem
from inventory.models import Item
from inventory.models import Vendor
from datetime import datetime

class ShiftTest(TestCase):
    def setUp(self):
        self.shift = Shift()
    def test_end_shift(self):
        self.shift.end_shift()
        self.assertEqual(self.shift.finish_date, datetime.now)
    def test_create_transaction(self):
        transaction = self.shift.create_transaction()
        self.assertIsNotNone(transaction)

class TransactionTest(TestCase):
    def setUp(self):
        self.transaction = Transaction()
        self.vendor = Vendor(name='Brand X')
        self.item = Item(upc='12345',name='Product X',vendor=self.vendor)
    def test_end_transaction(self):
        self.transaction.end_transaction()
        self.assertEqual(self.transaction.finish_date, datetime.now)
    def test_create_line_item(self):
        line_item = self.transaction.create_line_item(self.item, 1, None)
        self.assertIsNotNone(line_item)

class LineItemTest(TestCase):
    def setUp(self):
        self.vendor = Vendor(name='Brand X')
        self.item = Item(upc='12345',name='Product X',vendor=self.vendor)
        self.transaction = Transaction(begin_date=datetime(2012,1,1,8,0,0),finish_date=datetime(2012,1,1,8,7,0),status='Started')
