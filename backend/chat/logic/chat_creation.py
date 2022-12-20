import rsa
from django.contrib.auth.models import User

from chat.models import ChatModel


def create_new_chat(user_1: User, user_2: User):
    pub_key, priv_key = rsa.newkeys(512)
    ChatModel.objects.create(
        pub_key=pub_key,
        priv_key=priv_key,
        user_1_id=user_1,
        user_2_id=user_2
    )
