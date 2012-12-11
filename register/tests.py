from django.test import TestCase
from register.models import Transaction
from register.models import LineItem
from inventory.models import Item
from inventory.models import Vendor
from datetime import datetime

class TransactionTest(TestCase):
    def setUp(self):
        self.vendor = Vendor(name='Brand X')
        self.item = Item(upc='12345',name='Product X',vendor=self.vendor)
        self.transaction = Transaction(begin_date=datetime(2012,1,1,8,0,0),finish_date=datetime(2012,1,1,8,7,0),status='Started',item=self.item)
    def test_transaction_begin_date(self):
        self.assertEqual(self.transaction.begin_date, datetime(2012,1,1,8,0,0))
    def test_transaction_finish_date(self):
        self.assertEqual(self.transaction.finish_date, datetime(2012,1,1,8,7,0))
    def test_transaction_status(self):
        self.assertEqual(self.transaction.status, 'Started')
    def test_transaction_item(self):
        self.assertEqual(self.transaction.item.name, 'Product X')

class LineItemTest(TestCase):
    def setUp(self):
        self.vendor = Vendor(name='Brand X')
        self.item = Item(upc='12345',name='Product X',vendor=self.vendor)
        self.transaction = Transaction(begin_date=datetime(2012,1,1,8,0,0),finish_date=datetime(2012,1,1,8,7,0),status='Started',item=self.item)
        self.line_item = LineItem(quantity=2,scale=None,description='Product X',price=2.00,tax=.14,food_stamp=False,transaction=self.transaction)

    def test_line_item_quantity(self):
        self.assertEqual(self.line_item.quantity, 2)
    def test_line_item_scale(self):
        self.assertIsNone(self.line_item.scale)
    def test_line_item_description(self):
        self.assertEqual(self.line_item.description, 'Product X')
    def test_line_item_price(self):
        self.assertEqual(self.line_item.price, 2.00)
    def test_line_item_tax(self):
        self.assertEqual(self.line_item.tax, .14)
    def test_line_item_food_stamp(self):
        self.assertFalse(self.line_item.food_stamp)
    def test_line_item_transaction(self):
        self.assertEqual(self.line_item.transaction.begin_date, datetime(2012,1,1,8,0,0))
