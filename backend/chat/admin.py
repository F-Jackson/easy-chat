from django.contrib import admin
from chat.models import *


class ChatAdmin(admin.ModelAdmin):
    pass


admin.site.register(ChatModel, ChatAdmin)


class MessageAdmin(admin.ModelAdmin):
    pass


admin.site.register(MessagesModel, MessageAdmin)
