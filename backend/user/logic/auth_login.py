from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.authtoken.admin import User
from rest_framework.response import Response

from jwt_auth.logic.create_login_token import ClientTokenLogin
from user.logic._common import request_data_field, send_error


def auth_user_login(request_data: dict) -> Response:
    try:
        user = _autheticate_user(request_data)
    except ValueError as e:
        return send_error({}, 'Request needs a username and a password', status.HTTP_400_BAD_REQUEST)
    except PermissionError as e:
        return send_error({}, 'Invalid user credentials', status.HTTP_401_UNAUTHORIZED)
    else:
        try:
            client_token = _create_and_get_client_token(user)
        except ConnectionError as e:
            return send_error({}, 'Error while trying to create jwt tokens', status.HTTP_503_SERVICE_UNAVAILABLE)
        else:
            return Response({'token': client_token}, status=status.HTTP_200_OK)


def _autheticate_user(request_data: dict) -> User:
    request_data_field(request_data, 'username', str)
    request_data_field(request_data, 'password', str)

    user = authenticate(username=request_data['username'], password=request_data['password'])

    if user is not None:
        return user
    raise PermissionError()


def _create_and_get_client_token(user: User) -> str:
    client_token = ClientTokenLogin(user.pk)
    token_created = client_token.create_login_tokens()

    if token_created:
        return client_token.client_token
    raise ConnectionError()
