# Generated by Django 4.2.5 on 2023-11-02 05:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_driverreport'),
    ]

    operations = [
        migrations.AddField(
            model_name='admin',
            name='phone',
            field=models.CharField(default='', max_length=100),
            preserve_default=False,
        ),
    ]
