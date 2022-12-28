from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets
from rest_framework.response import Response

from chat.logic._common import invalid_token
from chat.logic.chat import get_chat_info, create_new_chat, destroy_chat
from chat.logic.message import get_chat_messages, create_message, detroy_message
from chat.serializers import ChatSerializer, SwaggerMessage

from jwt_auth.user_auth import verify_user_auth


class ChatsViewset(viewsets.ViewSet):
    @swagger_auto_schema(
        operation_summary="Get Chat info",
        operation_description="Get Chat info if authenticated",
        manual_parameters=[
            openapi.Parameter("token", openapi.IN_QUERY, description="Client Jwt Token must be given in request Header",
                              type=openapi.TYPE_STRING)
        ],
        responses={
            200: openapi.Response("Retrives new client token and user info", ChatSerializer)
        }
    )
    def list(self, request) -> Response:
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
            openapi.Parameter("token", openapi.IN_QUERY, description="Client Jwt Token must be given in request Header",
                              type=openapi.TYPE_STRING),
            openapi.Parameter("send_to", openapi.IN_QUERY, description="User id that you want to chat with",
                              type=openapi.TYPE_NUMBER),

        ],
        responses={
            200: openapi.Response("Retrives new client token"),
            400: openapi.Response("Retrives new client token"),
            404: openapi.Response("Retrives new client token")
        }
    )
    def create(self, request) -> Response:
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
            openapi.Parameter("token", openapi.IN_QUERY, description="Client Jwt Token must be given in request Header",
                              type=openapi.TYPE_STRING),
        ],
        responses={
            200: openapi.Response("Retrives new client token"),
            404: openapi.Response("Retrives new client token")
        }
    )
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
    @swagger_auto_schema(
        operation_summary="Get Messages List",
        operation_description="Get Messages from the given chat if User is authenticated and is the owner of the chat",
        manual_parameters=[
            openapi.Parameter("token", openapi.IN_QUERY, description="Client Jwt Token must be given in request Header",
                              type=openapi.TYPE_STRING),
            openapi.Parameter("chat", openapi.IN_QUERY, description="Chat id that you to see the messages",
                              type=openapi.TYPE_NUMBER),
        ],
        responses={
            200: openapi.Response("Retrives new client token and a list of messages", SwaggerMessage),
            400: openapi.Response("Retrives new client token"),
            404: openapi.Response("Retrives new client token"),
            401: openapi.Response("If authenticated retrives new client token")
        }
    )
    def list(self, request) -> Response:
        jwt_is_valid = verify_user_auth(request, True)

        if jwt_is_valid:
            token, user = jwt_is_valid

            data = {
                'token': token
            }

            return get_chat_messages(data, request.data, user)
        return invalid_token()

    @swagger_auto_schema(
        operation_summary="Create new message",
        operation_description="Create new message inside the given chat",
        manual_parameters=[
            openapi.Parameter("token", openapi.IN_QUERY, description="Client Jwt Token must be given in request Header",
                              type=openapi.TYPE_STRING),
            openapi.Parameter("chat", openapi.IN_QUERY, description="Chat id that you to the message inside",
                              type=openapi.TYPE_NUMBER),
            openapi.Parameter("message", openapi.IN_QUERY, description="Message that you want to send",
                              type=openapi.TYPE_STRING),
        ],
        responses={
            200: openapi.Response("Retrives new client token"),
            400: openapi.Response("Retrives new client token"),
            404: openapi.Response("Retrives new client token"),
            401: openapi.Response("If authenticated retrives new client token")
        }
    )
    def create(self, request):
        jwt_is_valid = verify_user_auth(request, True)

        if jwt_is_valid:
            token, user = jwt_is_valid

            data = {
                'token': token
            }

            return create_message(data, request, user)
        return invalid_token()

    @swagger_auto_schema(
        operation_summary="Destroy message",
        operation_description="Destroy given message if User is authenticated and is the owner of the message",
        manual_parameters=[
            openapi.Parameter("token", openapi.IN_QUERY, description="Client Jwt Token must be given in request Header",
                              type=openapi.TYPE_STRING),
        ],
        responses={
            200: openapi.Response("Retrives new client token"),
            404: openapi.Response("Retrives new client token")
        }
    )
    def destroy(self, request, pk=None) -> Response:
        jwt_is_valid = verify_user_auth(request, True)

        if jwt_is_valid:
            token, user = jwt_is_valid

            data = {
                'token': token
            }

            return detroy_message(data, user, pk)
        return invalid_token()
