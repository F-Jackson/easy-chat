from datetime import datetime

from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response

from chat.logic._common import request_data_field
from chat.models import ChatModel
from chat.serializers import LastMessagesSerializer


def get_all_last_messages(data: dict, user: User, request_data: dict) -> Response:
    chats = ChatModel.objects.filter(user_1_id=user) | ChatModel.objects.filter(user_2_id=user)
    serializer = LastMessagesSerializer(chats, many=True)
    data['last_messages'] = serializer.data

    _set_visualized_messages(request_data, chats)

    return Response(data, status=status.HTTP_200_OK)


def _set_visualized_messages(request_data: dict, chats: list[ChatModel]) -> None:
    try:
        request_data_field(request_data, 'chat_id', int)
        request_data_field(request_data, 'visualized', datetime)

        chat_id = request_data['chat_id']
        visualized = request_data['visualized']
    except ValueError:
        pass
    else:
        chat = next((chat for chat in chats if chat.pk == chat_id), None)
        if chat is not None:
            chat.visualized = visualized
            chat.save()

