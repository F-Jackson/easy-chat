from django.contrib import admin
from chat.models import *


class ChatAdmin(admin.ModelAdmin):
    pass


admin.site.register(ChatModel, ChatAdmin)
