# Generated by Django 4.1.4 on 2022-12-28 00:12

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0007_alter_messagesmodel_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='messagesmodel',
            name='date',
            field=models.DateTimeField(default=datetime.datetime(2022, 12, 28, 0, 12, 5, 614349, tzinfo=datetime.timezone.utc)),
        ),
    ]