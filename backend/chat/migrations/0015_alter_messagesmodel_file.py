# Generated by Django 4.1.4 on 2023-01-14 03:00

import chat.logic.format_checker
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0014_alter_messagesmodel_file'),
    ]

    operations = [
        migrations.AlterField(
            model_name='messagesmodel',
            name='file',
            field=chat.logic.format_checker.ContentTypeRestrictedFileField(blank=True, null=True, upload_to='upload_files/<function user_directory_path at 0x0000026D956A8A40>'),
        ),
    ]