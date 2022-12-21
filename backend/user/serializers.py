from rest_framework import serializers

from user.models import UserHistoryCallModel


class UserHistoryCallSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserHistoryCallModel
        fields = '__all__'
