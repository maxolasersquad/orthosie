from django.db import models

class Vendor(models.Model):
    name = models.CharField(max_length=50)

class Item(models.Model):
    upc = models.CharField(max_length=30)
    name = models.CharField(max_length=30)
    price = models.DecimalField(max_digits=17, decimal_places=2)
    taxable = models.BooleanField()
    food_stamp = models.BooleanField()
    vendor = models.ForeignKey(Vendor)
