from datetime import datetime
from typing import Any
from django.utils import timezone
from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import status
from rest_framework.response import Response

from chat.logic._common import request_data_field
from chat.logic.message import _get_messages_data, _set_chat_visualized
from chat.models import ChatModel, MessagesModel
from chat.serializers import SMessages


def get_all_last_messages(data: dict, user: User, request_data: dict) -> Response:
    chats = ChatModel.objects.filter(user_1_id=user) | ChatModel.objects.filter(user_2_id=user)
    data['last_messages'] = _get_all_new_and_deleted_messages(chats, user, request_data)
    data['date'] = timezone.now()

    return Response(data, status=status.HTTP_200_OK)


def _get_all_new_and_deleted_messages(chats: list[ChatModel], user: User, request_data: dict) -> list[dict[str, list[Any] | bool | Any]]:
    last_messages = []
    for chat in chats:
        chats_has_news = chat.user_1_has_new if chat.user_1_id == user else chat.user_2_has_new
        chats_vizualised_date = chat.user_1_visualized if chat.user_1_id == user else chat.user_2_visualized

        if not chats_has_news:
            last_messages.append({
                'chat_id': chat.pk,
                'has_new': chats_has_news,
                'deleted_messages': [],
                'new_messages': [],
                'visualized': chats_vizualised_date
            })
            continue

        deleted_messages: list[MessagesModel] = MessagesModel.objects.filter(~Q(user=user), chat=chat, delete=True)
        new_messages: list[MessagesModel] = MessagesModel.objects.filter(
            ~Q(user=user), chat=chat, sended_now=True, delete=False
        )

        new_messages_data = _get_messages_data(new_messages, chat.priv_key)
        new_messages_data = SMessages(new_messages_data, many=True).data

        last_messages.append({
            'chat_id': chat.pk,
            'has_new': chats_has_news,
            'deleted_messages': [msg.pk for msg in deleted_messages],
            'new_messages': new_messages_data,
            'visualized': chats_vizualised_date
        })

        _set_visualized_messages(request_data, user, chat)

        for msg in deleted_messages:
            msg.file.delete()
        deleted_messages.delete()

        for msg in new_messages:
            msg.sended_now = False
            msg.save()

        if chat.user_1_id == user:
            chat.user_1_has_new = False
        else:
            chat.user_2_has_new = False
        chat.save()
        
    return last_messages


def _set_visualized_messages(request_data: dict, user: User, chat: ChatModel) -> None:
    try:
        request_data_field(request_data, 'chat_id', int)

        if chat.pk != request_data['chat_id']:
            raise ValueError()
    except ValueError:
        pass
    except ChatModel.DoesNotExist:
        pass
    else:
        _set_chat_visualized(chat, user, False)
