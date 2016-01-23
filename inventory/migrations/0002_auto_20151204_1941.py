# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='grocery',
            name='vendor',
            field=models.ForeignKey(blank=True, default=None, to='inventory.Vendor'),
        ),
        migrations.AlterField(
            model_name='produce',
            name='plu',
            field=models.IntegerField(unique=True),
        ),
    ]
