# Generated by Django 4.2.5 on 2023-11-01 04:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('vehicles', '0022_remove_maintenancejob_date_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='maintenancerecord',
            name='job',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='maintenance_record', to='vehicles.maintenancejob'),
        ),
    ]