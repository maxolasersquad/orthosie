from django.db import models

class Transaction(models.Model):
    begin_date = models.DateTimeField()
    finish_date = models.DateTimeField()
    status = models.CharField(max_length=10) 
    item = models.ForeignKey('inventory.Item')

class LineItem(models.Model):
    quantity = models.DecimalField(max_digits=15, decimal_places=0)
    scale = models.DecimalField(max_digits=19, decimal_places=4)
    description = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=17, decimal_places=2)
    tax = models.BooleanField()
    food_stamp = models.BooleanField()
    transaction = models.ForeignKey(Transaction)
