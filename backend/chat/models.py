from django.contrib.auth.models import User
from django.db import models
from picklefield.fields import PickledObjectField


class ChatModel(models.Model):
    pub_key = PickledObjectField()
    priv_key = PickledObjectField()
    messages = models.JSONField()
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
