from rest_framework import status
from rest_framework.response import Response


def invalid_token() -> Response:
    return Response({'error': 'Invalid jwt token'}, status=status.HTTP_401_UNAUTHORIZED)


def send_error(data: dict, error: str, http_status: status) -> Response:
    if error:
        data.update({'error': error})

    return Response(data, status=http_status)


def request_data_field(request_data: dict, field: str, field_type) -> None:
    to_user_request_is_invalid = field not in request_data or type(request_data[field]) != field_type
    if to_user_request_is_invalid:
        raise ValueError()
