# Generated by Django 4.1.4 on 2022-12-21 01:52

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0002_remove_chatmodel_messages_messagesmodel'),
    ]

    operations = [
        migrations.AddField(
            model_name='messagesmodel',
            name='chat',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='chat.chatmodel'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='messagesmodel',
            name='date',
            field=models.DateTimeField(default=datetime.datetime(2022, 12, 21, 1, 52, 12, 106437, tzinfo=datetime.timezone.utc)),
        ),
    ]