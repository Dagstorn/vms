# Generated by Django 4.2.5 on 2023-10-19 07:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0012_alter_completedroute_time_spent'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='appointment',
            options={'ordering': ['-time_from']},
        ),
        migrations.AlterField(
            model_name='task',
            name='from_point',
            field=models.CharField(max_length=200, verbose_name='departure point'),
        ),
        migrations.AlterField(
            model_name='task',
            name='to_point',
            field=models.CharField(max_length=200, verbose_name='arrival point'),
        ),
    ]