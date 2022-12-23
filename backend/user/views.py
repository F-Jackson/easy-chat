from rest_framework import viewsets
from rest_framework.response import Response

from jwt_auth.user_auth import verify_user_auth

from user.logic._common import invalid_token
from user.logic.auth_login import auth_user_login
from user.logic.user import create_user, get_user_info
from user.logic.user_call_history import show_call_history, add_call_in_history, update_call_in_history


class UserHistoryCallViewset(viewsets.ViewSet):
    def list(self, request) -> Response:
        jwt_is_valid = verify_user_auth(request, True)

        if jwt_is_valid:
            token = jwt_is_valid['token']
            user = jwt_is_valid['user']

            data = {
                'token': token
            }

            return show_call_history(user, data)
        return invalid_token()

    def create(self, request) -> Response:
        jwt_is_valid = verify_user_auth(request, True)

        if jwt_is_valid:
            token = jwt_is_valid['token']
            user = jwt_is_valid['user']

            data = {
                'token': token
            }

            return add_call_in_history(user, data, request.data)
        return invalid_token()

    def partial_update(self, request, pk=None) -> Response:
        jwt_is_valid = verify_user_auth(request, True)

        if jwt_is_valid:
            token = jwt_is_valid['token']
            user = jwt_is_valid['user']

            data = {
                'token': token
            }

            return update_call_in_history(data, user, request.data, pk)
        return invalid_token()


class UserViewset(viewsets.ViewSet):
    def list(self, request) -> Response:
        jwt_is_valid = verify_user_auth(request, True)

        if jwt_is_valid:
            token = jwt_is_valid['token']
            user = jwt_is_valid['user']

            data = {
                'token': token
            }

            return get_user_info(data, user)
        return invalid_token()

    def create(self, request) -> Response:
        return create_user(request.data)


class AuthLoginViewset(viewsets.ViewSet):
    def create(self, request) -> Response:
        return auth_user_login(request.data)
