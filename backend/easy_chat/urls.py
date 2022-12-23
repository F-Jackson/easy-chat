from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

from chat.views import ChatsViewset, MessagesViewset
from user.views import UserHistoryCallViewset, UserViewset, AuthLoginViewset

api_router = routers.DefaultRouter()
api_router.register('chats', ChatsViewset, basename='chats')
api_router.register('messages', MessagesViewset, basename='messages')
api_router.register('call-history', UserHistoryCallViewset, basename='callHistory')
api_router.register('user', UserViewset, basename='user')

auth_router = routers.DefaultRouter()
auth_router.register('login', AuthLoginViewset, basename='AuthLogin')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(api_router.urls)),
    path('auth/', include(auth_router.urls))
]
