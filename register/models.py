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

from django.db import models
from django.utils import timezone
from django.conf import settings
from decimal import Decimal

class Shift(models.Model):
    begin_date = models.DateTimeField(auto_now=True)
    finish_date = models.DateTimeField(null=True)

    def __unicode__(self):
        return str(self.begin_date) + ' to ' + str(self.finish_date)

    def end_shift(self):
        if self.finish_date == None:
            self.finish_date = timezone.now()
            self.save()

    def create_transaction(self):
        if self.finish_date == None:
            return self.transaction_set.create(begin_date=timezone.now())

    class Meta:
        ordering = ['begin_date']

class Transaction(models.Model):
    shift = models.ForeignKey(Shift)
    begin_date = models.DateTimeField()
    finish_date = models.DateTimeField(null=True)
    status = models.CharField(max_length=10, default='Started')

    def __unicode__(self):
        return str(self.begin_date) + ' to ' + str(self.finish_date)

    def end_transaction(self):
        if self.finish_date == None:
            self.finish_date = timezone.now()
            self.save()

    def create_line_item(self, item, quantity, scale=None):
        if self.finish_date == None:
            return self.lineitem_set.create(\
                item=item,\
                quantity=quantity,\
                upc=item.upc,\
                scale=scale,\
                description=item.vendor.name + ' ' + item.name,\
                price=item.price\
            )

    def create_tender(self, amount, type):
        if type in ('CASH', 'CHECK', 'CREDIT', 'EBT'):
            tender = self.tender_set.create(\
                amount=amount,\
                type=type\
            )
            if self.get_totals().total <= 0:
                self.end_transaction()
            return tender

    def get_totals(self):
        total = Decimal(0.0)
        tax = Decimal(0.0)
        for line_item in self.lineitem_set.all():
            total = total + line_item.price
            if line_item.item.taxable:
                tax = Decimal(tax) + line_item.price * Decimal('.07')
        tax = tax.quantize(Decimal(10) ** -2).normalize()
        paid_total = 0
        for tender in self.tender_set.all():
            paid_total = paid_total + tender.amount
        transaction_total = TransactionTotal(total, tax, paid_total)
        return transaction_total

    class Meta:
        ordering = ['begin_date']

class LineItem(models.Model):
    transaction = models.ForeignKey(Transaction)
    upc = models.CharField(max_length=30)
    quantity = models.DecimalField(max_digits=15, decimal_places=0)
    scale = models.DecimalField(max_digits=19, decimal_places=4, null=True)
    description = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=17, decimal_places=2)
    item = models.ForeignKey('inventory.Item')

    def __unicode__(self):
        return str(self.scale) + ' x ' + self.description + ' ' + self.description

    def total(self):
        return self.price * self.quantity

class Tender(models.Model):
    transaction = models.ForeignKey(Transaction)
    amount = models.DecimalField(max_digits=17, decimal_places=2)
    type = models.CharField(max_length=30)

class TransactionTotal():
    def __init__(self, sub_total, tax_total, paid_total):
        self.sub_total = sub_total
        self.tax_total = tax_total
        self.paid_total = paid_total
        self.total = sub_total + tax_total - paid_total
