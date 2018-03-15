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
from .forms import QuizForm, LoginForm, GetAnswers


def main(request):
    return render(request, 'main.html', )

def categories(request):
    pass

def item_list(request):
    errors=[]
    items=Item.published.all()
    query=request.GET.get('q')
    if query:
        if len(query)>30:
            errors.append('В рядку пошуку не може бути більше 30 сиволів')
        else:
            items = Item.published.filter(title__icontains=query)
    return render(request, 'item_list.html', {'items':items, 'errors':errors})

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
    items = get_object_or_404(Item, id=id)
    my_quiz = json.loads(items.quiz)
    errors=[]
    if request.method=='POST':
        form=GetAnswers(request.POST)
        if form.is_valid():
            try:
                answers=json.loads(form.cleaned_data['answers'])
            except Exception as err:
                raise form.ValidationError('Не вдалося зчитати варіанти відповіді')
            count = 0
            if len(answers) == len(my_quiz['question']):
                for value in range(len(my_quiz['question'])):

                    if answers[value] == my_quiz['question'][value][-1]:
                        count += 1
                result='{}/{}'.format(count, len(my_quiz['question']))
                items.quiz=json.loads(items.quiz)
                return render(request, 'item_result.html', {'result': result, 'items': items, 'answers':answers})
            else:
                raise form.ValidationError('Кількість питаннь і відповідей не співпадає. Зверніться до адміністратора')
        return render(request, 'display_result.html',{'answers':answers, 'items':items})
    else:
        form=GetAnswers()
        for i in my_quiz['question']:
            i[-1]=len(i[-1])
        items.quiz=my_quiz
        return render(request, 'Item_run.html', {'items':items, 'form':form})

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
    return render(request, 'item_list_my.html', {'items': items})

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
        return render(request, 'item_create.html', {'form': form})

@login_required
def edit_item(request, id):
    errors = []
    item = get_object_or_404(Item, id=id)
    if request.user != item.author:
        return Http404()
    if request.method=='POST':
        form=QuizForm(request.POST, instance=item)
        if form.is_valid():
            try:
                json.loads(form.cleaned_data['quiz'])
            except Exception as err:
                raise form.ValidationError('З вашим тестом щощсь не так. Перевірте ретельніше')
            saved_item = form.save(commit=False)
            saved_item.author = request.user
            saved_item.created_date = datetime.now()
            saved_item.save()
            hide(request, id)
        return redirect('my_item_list')
    else:
        form=QuizForm()
        return render(request, 'item_edit.html', {'form':form, 'item':item})






