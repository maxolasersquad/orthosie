from django.db import models
from datetime import datetime

class Shift(models.Model):
    begin_date = models.DateTimeField(auto_now=True)
    finish_date = models.DateTimeField(null=True)

    def end_shift(self):
        self.finish_date = datetime.now

    def create_transaction(self):
        return Transaction(shift=self)

class Transaction(models.Model):
    begin_date = models.DateTimeField()
    finish_date = models.DateTimeField(null=True)
    status = models.CharField(max_length=10, default='Started')
    shift = models.ForeignKey(Shift)

    def end_transaction(self):
        self.finish_date = datetime.now

    def create_line_item(self, item, quantity, scale):
        return LineItem(\
            quantity=quantity,\
            scale=scale,\
            description=item.vendor.name + ' ' + item.name,\
            item=item,\
            price=item.price,\
            taxable=item.taxable,\
            food_stamp=item.food_stamp,\
            transaction=self\
        )

class LineItem(models.Model):
    quantity = models.DecimalField(max_digits=15, decimal_places=0)
    scale = models.DecimalField(max_digits=19, decimal_places=4)
    description = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=17, decimal_places=2)
    taxable = models.BooleanField()
    food_stamp = models.BooleanField()
    transaction = models.ForeignKey(Transaction)
    item = models.ForeignKey('inventory.Item')
