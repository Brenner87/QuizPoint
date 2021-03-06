from django.urls import path
from QuizSite import views

urlpatterns = [
    path(r'', views.main, name="main"),
    path(r'list/', views.item_list, name='item_list'),
    path(r'create_item/', views.create_item, name='create_item'),
    path(r'account/login/', views.login_user, name='login_user'),
    path(r'account/logout/', views.logout_user, name='logout_user'),
    path(r'run_quiz/<int:id>/', views.run_quiz, name='run_quiz'),
    path(r'contacts/', views.contacts, name='contacts'),
    path(r'info/', views.info, name='info'),
    path(r'l_materials/', views.l_materials, name='l_materials'),
    path(r'my_item_list', views.my_item_list, name='my_item_list'),
    path(r'item_delete/<int:id>/', views.item_delete, name='item_delete'),
    path(r'publish/<int:id>/', views.publish, name='publish'),
    path(r'hide/<int:id>/', views.hide, name='hide'),
    path(r'edit_item/<int:id>/', views.edit_item, name='edit_item'),
    path(r'ajax/validate_quiz_title/', views.validate_quiz_title, name='validate_quiz_title'),

]
