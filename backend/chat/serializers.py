from rest_framework import serializers

from chat.models import ChatModel, MessagesModel


class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatModel
        exclude = ['pub_key', 'priv_key']


class SChats(serializers.Serializer):
    id = serializers.IntegerField()
    user_1 = serializers.CharField()
    user_2 = serializers.CharField()


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessagesModel
        exclude = ['chat']


class SMessages(serializers.Serializer):
    id = serializers.IntegerField()
    user = serializers.CharField()
    message = serializers.CharField()
    date = serializers.DateTimeField()


class MessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessagesModel
        exclude = ['message']
