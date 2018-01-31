from django.urls import path
from QuizSite import views


urlpatterns= [
    path(r'', views.main, name="main"),
]