# Generated by Django 4.2.5 on 2023-11-02 17:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('vehicles', '0003_alter_fuelingproof_options_alter_fuelingtask_options_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='fuelingtask',
            old_name='tasK',
            new_name='task',
        ),
    ]