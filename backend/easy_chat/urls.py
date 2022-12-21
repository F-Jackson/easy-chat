from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

from chat.views import ChatsViewset, MessagesViewset

router = routers.SimpleRouter()
router.register('chats', ChatsViewset, basename='chats')
router.register('messages', MessagesViewset, basename='messages')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls'))
]

urlpatterns += router.urls
