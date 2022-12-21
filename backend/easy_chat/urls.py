from django.contrib import admin
from django.urls import path
from rest_framework import routers

from chat.views import ChatsViewset, MessagesViewset
from user.views import UserHistoryCallViewset

router = routers.SimpleRouter()
router.register('chats', ChatsViewset, basename='chats')
router.register('messages', MessagesViewset, basename='messages')
router.register('call_history', UserHistoryCallViewset, basename='callHistory')

urlpatterns = [
    path('admin/', admin.site.urls)
]

urlpatterns += router.urls
