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
import time
from django.core.exceptions import ObjectDoesNotExist


class Shift(models.Model):
    begin_date = models.DateTimeField(auto_now=True)
    finish_date = models.DateTimeField(null=True)

    def __unicode__(self):
        return str(self.begin_date) + ' to ' + str(self.finish_date)

    def end_shift(self):
        if self.finish_date is None:
            self.print_z_report()
            self.finish_date = timezone.now()
            self.save()
            return

    def create_transaction(self):
        if self.finish_date is None:
            return self.transaction_set.create(begin_date=timezone.now())

    @staticmethod
    def get_current():
        try:
            current_shift = Shift.objects.get(finish_date=None)
        except ObjectDoesNotExist:
            current_shift = Shift()
            current_shift.save()
        return current_shift

    def get_totals(self):
        sub_total = Decimal(0.0)
        tax = Decimal(0.0)
        total = Decimal(0.0)
        transaction_count = 0
        for transaction in self.transaction_set.all():
            transaction_count += 1
            totals = transaction.get_totals()
            sub_total = sub_total + totals.sub_total
            tax = tax + totals.tax_total
        total = sub_total + tax
        shift_total = ShiftTotal(sub_total, tax, total, transaction_count)
        return shift_total

    def print_z_report(self):
        z = ZReport(self)
        z.print_out()

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
        if self.finish_date is None:
            try:
                self.print_receipt()
            except PrinterNotFound:
                raise
            finally:
                self.finish_date = timezone.now()
                self.save()

    @staticmethod
    def get_current():
        try:
            current_transaction = Transaction.objects.get(finish_date=None)
        except ObjectDoesNotExist:
            current_transaction = Shift.get_current().create_transaction()
        return current_transaction

    def print_receipt(self):
        r = Receipt(self)
        r.print_out()

    def create_line_item(self, item, quantity, scale=None):
        if self.finish_date is None:
            try:
                code = item.upc
                description = item.vendor.name + ' ' + item.name
            except AttributeError:
                code = item.plu
                description = (item.size + ' ' + item.name) if item.size\
                    else item.name
            return self.lineitem_set.create(
                item=item,
                quantity=quantity,
                code=code,
                scale=scale,
                description=description,
                price=item.price
            )

    def create_tender(self, amount, type):
        if type in ('CASH', 'CHECK', 'CREDIT', 'EBT'):
            tender = self.tender_set.create(
                amount=amount,
                type=type
            )
            if self.get_totals().total <= 0:
                self.end_transaction()
            return tender

    def get_totals(self):
        total = Decimal(0.0)
        tax = Decimal(0.0)
        for line_item in self.lineitem_set.all():
            if line_item.status == 'ACTIVE':
                total = total + line_item.price
                if line_item.item.taxable:
                    tax = Decimal(tax) + line_item.price * Decimal('.07')
        tax = tax.quantize(Decimal(10) ** -2).normalize()
        paid_total = 0
        for tender in self.tender_set.all():
            paid_total = paid_total + tender.amount
        transaction_total = TransactionTotal(total, tax, paid_total)
        return transaction_total

    def cancel(self):
        self.status = 'CANCELED'
        self.end_transaction()
        for line_item in self.lineitem_set.all():
            line_item.cancel()
            line_item.save()

    class Meta:
        ordering = ['begin_date']


class LineItem(models.Model):
    transaction = models.ForeignKey(Transaction)
    code = models.CharField(max_length=30)
    quantity = models.DecimalField(max_digits=15, decimal_places=0)
    scale = models.DecimalField(max_digits=19, decimal_places=4, null=True)
    description = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=17, decimal_places=2)
    item = models.ForeignKey('inventory.Item')
    status = models.CharField(max_length=8, default='ACTIVE')

    def __unicode__(self):
        return str(self.scale) + ' x ' + self.description + ' ' +\
            self.description

    def total(self):
        return self.price * self.quantity

    def cancel(self):
        self.status = 'INACTIVE'


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


class ShiftTotal():

    def __init__(self, sub_total, tax_total, total, transaction_count):
        self.sub_total = sub_total
        self.tax_total = tax_total
        self.total = total
        self.transaction_count = transaction_count


class Receipt():

    def __init__(self, transaction, lines=None):
        self.transaction = transaction
        self.header = settings.RECEIPT_HEADER
        self.footer = settings.RECEIPT_FOOTER
        self.lines = lines
        self.printer = Printer(settings.PRINTER)
        self.printer.open()

    def print_out(self):
        self.print_header()
        self.print_body()
        self.print_footer()
        self.printer.kick_drawer()
        self.printer.cut()
        self.printer.close()

    def print_header(self):
        self.printer.print_line('\n'.join(settings.RECEIPT_HEADER))
        self.printer.print_line(
            time.strftime('%Y-%m-%d %H:%M:%S') + '\n' + '\n'
        )

    def print_footer(self):
        self.printer.print_line('\n'.join(settings.RECEIPT_FOOTER))

    def print_body(self):
        trans_totals = self.transaction.get_totals()
        for line_item in self.transaction.lineitem_set.all():
            self.printer.print_line(
                str(line_item.quantity).ljust(4) +
                line_item.description.ljust(38)[:38] +
                "{:13,.2f}".format(line_item.price) +
                (line_item.item.taxable and 'T' or ' ') + '\n'
            )
        self.printer.print_line('\n')
        self.printer.print_line(
            'SubTotal: ' + "{:16,.2f}".format(trans_totals.sub_total) +
            ' Tax: ' + "{:23,.2f}".format(trans_totals.tax_total) + '\n'
        )
        self.printer.print_line(
            'Total: ' + "{:19,.2f}".format(trans_totals.sub_total +
                                           trans_totals.tax_total) +
            ' Change: ' +
            "{:20,.2f}".format(
                trans_totals.total) +
            '\n\n'
        )


class ZReport():

    def __init__(self, shift):
        self.shift = shift
        self.printer = Printer(settings.PRINTER)
        self.printer.open()

    def print_out(self):
        totals = self.shift.get_totals()
        self.printer.print_line(
            'Transactions: ' + str(totals.transaction_count) + '\n'
        )
        self.printer.print_line(
            'SubTotal:     ' + str(totals.sub_total) + '\n')
        self.printer.print_line(
            'TaxTotal:     ' + str(totals.tax_total) + '\n')
        self.printer.print_line('Total:        ' + str(totals.total) + '\n')
        self.printer.kick_drawer()
        self.printer.cut()
        self.printer.close()


class Printer():

    def __init__(self, spool):
        self.spool = spool

    def open(self):
        try:
            self._printer = open(self.spool, 'w')
        except FileNotFoundError:
            raise PrinterNotFound(
                'Unable to locate printer "' + self.spool + '".'
            )

    def close(self):
        self._printer.close()

    def print_line(self, line):
        self._printer.write(line)

    def cut(self):
        for i in range(8):
            self.print_line('\n')
        self._printer.write(chr(27) + chr(105) + chr(10))

    def kick_drawer(self):
        self._printer.write(
            chr(27) + chr(112) + chr(0) + chr(48) + '0' + chr(10)
        )


class PrinterNotFound(Exception):

    def __init__(self, value):
        self.value = value

    def __str__(self):
        return self.value
