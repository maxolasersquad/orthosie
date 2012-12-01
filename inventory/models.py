from django.db import models

class Vendor(models.Model):
    name = models.CharField(max_length=50)

class Item(models.Model):
    upc = models.CharField(max_length=30)
    name = models.CharField(max_length=30)
    vendor = models.ForeignKey(Vendor)
