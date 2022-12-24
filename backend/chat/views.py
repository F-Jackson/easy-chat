import rsa
from rest_framework import viewsets, status
from rest_framework.response import Response

from chat.logic.chat import get_chat_info, create_new_chat, destroy_chat
from chat.models import ChatModel, MessagesModel
from chat.serializers import MessageSerializer

from jwt_auth.user_auth import verify_user_auth
from user.logic._common import invalid_token


class ChatsViewset(viewsets.ViewSet):
    def list(self, request) -> Response:
        jwt_is_valid = verify_user_auth(request, True)

        if jwt_is_valid:
            token, user = jwt_is_valid

            data = {
                'token': token
            }

            return get_chat_info(data, user)
        return invalid_token()

    def create(self, request) -> Response:
        jwt_is_valid = verify_user_auth(request, True)

        if jwt_is_valid:
            token, user = jwt_is_valid

            data = {
                'token': token
            }

            return create_new_chat(data, request.data, user)
        return invalid_token()

    def destroy(self, request, pk=None) -> Response:
        jwt_is_valid = verify_user_auth(request, True)

        if jwt_is_valid:
            token, user = jwt_is_valid

            data = {
                'token': token
            }

            return destroy_chat(data, pk)
        return invalid_token()


class MessagesViewset(viewsets.ViewSet):
    def list(self, request) -> Response:
        try:
            chat_request_is_invalid = 'chat' not in request.data or type(request.data['chat']) != int
            if chat_request_is_invalid:
                raise ValueError()

            chat = ChatModel.objects.get(pk=request.data['chat'])

            if chat.user_1_id != request.user and chat.user_2_id != request.user:
                raise PermissionError()
        except ValueError as e:
            return Response({'error': 'Request needs chat id'}, status=status.HTTP_400_BAD_REQUEST)
        except ChatModel.DoesNotExist as e:
            return Response({'error': e.message}, status=status.HTTP_404_NOT_FOUND)
        except PermissionError as e:
            return Response({'error': 'User is not the owner of this chat'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            priv_key = getattr(chat, 'priv_key')
            queryset = MessagesModel.objects.filter(chat=chat)
            data = []
            for msg in queryset:
                message = getattr(msg, 'message')
                message = rsa.decrypt(message, priv_key)
                message = message.decode('utf8')

                new_data = {
                    'id': msg.pk,
                    'user': getattr(msg, 'user').pk,
                    'message': message,
                    'date': getattr(msg, 'date')
                }

                data.append(new_data)
            return Response(data, status=status.HTTP_200_OK)

    def create(self, request):
        try:
            chat_request_is_invalid = 'chat' not in request.data or type(request.data['chat']) != int
            msg_request_is_invalid = 'message' not in request.data or type(request.data['message']) != str
            if chat_request_is_invalid or msg_request_is_invalid:
                raise ValueError()

            chat = ChatModel.objects.get(pk=request.data['chat'])

            if chat.user_1_id != request.user and chat.user_2_id != request.user:
                raise PermissionError('User is not the owner of this chat')
        except ValueError as e:
            return Response({'error': 'Request needs chat id and a message'}, status=status.HTTP_400_BAD_REQUEST)
        except ChatModel.DoesNotExist as e:
            return Response({'error': e.message}, status=status.HTTP_404_NOT_FOUND)
        except PermissionError as e:
            return Response({'error': 'User is not the owner of this chat'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            pub_key = getattr(chat, 'pub_key')

            message = request.data['message']
            message = message.encode('utf-8')
            message = rsa.encrypt(message, pub_key)

            data_to_valid = {
                'user': request.user.pk,
                'chat': chat.pk,
                'message': message
            }

            serializer = MessageSerializer(data=data_to_valid)

            if serializer.is_valid():
                MessagesModel.objects.create(
                    user=request.user,
                    chat=chat,
                    message=message
                )

                return Response(status=status.HTTP_201_CREATED)
            return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None) -> Response:
        try:
            message = MessagesModel.objects.get(pk=pk, user=request.user)
        except MessagesModel.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            message.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
