from rest_framework import viewsets
from rest_framework.response import Response

from chat.logic._common import invalid_token
from chat.logic.chat import get_chat_info, create_new_chat, destroy_chat
from chat.logic.message import get_chat_messages, create_message, detroy_message

from jwt_auth.user_auth import verify_user_auth


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
        jwt_is_valid = verify_user_auth(request, True)

        if jwt_is_valid:
            token, user = jwt_is_valid

            data = {
                'token': token
            }

            return get_chat_messages(data, request.data, user)
        return invalid_token()

    def create(self, request):
        jwt_is_valid = verify_user_auth(request, True)

        if jwt_is_valid:
            token, user = jwt_is_valid

            data = {
                'token': token
            }

            return create_message(data, request, user)
        return invalid_token()

    def destroy(self, request, pk=None) -> Response:
        jwt_is_valid = verify_user_auth(request, True)

        if jwt_is_valid:
            token, user = jwt_is_valid

            data = {
                'token': token
            }

            return detroy_message(data, user, pk)
        return invalid_token()
