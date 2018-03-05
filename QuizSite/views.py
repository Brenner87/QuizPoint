from django.shortcuts import render, get_object_or_404
from datetime import datetime
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse
from django.http import Http404
from django.contrib import messages
import json

from .models import Item
from .forms import QuizForm, LoginForm


def main(request):
    return render(request, 'main.html', )

def item_list(request):
    items=Item.published.all()
    return render(request, 'list.html', {'items':items})

def login_user(request):
    errors = []
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            cd = form.cleaned_data
            user = authenticate(username=cd['username'], password=cd['password'])
            if user is not None:
                if user.is_active:
                    login(request, user)
                    return redirect('my_item_list')
                else:
                    errors.append('Користувач не активний. Зверніться до Адміністратор')

            else:
                errors.append('Невірний логін або пароль')

    else:
        form = LoginForm()
    return render(request, 'account/login_user.html', {'form': form, 'errors': errors})

def run_quiz(request, id):
    items=get_object_or_404(Item, id=id)
    items.quiz=json.loads(items.quiz)
    return render(request, 'run_quiz.html', {'items':items})


def categories(request):
    pass

@login_required
def my_not_published_list(request):
    pass

@login_required
def logout_user(request):
    logout(request)
    return redirect('item_list')

@login_required
def item_details(request):
    pass

@login_required
def my_item_list(request):
    items=Item.custom.authorsItems(request.user)
    return render(request, 'my_item_list.html', {'items': items})

@login_required
def item_delete(request, id):
    item=get_object_or_404(Item, id=id)
    if request.user==item.author:
        item.delete()
        return redirect('my_item_list')
    else:
        return Http404()

@login_required
def publish(request, id):
    item=get_object_or_404(Item, id=id)
    if request.user==item.author and not item.published_date:
        item.publish()
        return redirect('my_item_list')
    else:
        return Http404()


@login_required
def hide(request, id):
    item=get_object_or_404(Item, id=id)
    if request.user==item.author and item.published_date:
        item.hide()
        return redirect('my_item_list')
    else:
        return Http404()

@login_required
def create_item(request):
    errors=[]
    if request.method=='POST':
        form = QuizForm(request.POST)
        if form.is_valid():
            try:
                json.loads(form.cleaned_data['quiz'])
            except Exception as err:
                raise form.ValidationError('Не вдалося створити тест')
        item = form.save(commit=False)
        item.author = request.user
        item.created_date=datetime.now()
        item.save()
        return redirect('my_item_list')

    else:
        form=QuizForm()
    return render(request, 'create_item.html', {'form': form})



