# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Item',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True, auto_created=True, verbose_name='ID')),
                ('name', models.CharField(max_length=30)),
                ('price', models.DecimalField(decimal_places=2, max_digits=17)),
                ('scalable', models.BooleanField(default=False)),
                ('taxable', models.BooleanField(default=False)),
            ],
            options={
                'ordering': ['name'],
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Grocery',
            fields=[
                ('item_ptr', models.OneToOneField(serialize=False, to='inventory.Item', parent_link=True, primary_key=True, auto_created=True)),
                ('upc', models.CharField(unique=True, max_length=30)),
            ],
            options={
            },
            bases=('inventory.item',),
        ),
        migrations.CreateModel(
            name='Produce',
            fields=[
                ('item_ptr', models.OneToOneField(serialize=False, to='inventory.Item', parent_link=True, primary_key=True, auto_created=True)),
                ('plu', models.IntegerField(unique=True, max_length=5)),
                ('variety', models.CharField(max_length=100)),
                ('size', models.CharField(null=True, max_length=30)),
                ('botanical', models.CharField(null=True, max_length=100)),
            ],
            options={
            },
            bases=('inventory.item',),
        ),
        migrations.CreateModel(
            name='Vendor',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True, auto_created=True, verbose_name='ID')),
                ('name', models.CharField(unique=True, max_length=50)),
            ],
            options={
                'ordering': ['name'],
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='grocery',
            name='vendor',
            field=models.ForeignKey(null=True, default=None, blank=True, to='inventory.Vendor'),
            preserve_default=True,
        ),
    ]
