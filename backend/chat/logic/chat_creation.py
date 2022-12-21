import rsa
from django.contrib.auth.models import User
from django.utils import timezone

from chat.models import ChatModel, MessagesModel

#
# # def create_new_chat(user_1: User, user_2: User) -> None:
# #
# #     ChatModel.objects.create(
# #         pub_key=pub_key,
# #         priv_key=priv_key,
# #         user_1_id=user_1,
# #         user_2_id=user_2
# #     )
# {
#     "send_to": 2
# }
#
# def send_message(chat: ChatModel, message: str, user: User) -> None:
#     pub_key = getattr(chat, 'pub_key')
#     new_message = message.encode('utf-8')
#     new_message = rsa.encrypt(new_message, pub_key)
#
#     msg = MessagesModel.objects.create(
#         user=user, chat=chat,
#         message=new_message
#     )
#     msg.save()
#
#
# def read_message(chat: ChatModel, message: bytes) -> str:
#     priv_key = getattr(chat, 'priv_key')
#     new_message = rsa.decrypt(message, priv_key).decode('utf8')
#     return new_message
