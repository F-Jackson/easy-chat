import rsa
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response

from chat.logic._common import send_error, request_data_field
from chat.models import ChatModel
from chat.serializers import ChatSerializer


def get_chat_info(data: dict, user: User) -> Response:
    queryset = ChatModel.objects.filter(user_1_id=user) | ChatModel.objects.filter(user_2_id=user)

    data['chats'] = []
    for model in queryset:
        chat_id = model.pk
        chats_has_news = model.user_1_has_new if model.user_1_id == user else model.user_2_has_new

        chat_data = {
            'id': chat_id,
            'user_1': model.user_1_id.username,
            'user_2': model.user_2_id.username,
            'has_new': chats_has_news
        }

        data['chats'].append(chat_data)

    data.update(data)

    return Response(data, status=status.HTTP_200_OK)


def create_new_chat(data: dict, request_data: dict, user: User) -> Response:
    try:
        request_data_field(request_data, 'talk_to', str)

        user_2 = User.objects.get(username=request_data['talk_to'])
    except ValueError as e:
        return send_error(data, 'Request needs a "talk_to" username', status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return send_error(data, 'Cant find user to send messages', status.HTTP_404_NOT_FOUND)
    else:
        encrypt_keys = _create_secret_keys(2048)

        valid_serializer = _valid_chat_data(encrypt_keys, user, user_2)

        if valid_serializer.is_valid():
            return _create_chat(encrypt_keys, user, user_2)
        return send_error(data, valid_serializer.errors, status.HTTP_400_BAD_REQUEST)


def _create_secret_keys(nbits: int) -> dict:
    pub_key, priv_key = rsa.newkeys(nbits)

    return {
        'pub_key': pub_key,
        'priv_key': priv_key
    }


def _valid_chat_data(encrypt_keys: dict, user: User, user_2: User) -> ChatSerializer:
    data_to_valid = {
        'pub_key': encrypt_keys['pub_key'],
        'priv_key': encrypt_keys['priv_key'],
        'user_1_id': user.pk,
        'user_2_id': user_2.pk,
    }

    serializer = ChatSerializer(data=data_to_valid)

    return serializer


def _create_chat(encrypt_keys: dict, user: User, user_2: User) -> Response:
    chat = ChatModel.objects.create(
        pub_key=encrypt_keys['pub_key'],
        priv_key=encrypt_keys['priv_key'],
        user_1_id=user,
        user_2_id=user_2
    )

    chat.save()
    return Response(status=status.HTTP_201_CREATED)


def destroy_chat(data: dict, request_data: dict, user: User) -> Response:
    try:
        request_data_field(request_data, 'chats_id_to_delete', list)

        chats = ChatModel.objects.filter(pk__in=request_data['chats_id_to_delete'])
    except ValueError as e:
        return send_error(data, 'Request needs a "chats_id_to_delete" list', status.HTTP_400_BAD_REQUEST)
    else:
        for chat in chats:
            if chat.user_1_id == user or chat.user_2_id == user:
                chat.delete()

        return Response(data, status=status.HTTP_200_OK)
