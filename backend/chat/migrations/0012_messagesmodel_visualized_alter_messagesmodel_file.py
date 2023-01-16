# Generated by Django 4.1.4 on 2023-01-13 17:24

import chat.logic.format_checker
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0011_alter_messagesmodel_file'),
    ]

    operations = [
        migrations.AddField(
            model_name='messagesmodel',
            name='visualized',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='messagesmodel',
            name='file',
            field=chat.logic.format_checker.ContentTypeRestrictedFileField(blank=True, null=True, upload_to='upload_files/% Y/% m/% d/'),
        ),
    ]