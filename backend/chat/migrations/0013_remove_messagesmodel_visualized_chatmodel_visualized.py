# Generated by Django 4.1.4 on 2023-01-13 17:47

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0012_messagesmodel_visualized_alter_messagesmodel_file'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='messagesmodel',
            name='visualized',
        ),
        migrations.AddField(
            model_name='chatmodel',
            name='visualized',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
