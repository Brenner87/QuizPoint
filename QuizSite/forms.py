from django import forms
from .models import Item

class QuizForm(forms.ModelForm):
    error_css_class = 'error'
    required_css_class = 'required'
    title=forms.CharField(max_length=100, min_length=3, label='Назва')
    description=forms.CharField(label='Короткий опис')
    quiz = forms.CharField(max_length=10000, widget=forms.HiddenInput())

    class Meta:
        model=Item
        fields=('title', 'description', 'quiz')




class LoginForm(forms.Form):
    error_css_class = 'error'
    required_css_class = 'required'
    username=forms.CharField(label='Логін')
    password=forms.CharField(widget=forms.PasswordInput, label='Пароль')


