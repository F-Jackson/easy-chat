from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.response import Response

from user.models import UserHistoryCallModel
from user.serializers import UserHistoryCallSerializer


class UserHistoryCallViewset(viewsets.ViewSet):
    def list(self, request) -> Response:
        queryset = UserHistoryCallModel.objects.filter(from_user=request.user) | \
                   UserHistoryCallModel.objects.filter(to_user=request.user)
        serializer = UserHistoryCallSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request) -> Response:
        try:
            to_user_request_is_invalid = 'to_user' not in request.data or type(request.data['to_user']) != int
            if to_user_request_is_invalid:
                raise ValueError()

            user = User.objects.get(pk=request.data['to_user'])
        except ValueError as e:
            return Response({'error': 'Request needs to_user id'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist as e:
            return Response({'error': e.message}, status=status.HTTP_404_NOT_FOUND)
        else:
            UserHistoryCallModel.objects.create(
                from_user=request.user, to_user=user
            )

            return Response(status=status.HTTP_201_CREATED)

    def partial_update(self, request, pk=None) -> Response:
        try:
            denied_request_is_invalid = 'denied' not in request.data or type(request.data['denied']) != bool
            if denied_request_is_invalid:
                raise ValueError()

            call_history = UserHistoryCallModel.objects.get(from_user=request.user, pk=pk)

            if call_history.already_updated:
                raise PermissionError()
        except ValueError as e:
            return Response({'error': 'Request needs denied boolean'}, status=status.HTTP_400_BAD_REQUEST)
        except UserHistoryCallModel.DoesNotExist as e:
            return Response({'error': e.message}, status=status.HTTP_404_NOT_FOUND)
        except PermissionError as e:
            return Response({'error': 'History already was updated'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            new_data = {
                'denied': request.data['denied'],
                'already_updated': True,
                'end': timezone.now()
            }

            serializer = UserHistoryCallSerializer(call_history, data=new_data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
