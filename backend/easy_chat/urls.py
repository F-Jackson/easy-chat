from django.contrib import admin
from django.urls import path, include
from rest_framework import routers, permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from chat.views import ChatsView, MessagesView
from user.views import UserHistoryCallViewset, UserViewset, AuthLoginViewset

api_router = routers.DefaultRouter()
api_router.register('call-history', UserHistoryCallViewset, basename='callHistory')
api_router.register('user', UserViewset, basename='user')

auth_router = routers.DefaultRouter()
auth_router.register('login', AuthLoginViewset, basename='AuthLogin')

schema_view = get_schema_view(
   openapi.Info(
      title="Easy Chat API",
      default_version='v1',
      description="Test description",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@snippets.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(api_router.urls)),
    path('auth/', include(auth_router.urls)),
    path('chats/', ChatsView.as_view(), name='chats_view'),
    path('messages/', MessagesView.as_view(), name='messages_view'),
    path('swagger_json', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc')
]
