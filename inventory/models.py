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


class Vendor(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __unicode__(self):
        return self.name

    def natural_key(self):
        return (self.name)

    class Meta:
        ordering = ['name']


class Item(models.Model):
    name = models.CharField(max_length=30)
    price = models.DecimalField(max_digits=17, decimal_places=2)
    scalable = models.BooleanField(default=False)
    taxable = models.BooleanField(default=False)

    def __unicode__(self):
        return self.name

    class Meta:
        ordering = ['name']


class Grocery(Item):
    upc = models.CharField(max_length=30, unique=True)
    vendor = models.ForeignKey(Vendor, default=None, blank=True, null=True)


class Produce(Item):
    plu = models.IntegerField(unique=True)
    variety = models.CharField(max_length=100)
    size = models.CharField(max_length=30, null=True)
    botanical = models.CharField(max_length=100, null=True)


class Upc:

    def __init__(self, upc):
        self.upc = upc

    def verify_check_digit(self):
        if str(self.get_check_digit()) != self.upc[-1]:
            return False
        return True

    def get_check_digit(self):
        check_digit = 0
        odd_pos = True
        for char in self.upc[:-1]:
            if odd_pos:
                check_digit += int(char) * 3
            else:
                check_digit += int(char)
            odd_pos = not odd_pos
        check_digit = (10 - check_digit % 10) % 10
        return check_digit
