# Generated by Django 4.1.4 on 2022-12-22 00:33

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0005_alter_messagesmodel_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='messagesmodel',
            name='date',
            field=models.DateTimeField(default=datetime.datetime(2022, 12, 22, 0, 32, 38, 982986, tzinfo=datetime.timezone.utc)),
        ),
    ]
