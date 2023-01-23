from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
from picklefield.fields import PickledObjectField

from chat.constants.messages import ACCEPT_FILES_TYPES, ACCEPT_FILES_SIZE
from chat.logic.format_checker import ContentTypeRestrictedFileField


class ChatModel(models.Model):
    pub_key = PickledObjectField()
    priv_key = PickledObjectField()
    user_1_id = models.ForeignKey(
        User, on_delete=models.CASCADE,
        unique=False, related_name='user_1_id',
        related_query_name='user_1_id'
    )
    user_2_id = models.ForeignKey(
        User, on_delete=models.CASCADE,
        unique=False, related_name='user_2_id',
        related_query_name='user_2_id'
    )
    user_1_visualized = models.DateTimeField(default=timezone.now)
    user_2_visualized = models.DateTimeField(default=timezone.now)
    user_1_has_new = models.BooleanField(default=True)
    user_2_has_new = models.BooleanField(default=True)


class MessagesModel(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE,
        unique=False
    )
    chat = models.ForeignKey(
        ChatModel, on_delete=models.CASCADE,
        unique=False
    )
    message = models.BinaryField()
    file = ContentTypeRestrictedFileField(content_types=ACCEPT_FILES_TYPES,
                                          max_upload_size=ACCEPT_FILES_SIZE, blank=True, null=True)
    date = models.DateTimeField(default=timezone.now)
    delete = models.BooleanField(default=False)
    sended_now = models.BooleanField(default=True)
