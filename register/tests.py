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
from register.models import Shift
from inventory.models import Grocery
from inventory.models import Vendor
from django.utils import timezone
from decimal import Decimal


class ShiftTest(TestCase):

    def setUp(self):
        self.shift = Shift(begin_date=timezone.now())
        self.shift.save()

    def test_end_shift(self):
        self.shift.end_shift()
        self.assertIsNotNone(self.shift.finish_date)

    def test_cannot_end_ended_shift(self):
        self.shift.end_shift()
        finish_date = self.shift.finish_date
        self.shift.end_shift()
        self.assertEqual(self.shift.finish_date, finish_date)

    def test_create_transaction(self):
        transaction = self.shift.create_transaction()
        self.assertIsNotNone(transaction)

    def test_cannot_create_transaction_on_ended_shift(self):
        transaction = self.shift.create_transaction()
        self.shift.end_shift()
        transaction = self.shift.create_transaction()
        self.assertIsNone(transaction)


class TransactionTest(TestCase):

    def setUp(self):
        self.shift = Shift(begin_date=timezone.now())
        self.shift.save()
        self.transaction = self.shift.create_transaction()
        self.transaction.save()
        self.vendor = Vendor(name='Brand X')
        self.vendor.save()
        self.grocery = Grocery(
            upc='12345',
            name='Product X',
            vendor=self.vendor,
            price=23.45,
            taxable=True,
            scalable=False
        )
        self.grocery.save()

    def test_end_transaction(self):
        self.transaction.end_transaction()
        self.assertIsNotNone(self.transaction.finish_date)

    def test_cannot_end_ended_transaction(self):
        self.transaction.end_transaction()
        finish_date = self.transaction.finish_date
        self.transaction.end_transaction()
        self.assertEqual(self.transaction.finish_date, finish_date)

    def test_create_line_item(self):
        line_item = self.transaction.create_line_item(self.grocery, 1)
        self.assertIsNotNone(line_item)

    def test_cannot_create_line_item_on_ended_transaction(self):
        line_item = self.transaction.create_line_item(self.grocery, 1)
        self.transaction.end_transaction()
        line_item = self.transaction.create_line_item(self.grocery, 1)
        self.assertIsNone(line_item)

    def test_line_item_description(self):
        line_item = self.transaction.create_line_item(self.grocery, 1)
        self.assertEqual(line_item.description, 'Brand X Product X')

    def test_get_totals(self):
        line_item = self.transaction.create_line_item(self.grocery, 1)
        line_item.save()
        line_item = self.transaction.create_line_item(self.grocery, 1)
        line_item.save()
        transaction_total = self.transaction.get_totals()
        self.assertEqual(transaction_total.sub_total, Decimal('46.90'))
        self.assertEqual(transaction_total.tax_total, Decimal('3.28'))
        self.assertEqual(transaction_total.total, Decimal('50.18'))

    def test_paid_tender_ends_transaction(self):
        self.transaction.create_line_item(self.grocery, 1)
        self.transaction.create_tender(25.09, 'CASH')
        self.assertIsNotNone(self.transaction.finish_date)

    def test_transaction_totals_with_canceled_item(self):
        self.transaction.create_line_item(self.grocery, 1)
        self.transaction.create_line_item(self.grocery, 1).cancel()
        self.assertEqual(transaction_total.total, Decimal('50.18'))
        self.assertEqual(transaction_total.tax_total, Decimal('3.28'))
        self.assertEqual(transaction_total.total, Decimal('50.18'))

    def test_transaction_totals_with_canceled_item_again(self):
        line_item = self.transaction.create_line_item(self.grocery, 1)
        line_item.save()
        line_item = self.transaction.create_line_item(self.grocery, 1)
        line_item.cancel()
        line_item.save()
        transaction_total = self.transaction.get_totals()
        self.assertEqual(transaction_total.sub_total, Decimal('23.45'))
        self.assertEqual(transaction_total.tax_total, Decimal('1.64'))
        self.assertEqual(transaction_total.total, Decimal('25.09'))

    def test_cancel_sets_status(self):
        self.transaction.cancel()
        self.assertEqual(self.transaction.status, 'CANCELED')

    def test_cancel_cancels_children(self):
        self.transaction.create_line_item(self.grocery, 1)
        self.transaction.cancel()
        for line_item in self.transaction.lineitem_set.all():
            self.assertEqual(line_item.status, 'INACTIVE')

    def test_cancel_ends_shift(self):
        self.transaction.cancel()
        self.assertIsNotNone(self.transaction.finish_date)


class LineItemTest(TestCase):

    def setUp(self):
        self.shift = Shift(begin_date=timezone.now())
        self.shift.save()
        self.transaction = self.shift.create_transaction()
        self.transaction.save()
        self.vendor = Vendor(name='Brand X')
        self.vendor.save()
        self.grocery = Grocery(
            upc='12345',
            name='Product X',
            vendor=self.vendor,
            price=23.45,
            taxable=True,
            scalable=False
        )
        self.grocery.save()

    def test_line_item_total(self):
        line_item = self.transaction.create_line_item(self.grocery, 2)
        line_item.save()
        self.assertEqual(line_item.total(), Decimal(46.90))

    def test_can_cancel(self):
        line_item = self.transaction.create_line_item(self.grocery, 2)
        line_item.cancel()
        line_item.save()
        self.assertEqual(line_item.status, 'INACTIVE')
