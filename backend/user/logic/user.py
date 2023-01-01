from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response

from user.logic._common import send_error
from user.serializers import UserSerializer, SUser


def get_user_info(data: dict, user: User) -> Response:
    serializer = UserSerializer(user)
    data.update({'user': serializer.data})
    return Response(data, status=status.HTTP_200_OK)


def create_user(request_data: dict) -> Response:
    try:
        data = {
            'username': '',
            'email': '',
            'password': '',
        }

        _fill_data_with_request_data(request_data, data)

        _valid_if_user_credential(data)

        _valid_data_has_empty(data)
    except ValueError as e:
        return send_error({}, 'Data is not valid for create a user', status.HTTP_400_BAD_REQUEST)
    else:
        User.objects.create_user(username=data['username'], email=data['email'], password=data['password'])

        return Response(status=status.HTTP_201_CREATED)


def _fill_data_with_request_data(request_data: dict, data: dict) -> None:
    for key, value in request_data.items():
        data_have_key = key in data.keys()
        value_is_not_empty = str(value).strip() != ''

        if data_have_key and value_is_not_empty:
            data[key] = str(value)


def _valid_data_has_empty(data: dict) -> None:
    data_is_valid = all(value != '' for value in data.values())

    if not data_is_valid:
        raise ValueError()


def _valid_if_user_credential(data: dict) -> None:
    _check_unique_users(data)


def _check_unique_users(data: dict) -> None:
    email_exist = User.objects.filter(email=data['email']).exists()
    username_exist = User.objects.filter(username=data['username']).exists()

    user_exists = any([email_exist, username_exist])

    if user_exists:
        raise PermissionError()


def retrive_user_info(pk: int) -> Response:
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return send_error({}, 'User does not exist', status.HTTP_404_NOT_FOUND)
    else:
        serializer = SUser(user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)
