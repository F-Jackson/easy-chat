from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

from chat.views import ChatsViewset, MessagesViewset
from user.views import UserHistoryCallViewset

router = routers.DefaultRouter()
router.register('chats', ChatsViewset, basename='chats')
router.register('messages', MessagesViewset, basename='messages')
router.register('call-history', UserHistoryCallViewset, basename='callHistory')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls))
]
