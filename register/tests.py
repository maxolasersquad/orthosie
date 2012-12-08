from django.test import TestCase
from register.models import Transaction

class TransactionTest(TestCase):
    def setUp(self):
        self.transaction = Transaction(begin_date=)
