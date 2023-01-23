import rsa
from django.contrib.auth.models import User
from django.utils import timezone
from django.forms import forms
from rest_framework import status
from rest_framework.response import Response
import magic

from chat.constants.messages import PAGINATION_SIZE
from chat.logic._common import request_data_field, send_error
from chat.models import MessagesModel, ChatModel
from chat.serializers import MessageSerializer, MessageCreateSerializer, SMessages


def _set_chat_has_new(chat: ChatModel, user: User, has_new: bool = True):
    if user == chat.user_1_id:
        chat.user_2_has_new = has_new
    else:
        chat.user_1_has_new = has_new

    chat.save()


def _set_chat_visualized(chat: ChatModel, user: User, save: bool = True):
    if user == chat.user_1_id:
        chat.user_2_visualized = timezone.now()
    else:
        chat.user_1_visualized = timezone.now()

    if save:
        chat.save()


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

        messages = MessagesModel.objects.filter(delete=False, chat=chat).order_by('-date')[current_pages - PAGINATION_SIZE:current_pages]

        messages_data = _get_messages_data(messages, priv_key)

        new_data = SMessages(messages_data, many=True).data

        data.update({'messages': new_data})

        if chat.user_1_id == user:
            chat.user_1_has_new = False
        else:
            chat.user_2_has_new = False
        chat.save()

        _set_chat_visualized(chat, user)
        
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
            'date': getattr(msg, 'date'),
            'file': {
                'link': getattr(msg, 'file').url if getattr(msg, 'file') else None,
                'type': magic.from_file(getattr(msg, 'file').path, mime=True) if getattr(msg, 'file') else None
            }
        }

        msg.sended_now = False
        msg.save()

        data.append(new_data)

    return data


def create_message(data: dict, request_data: dict, user: User) -> Response:
    try:
        request_data_field(request_data, 'chat', str)
        request_data_field(request_data, 'message', str)

        chat = ChatModel.objects.get(pk=int(request_data['chat']))

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
            return _create_message_in_db(data, chat, message, user, request_data)

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


def _create_message_in_db(data: dict, chat: ChatModel, message: bytes, user: User, request_data: dict) -> Response:
    try:
        data_to_create = {
            'user': user,
            'chat': chat,
            'message': message,
            'date': timezone.now()
        }

        msg = MessagesModel.objects.create(**data_to_create)
    except forms.ValidationError as e:
        return Response(f'db error', status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        return send_error(data, str(e), status.HTTP_406_NOT_ACCEPTABLE)
    else:
        msg.sended_now = True
        msg.save()

        if 'file' in request_data:
            msg.file = request_data['file']
            msg.save()

        data['message'] = MessageCreateSerializer(msg).data

        _set_chat_has_new(chat, user)

        return Response(data, status=status.HTTP_201_CREATED)


def detroy_message(data: dict, user: User, request_data: dict):
    try:
        request_data_field(request_data, 'messages_id_to_delete', list)

        messages = MessagesModel.objects.filter(pk__in=request_data['messages_id_to_delete'], user=user)
    except ValueError as e:
        return send_error(data, 'Request needs a "messages_id_to_delete" list', status.HTTP_400_BAD_REQUEST)
    else:
        for msg in messages:
            chat = msg.chat
            _set_chat_has_new(chat, user)

            msg.delete = True
            msg.save()

        return Response(data, status=status.HTTP_200_OK)
