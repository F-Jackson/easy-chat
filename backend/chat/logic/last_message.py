from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response

from chat.models import ChatModel
from chat.serializers import LastMessagesSerializer


def get_all_last_messages(data: dict, user: User) -> Response:
    chats = ChatModel.objects.filter(user_1_id=user) | ChatModel.objects.filter(user_2_id=user)
    serializer = LastMessagesSerializer(chats, many=True)
    data['last_messages'] = serializer.data
    return Response(data, status=status.HTTP_200_OK)
