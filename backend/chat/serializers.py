from rest_framework import serializers

from chat.models import ChatModel, MessagesModel


class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatModel
        exclude = ['pub_key', 'priv_key']


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessagesModel
        exclude = ['chat']


class SwaggerMessage(serializers.Serializer):
    id = serializers.IntegerField()
    user = serializers.IntegerField()
    message = serializers.CharField()
    date = serializers.DateTimeField()
