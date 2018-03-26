from django.contrib import admin
from QuizSite.models import Item, Categories


class ItemAdmin(admin.ModelAdmin):
    list_display=('id', 'title', 'author', 'description', 'created_date', 'published_date', 'quiz')
    list_filter = ('title', 'author', 'created_date', 'published_date')
    search_fields=('title', 'body')
    ordering=['published_date', 'created_date']


class CategoriesAdmin(admin.ModelAdmin):
    list_display = ('id', 'code', 'name')
    list_filter = ('code', 'name')
    search_fields = ('code', 'name')
    ordering = ['code']


admin.site.register(Categories, CategoriesAdmin)
admin.site.register(Item, ItemAdmin)






