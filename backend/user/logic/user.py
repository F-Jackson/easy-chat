from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response

from user.logic._common import send_error
from user.serializers import UserSerializer


def get_user_info(data: dict, user: User) -> Response:
    serializer = UserSerializer(user)
    data.update(serializer.data)
    return Response(data, status=status.HTTP_200_OK)


def create_user(request_data: dict) -> Response:
    try:
        data = {
            'username': '',
            'email': '',
            'password': '',
            'first_name': '',
            'last_name': ''
        }

        _fill_data_with_request_data(request_data, data)

        _valid_if_user_credential(data)

        _valid_data_has_empty(data)
    except ValueError as e:
        return send_error({}, 'Data is not valid for create a user', status=status.HTTP_400_BAD_REQUEST)
    else:
        User.objects.create_user(**data)

        return Response(status=status.HTTP_201_CREATED)


def _fill_data_with_request_data(request_data: dict, data: dict) -> None:
    for key, value in request_data.items():
        data_have_key = key in data.keys()
        type_value_is_str = type(value) == str
        value_is_not_empty = value.strip() != ''

        if data_have_key and type_value_is_str and value_is_not_empty:
            data[key] = value


def _valid_data_has_empty(data: dict) -> None:
    data_is_valid = all(value != '' for value in data.values())

    if not data_is_valid:
        raise ValueError()


def _valid_if_user_credential(data: dict) -> None:
    _check_unique_users(data)


def _check_unique_users(data: dict) -> None:
    unique_values_valid = ('username', 'email')

    for unique_value in unique_values_valid:
        user_exists = User.objects.filter(unique_value=data[unique_value]).exists()
        if user_exists:
            raise PermissionError()
