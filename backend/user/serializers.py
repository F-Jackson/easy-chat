from django.contrib.auth.models import User
from rest_framework import serializers

from user.models import UserHistoryCallModel


class UserHistoryCallSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserHistoryCallModel
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name']


class SwaggerUserRetrive(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']
