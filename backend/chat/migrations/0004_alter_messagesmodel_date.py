# Generated by Django 4.1.4 on 2022-12-21 22:54

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0003_messagesmodel_chat_alter_messagesmodel_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='messagesmodel',
            name='date',
            field=models.DateTimeField(default=datetime.datetime(2022, 12, 21, 22, 54, 39, 786794, tzinfo=datetime.timezone.utc)),
        ),
    ]
