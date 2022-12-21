import rsa
from rest_framework import viewsets, status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from chat.models import ChatModel, MessagesModel
from chat.serializers import ChatSerializer, MessageSerializer
from django.contrib.auth.models import User


class ChatsViewset(viewsets.ViewSet):
    def get_permissions(self):
        if self.action == 'destroy':
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def list(self, request) -> Response:
        queryset = ChatModel.objects.filter(user_1_id=request.user) | ChatModel.objects.filter(user_2_id=request.user)
        serializer = ChatSerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request) -> Response:
        user_2 = User.objects.get(id=request.data['send_to'])
        pub_key, priv_key = rsa.newkeys(512)
        data_to_valid = {
            'pub_key': pub_key,
            'priv_key': priv_key,
            'user_1_id': request.user.pk,
            'user_2_id': user_2.pk,
        }
        serializer = ChatSerializer(data=data_to_valid)
        if serializer.is_valid():
            chat = ChatModel.objects.create(
                pub_key=pub_key,
                priv_key=priv_key,
                user_1_id=request.user,
                user_2_id=user_2
            )
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None) -> Response:
        try:
            chat = ChatModel.objects.get(pk=pk)
        except ChatModel.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            chat.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)


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
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None) -> Response:
        try:
            message = MessagesModel.objects.get(pk=pk, user=request.user)
        except MessagesModel.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            message.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
