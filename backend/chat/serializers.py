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
    has_new = serializers.BooleanField()


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessagesModel
        exclude = ['chat']


class SMessages(serializers.Serializer):
    id = serializers.IntegerField()
    user = serializers.CharField()
    message = serializers.CharField()
    date = serializers.DateTimeField()
    file = serializers.DictField(child=serializers.CharField())


class MessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessagesModel
        exclude = ['message']


class _LM(serializers.Serializer):
    chat_id = serializers.IntegerField()
    has_new = serializers.BooleanField()
    deleted_messages = serializers.ListField(child=serializers.IntegerField(min_value=0))
    new_messages = SMessages(many=True)
    visualized = serializers.DateTimeField()


class LastMessagesSerializer(serializers.Serializer):
    date = serializers.DateTimeField()
    last_messages = _LM(many=True)
