from django.test import TestCase
from register.models import Transaction
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
