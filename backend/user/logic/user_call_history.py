from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response

from user.logic._common import send_error, request_data_field
from user.models import UserHistoryCallModel
from user.serializers import UserHistoryCallSerializer


def show_call_history(user: User, data: dict) -> Response:
    queryset = UserHistoryCallModel.objects.filter(from_user=user) | \
               UserHistoryCallModel.objects.filter(to_user=user)

    serializer = UserHistoryCallSerializer(queryset, many=True)

    data.update(serializer.data)
    return Response(data, status=status.HTTP_200_OK)


def add_call_in_history(user: User, data: dict, request_data: dict) -> Response:
    try:
        to_user = _get_user_to_sended(request_data)
    except ValueError as e:
        return send_error(data, 'Request needs to_user id', status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist as e:
        return send_error(data, e.message, status.HTTP_404_NOT_FOUND)
    else:
        return _create_call_in_history(data, user, to_user)


def _get_user_to_sended(request_data: dict) -> User:
    request_data_field(request_data, 'to_user', int)

    user = User.objects.get(pk=request_data['to_user'])
    return user


def _create_call_in_history(data: dict, from_user: User, to_user: User) -> Response:
    UserHistoryCallModel.objects.create(
        from_user=from_user, to_user=to_user
    )

    return Response(data, status=status.HTTP_201_CREATED)


def update_call_in_history(data: dict, user: User, request_data: dict, pk: int = None) -> Response:
    try:
        call_history = _get_call_in_history(request_data, user, pk)
    except ValueError as e:
        return send_error(data, 'Request needs denied boolean', status.HTTP_400_BAD_REQUEST)
    except UserHistoryCallModel.DoesNotExist as e:
        return send_error(data, e.message, status.HTTP_404_NOT_FOUND)
    except PermissionError as e:
        return send_error(data, 'History already was updated', status.HTTP_401_UNAUTHORIZED)
    else:
        new_serializer_data = _get_new_data_for_serializer(request_data['denied'])

        return _valid_and_save_serializer(data, new_serializer_data, call_history)


def _get_call_in_history(request_data: dict, user: User, pk: int) -> UserHistoryCallModel:
    request_data_field(request_data, 'denied', bool)

    call_history = UserHistoryCallModel.objects.get(from_user=user, pk=pk)

    if call_history.already_updated:
        raise PermissionError()
    return call_history


def _get_new_data_for_serializer(denied: bool):
    return {
        'denied': denied,
        'already_updated': True,
        'end': timezone.now()
    }


def _valid_and_save_serializer(data: dict, new_serializer_data: dict, call_in_history: UserHistoryCallModel) -> Response:
    serializer = UserHistoryCallSerializer(call_in_history, data=new_serializer_data, partial=True)

    if serializer.is_valid():
        serializer.save()
        data.update(serializer.data)

        return Response(data, status=status.HTTP_200_OK)
    return send_error(data, serializer.errors, status.HTTP_400_BAD_REQUEST)
