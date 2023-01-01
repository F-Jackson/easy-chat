from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import viewsets
from rest_framework.response import Response

from jwt_auth.user_auth import verify_user_auth

from user.logic._common import invalid_token
from user.logic.auth_login import auth_user_login
from user.logic.user import create_user, get_user_info, retrive_user_info
from user.logic.user_call_history import show_call_history, add_call_in_history, update_call_in_history
from user.serializers import UserSerializer, UserHistoryCallSerializer, SUser


class UserHistoryCallViewset(viewsets.ViewSet):
    @swagger_auto_schema(
        operation_summary="Get User Call History",
        operation_description="Get User Call History if authenticated",
        manual_parameters=[
            openapi.Parameter("token", openapi.IN_HEADER, description="Client Jwt Token must be given in request Header",
                              type=openapi.TYPE_STRING)
        ],
        responses={
            200: openapi.Response("Retrives new client token and user info", UserHistoryCallSerializer)
        }
    )
    def list(self, request) -> Response:
        jwt_is_valid = verify_user_auth(request, True)

        if jwt_is_valid:
            token, user = jwt_is_valid

            data = {
                'token': token
            }

            return show_call_history(user, data)
        return invalid_token()

    @swagger_auto_schema(
        operation_summary="Create hitory in User Call History",
        operation_description="Create a new history between two Users in User Call History if authenticated",
        manual_parameters=[
            openapi.Parameter("token", openapi.IN_QUERY, description="Client Jwt Token must be given in request Header",
                              type=openapi.TYPE_STRING),
            openapi.Parameter("to_user", openapi.IN_QUERY, description="User id that you want chat with",
                              type=openapi.TYPE_NUMBER),
        ],
        responses={
            200: openapi.Response("Retrives new client token and user info", UserHistoryCallSerializer),
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

            return add_call_in_history(user, data, request.data)
        return invalid_token()

    @swagger_auto_schema(
        operation_summary="End history in User Call History",
        operation_description="End user call in User Call History",
        manual_parameters=[
            openapi.Parameter("token", openapi.IN_QUERY, description="Client Jwt Token must be given in request Header",
                              type=openapi.TYPE_STRING),
            openapi.Parameter("denied", openapi.IN_QUERY, description="Was call denied?",
                              type=openapi.TYPE_BOOLEAN),
        ],
        responses={
            200: openapi.Response("Retrives new client token and user info", UserHistoryCallSerializer),
            400: openapi.Response("Retrives new client token"),
            404: openapi.Response("Retrives new client token"),
            401: openapi.Response("If authenticated retrives new client token")
        }
    )
    def partial_update(self, request, pk=None) -> Response:
        jwt_is_valid = verify_user_auth(request, True)

        if jwt_is_valid:
            token, user = jwt_is_valid

            data = {
                'token': token
            }

            return update_call_in_history(data, user, request.data, pk)
        return invalid_token()


class UserViewset(viewsets.ViewSet):
    @swagger_auto_schema(
        operation_summary="Get User info",
        operation_description="Get User info if authenticated",
        manual_parameters=[
            openapi.Parameter("token", openapi.IN_HEADER, description="Client Jwt Token",
                              type=openapi.TYPE_STRING, required=True)
        ],
        responses={
            200: openapi.Response("Retrives new client token and user info", UserSerializer)
        }
    )
    def list(self, request) -> Response:
        jwt_is_valid = verify_user_auth(request, True)

        if jwt_is_valid:
            token, user = jwt_is_valid

            data = {
                'token': token
            }

            return get_user_info(data, user)
        return invalid_token()

    @swagger_auto_schema(
        operation_summary="Create User",
        operation_description="Create User if User doesnt does not exists",
        manual_parameters=[
            openapi.Parameter("username", openapi.IN_QUERY, description="User username", type=openapi.TYPE_STRING,
                              required=True),
            openapi.Parameter("email", openapi.IN_QUERY, description="User email", type=openapi.TYPE_STRING,
                              required=True),
            openapi.Parameter("password", openapi.IN_QUERY, description="User password", type=openapi.TYPE_STRING,
                              required=True)
        ],
        responses={
            201: openapi.Response("Nothing is Retrived")
        }
    )
    def create(self, request) -> Response:
        return create_user(request.data)

    @swagger_auto_schema(
        operation_summary="Retrive one User Info",
        operation_description="Retrive one User Info",
        responses={
            200: openapi.Response("Retrive User username", SUser)
        }
    )
    def retrieve(self, request, pk=None) -> Response:
        return retrive_user_info(pk)


class AuthLoginViewset(viewsets.ViewSet):
    @swagger_auto_schema(
        operation_summary="Login User",
        operation_description="Auth User and login, retrives a acess token",
        manual_parameters=[
            openapi.Parameter("username", openapi.IN_QUERY, description="User username", type=openapi.TYPE_STRING,
                              required=True),
            openapi.Parameter("password", openapi.IN_QUERY, description="User password", type=openapi.TYPE_STRING,
                              required=True)
        ],
        responses={
            200: openapi.Response("Retrives a client Token")
        }
    )
    def create(self, request) -> Response:
        return auth_user_login(request.data)
