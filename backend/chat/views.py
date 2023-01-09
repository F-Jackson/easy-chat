from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ViewSet

from chat.logic._common import invalid_token
from chat.logic.chat import get_chat_info, create_new_chat, destroy_chat
from chat.logic.last_message import get_all_last_messages
from chat.logic.message import get_chat_messages, create_message, detroy_message
from chat.serializers import MessageCreateSerializer, SChats, SMessages, LastMessagesSerializer

from jwt_auth.user_auth import verify_user_auth


class ChatsView(APIView):
    @swagger_auto_schema(
        operation_summary="Get Chat info",
        operation_description="Get Chat info if authenticated",
        manual_parameters=[
            openapi.Parameter("token", openapi.IN_HEADER, description="Client Jwt Token",
                              type=openapi.TYPE_STRING, required=True)
        ],
        responses={
            200: openapi.Response("Retrives new client token and user info", SChats)
        }
    )
    def get(self, request, format=None) -> Response:
        jwt_is_valid = verify_user_auth(request, True)

        if jwt_is_valid:
            token, user = jwt_is_valid

            data = {
                'token': token
            }

            return get_chat_info(data, user)
        return invalid_token()

    @swagger_auto_schema(
        operation_summary="Create new chat",
        operation_description="Create new chat between the authenticated User and the given User",
        manual_parameters=[
            openapi.Parameter("token", openapi.IN_HEADER, description="Client Jwt Token",
                              type=openapi.TYPE_STRING, required=True),
            openapi.Parameter("talk_to", openapi.IN_QUERY, description="User username that you want to chat with",
                              type=openapi.TYPE_NUMBER, required=True),

        ],
        responses={
            200: openapi.Response("Retrives new client token"),
            400: openapi.Response("Retrives new client token"),
            404: openapi.Response("Retrives new client token")
        }
    )
    def post(self, request, format=None) -> Response:
        jwt_is_valid = verify_user_auth(request, True)

        if jwt_is_valid:
            token, user = jwt_is_valid

            data = {
                'token': token
            }

            return create_new_chat(data, request.data, user)
        return invalid_token()

    @swagger_auto_schema(
        operation_summary="Destroy chat",
        operation_description="Destroy given chat if User is authenticated and is the owner of the chat",
        manual_parameters=[
            openapi.Parameter("token", openapi.IN_HEADER, description="Client Jwt Token",
                              type=openapi.TYPE_STRING, required=True),
            openapi.Parameter("chats_id_to_delete", openapi.IN_QUERY, description="List of chats ids to delete",
                              type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_NUMBER), required=True)
        ],
        responses={
            200: openapi.Response("Retrives new client token"),
            404: openapi.Response("Retrives new client token")
        }
    )
    @action(methods=['delete'], detail=False, url_name='delete', url_path='delete')
    def delete(self, request, format=None) -> Response:
        jwt_is_valid = verify_user_auth(request, True)

        if jwt_is_valid:
            token, user = jwt_is_valid

            data = {
                'token': token
            }

            return destroy_chat(data, request.data, user)
        return invalid_token()


class MessagesView(APIView):
    @swagger_auto_schema(
        operation_summary="Create new message",
        operation_description="Create new message inside the given chat",
        manual_parameters=[
            openapi.Parameter("token", openapi.IN_HEADER, description="Client Jwt Token",
                              type=openapi.TYPE_STRING, required=True),
            openapi.Parameter("chat", openapi.IN_QUERY, description="Chat id that you to the message inside",
                              type=openapi.TYPE_NUMBER, required=True),
            openapi.Parameter("message", openapi.IN_QUERY, description="Message that you want to send",
                              type=openapi.TYPE_STRING, required=True),
        ],
        responses={
            200: openapi.Response("Retrives new client token and message info", MessageCreateSerializer),
            400: openapi.Response("Retrives new client token"),
            404: openapi.Response("Retrives new client token"),
            401: openapi.Response("If authenticated retrives new client token")
        }
    )
    def post(self, request, format=None):
        jwt_is_valid = verify_user_auth(request, True)

        if jwt_is_valid:
            token, user = jwt_is_valid

            data = {
                'token': token
            }

            return create_message(data, request.data, user)
        return invalid_token()

    @swagger_auto_schema(
        operation_summary="Destroy message",
        operation_description="Destroy given message if User is authenticated and is the owner of the message",
        manual_parameters=[
            openapi.Parameter("token", openapi.IN_HEADER, description="Client Jwt Token",
                              type=openapi.TYPE_STRING, required=True),
            openapi.Parameter("messages_id_to_delete", openapi.IN_QUERY, description="List of messages ids to delete",
                              type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_NUMBER), required=True)
        ],
        responses={
            200: openapi.Response("Retrives new client token"),
            404: openapi.Response("Retrives new client token")
        }
    )
    def delete(self, request, format=None) -> Response:
        jwt_is_valid = verify_user_auth(request, True)

        if jwt_is_valid:
            token, user = jwt_is_valid

            data = {
                'token': token
            }

            return detroy_message(data, user, request.data)
        return invalid_token()


class MessagesListView(APIView):
    @swagger_auto_schema(
        operation_summary="Get Messages List",
        operation_description="Get Messages from the given chat if User is authenticated and is the owner of the chat",
        manual_parameters=[
            openapi.Parameter("token", openapi.IN_HEADER, description="Client Jwt Token",
                              type=openapi.TYPE_STRING, required=True),
            openapi.Parameter("chat", openapi.IN_QUERY, description="Chat id that you to see the messages",
                              type=openapi.TYPE_NUMBER, required=True),
        ],
        responses={
            200: openapi.Response("Retrives new client token and a list of messages", SMessages),
            400: openapi.Response("Retrives new client token"),
            404: openapi.Response("Retrives new client token"),
            401: openapi.Response("If authenticated retrives new client token")
        }
    )
    def get(self, request, pk=None) -> Response:
        jwt_is_valid = verify_user_auth(request, True)

        if jwt_is_valid and pk is not None:
            token, user = jwt_is_valid

            data = {
                'token': token
            }
            return get_chat_messages(data, user, pk)
        return invalid_token()


class LastMessagesView(ViewSet):
    @swagger_auto_schema(
        operation_summary="Get Last Messages List",
        operation_description="Get all Last Messages from the given User and the User is authenticated and is the "
                              "owner of the chat",
        manual_parameters=[
            openapi.Parameter("token", openapi.IN_HEADER, description="Client Jwt Token",
                              type=openapi.TYPE_STRING, required=True)
        ],
        responses={
            200: openapi.Response("Retrives new client token and a list of Last Messages", LastMessagesSerializer),
        }
    )
    def list(self, request) -> Response:
        jwt_is_valid = verify_user_auth(request, True)

        if jwt_is_valid:
            token, user = jwt_is_valid

            data = {
                'token': token
            }
            return get_all_last_messages(data, user)
        return invalid_token()
