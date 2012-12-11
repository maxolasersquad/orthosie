from django.test import TestCase
from register.models import Transaction
from datetime import date

class TransactionTest(TestCase):
    def setUp(self):
        self.transaction = Transaction(begin_date=date(2012,1,1))
    def test_transaction_begin_date(self):
        self.assertEqual(self.transaction.begin_date, date(2012,1,1))
