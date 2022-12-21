from django.contrib.auth.models import User
from django.test import TestCase

from chat.logic.chat_creation import create_new_chat, send_message, read_message
from chat.models import ChatModel, MessagesModel


class ChatTestCase(TestCase):
    def setUp(self) -> None:
        self.user1 = User.objects.create_user(username='test', email='teste@test.com', password='test')
        self.user2 = User.objects.create_user(username='test2', email='teste2@test.com', password='test')
        create_new_chat(self.user1, self.user2)

    def test_chat_creation(self):
        chat = ChatModel.objects.get(user_1_id=self.user1)
        self.assertIsNotNone(chat, 'chat is none')

    def test_chat_append(self):
        chat = ChatModel.objects.get(user_1_id=self.user1)
        send_message(chat, "oi", self.user1)
        message = MessagesModel.objects.get(user=self.user1)
        self.assertIsNotNone(message)

    def test_chat_read(self):
        chat = ChatModel.objects.get(user_1_id=self.user1)
        send_message(chat, "oi", self.user1)
        message_model = MessagesModel.objects.get(user=self.user1)
        messages = message_model.message
        msg = read_message(chat, messages)
        self.assertEqual(msg, 'oi')
