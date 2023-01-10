import rsa
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response

from chat.constants.messages import PAGINATION_SIZE
from chat.logic._common import request_data_field, send_error
from chat.models import MessagesModel, ChatModel
from chat.serializers import MessageSerializer, MessageCreateSerializer


def get_chat_messages(data: dict, user: User, chat_id: int, page: int) -> Response:
    try:
        chat = ChatModel.objects.get(pk=chat_id)

        _verify_owner(user, chat)
    except ValueError as e:
        return send_error(data, 'Request needs chat id', status.HTTP_400_BAD_REQUEST)
    except ChatModel.DoesNotExist as e:
        return send_error(data, e.message, status.HTTP_404_NOT_FOUND)
    except PermissionError as e:
        return send_error(data, 'User is not the owner of this chat', status.HTTP_401_UNAUTHORIZED)
    else:
        priv_key = getattr(chat, 'priv_key')
        current_pages = page * PAGINATION_SIZE

        messages = MessagesModel.objects.filter(chat=chat).order_by('-date')[current_pages - PAGINATION_SIZE:current_pages]

        messages_data = _get_messages_data(messages, priv_key)

        data.update({'messages': messages_data})

        return Response(data, status=status.HTTP_200_OK)


def _verify_owner(user: User, chat: ChatModel) -> None:
    if chat.user_1_id != user and chat.user_2_id != user:
        raise PermissionError()


def _get_messages_data(messages: list[MessagesModel], priv_key) -> list[dict]:
    data = []
    for msg in messages:
        message = getattr(msg, 'message')
        message = rsa.decrypt(message, priv_key)
        message = message.decode('utf8')

        new_data = {
            'id': msg.pk,
            'user': getattr(msg, 'user').username,
            'message': message,
            'date': getattr(msg, 'date')
        }

        data.append(new_data)

    return data


def create_message(data: dict, request_data: dict, user: User) -> Response:
    try:
        request_data_field(request_data, 'chat', int)
        request_data_field(request_data, 'message', str)

        chat = ChatModel.objects.get(pk=request_data['chat'])

        _verify_owner(user, chat)
    except ValueError as e:
        return send_error(data, 'Request needs chat id and a message', status.HTTP_400_BAD_REQUEST)
    except ChatModel.DoesNotExist as e:
        return send_error(data, e.message, status.HTTP_404_NOT_FOUND)
    except PermissionError as e:
        return send_error(data, 'User is not the owner of this chat', status.HTTP_401_UNAUTHORIZED)
    else:
        message = _create_new_encrypted_message(chat, request_data)

        serializer_to_valid = _valid_serializer(user, chat, message)

        if serializer_to_valid.is_valid():
            return _create_message_in_db(data, chat, message, user)

        return send_error(data, serializer_to_valid.errors, status.HTTP_400_BAD_REQUEST)


def _create_new_encrypted_message(chat: ChatModel, request_data: dict) -> bytes:
    pub_key = getattr(chat, 'pub_key')

    message = request_data['message']
    message = message.encode('utf-8')
    message = rsa.encrypt(message, pub_key)

    return message


def _valid_serializer(user: User, chat: ChatModel, message: bytes) -> MessageSerializer:
    data_to_valid = {
        'user': user.pk,
        'chat': chat.pk,
        'message': message,
    }

    serializer = MessageSerializer(data=data_to_valid)

    return serializer


def _create_message_in_db(data: dict, chat: ChatModel, message: bytes, user: User) -> Response:
    msg = MessagesModel.objects.create(
        user=user,
        chat=chat,
        message=message,
        date=timezone.now()
    )

    msg.save()

    data['message'] = MessageCreateSerializer(msg).data

    chat.last_message = msg.date

    chat.save()

    return Response(data, status=status.HTTP_201_CREATED)


def detroy_message(data: dict, user: User, request_data: dict):
    try:
        request_data_field(request_data, 'messages_id_to_delete', list)

        messages = MessagesModel.objects.filter(pk__in=request_data['messages_id_to_delete'], user=user)
    except ValueError as e:
        return send_error(data, 'Request needs a "messages_id_to_delete" list', status.HTTP_400_BAD_REQUEST)
    else:
        for msg in messages:
            msg.delete()

        return Response(data, status=status.HTTP_200_OK)
