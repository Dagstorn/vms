# Generated by Django 4.2.5 on 2023-10-17 07:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0010_completedroute_vehicle'),
    ]

    operations = [
        migrations.AlterField(
            model_name='completedroute',
            name='distance_covered',
            field=models.FloatField(),
        ),
    ]