from django.contrib import admin
from QuizSite.models import Item


class ItemAdmin(admin.ModelAdmin):
    list_display=('id', 'title', 'author', 'description', 'created_date', 'published_date', 'quiz')
    list_filter = ('title', 'author', 'created_date', 'published_date')
    search_fileds=('title', 'body')
    ordering=['published_date', 'created_date']

admin.site.register(Item, ItemAdmin)
