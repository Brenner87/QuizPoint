from django.shortcuts import get_object_or_404
from datetime import datetime
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.http import Http404
from django.contrib import messages
from django.core.paginator import Paginator
from django.http import JsonResponse
import json

from .models import Item
from .forms import QuizForm, LoginForm, GetAnswers
from .myutils import myrender as render


def main(request):
    query = request.GET.get('q')
    by_category = request.GET.get('cat')
    if by_category:
        items = Item.published.filter(category=by_category)
        paginator = Paginator(items, 15)
        page = request.GET.get('page')
        item_list = paginator.get_page(page)
        return render(request, 'item_list.html', {'item_list': item_list})
    if query:
        if len(query) > 30:
            messages.error(request, 'В рядку пошуку не може бути більше 30 сиволів')
        else:
            items = Item.published.filter(title__icontains=query)
            paginator = Paginator(items, 15)
            page = request.GET.get('page')
            item_list = paginator.get_page(page)
            return render(request, 'item_list.html', {'item_list': item_list})
    return render(request, 'main.html', {})


def contacts(request):
    return render(request, 'contacts.html', {})


def info(request):
    return render(request, 'info.html', {})


def l_materials(request):
    return render(request, 'l_materials.html', {})


def item_list(request):
    items = Item.published.all()
    query = request.GET.get('q')
    by_category = request.GET.get('cat')
    if by_category:
        items = items.filter(category=by_category)
    if query:
        if len(query) > 30:
            messages.error(request, 'В рядку пошуку не може бути більше 30 сиволів')

        else:
            items = Item.published.filter(title__icontains=query)
    paginator = Paginator(items, 15)
    page = request.GET.get('page')
    item_list = paginator.get_page(page)
    return render(request, 'item_list.html', {'item_list': item_list})


def login_user(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            cd = form.cleaned_data
            user = authenticate(username=cd['username'], password=cd['password'])
            if user is not None:
                if user.is_active:
                    login(request, user)
                    messages.success(request, 'Вітаю вас <b>{}</b>'.format(user))
                    return redirect('QuizSite:my_item_list')
                else:
                    messages.error(request, 'Користувач не активний. Зверніться до Адміністратор')
            else:
                messages.error(request, 'Невірний логін або пароль')
    else:
        form = LoginForm()
    return render(request, 'account/login_user.html', {'form': form, })


def run_quiz(request, id):
    items = get_object_or_404(Item, id=id)
    my_quiz = json.loads(items.quiz)
    if request.method == 'POST':
        form = GetAnswers(request.POST)
        if not form.is_valid():
            messages.error(request, 'Тест <b>{}</b> завершено не коректно. {}'.format(item.title, form.errors))
            return render(request, 'item_run.html', {'items': items, 'form': form})
        answers = json.loads(form.cleaned_data['answers'])
        count = 0
        if len(answers) != len(my_quiz['question']):
            messages.error(request,
                           'Кількість відповідей не відповідає кількості питаннь. Доведеться пройти тест ще раз.')
            return render(request, 'item_run.html', {'items': items, 'form': form})
        for value in range(len(my_quiz['question'])):
            if answers[value] == my_quiz['question'][value][-1]:
                count += 1
        result = '{}/{}'.format(count, len(my_quiz['question']))
        items.quiz = json.loads(items.quiz)
        return render(request, 'item_result.html', {'result': result, 'items': items, 'answers': answers})
    else:
        form = GetAnswers()
        for i in my_quiz['question']:
            i[-1] = len(i[-1])
        items.quiz = my_quiz
        return render(request, 'item_run.html', {'items': items, 'form': form})


@login_required
def logout_user(request):
    logout(request)
    return redirect('QuizSite:item_list')


@login_required
def my_item_list(request):
    items = Item.custom.authorsItems(request.user)
    query = request.GET.get('q')
    by_category = request.GET.get('cat')
    if by_category:
        items = items.filter(category=by_category)
    if query:
        if len(query) > 30:
            messages.error(request, 'В рядку пошуку не може бути більше 30 сиволів')
        else:
            items = items.filter(title__icontains=query)
    paginator = Paginator(items, 15)
    page = request.GET.get('page')
    item_list = paginator.get_page(page)
    return render(request, 'item_list_my.html', {'item_list': item_list})


@login_required
def item_delete(request, id):
    item = get_object_or_404(Item, id=id)
    if request.user != item.author:
        return Http404()
    try:
        item.delete()
    except Exception:
        messages.error(request, 'Не вдалося видалити тест <b>{}</b>.'.format(item.title))
    else:
        messages.success(request, 'Тест <b>{}</b> успішно видалено'.format(item.title))
    return redirect('QuizSite:my_item_list')


@login_required
def publish(request, id):
    item = get_object_or_404(Item, id=id)
    if request.user != item.author:
        return Http404()
    if not item.published_date:
        try:
            item.publish()
        except Exception:
            messages.error(request, 'Не вдалося опублікувати тест <b>{}</b>.'.format(item.title))
        else:
            messages.success(request, 'Тест {} успішно опубліковано'.format(item.title))
    return redirect('QuizSite:my_item_list')


@login_required
def hide(request, id):
    item = get_object_or_404(Item, id=id)
    if request.user != item.author:
        return Http404()
    if item.published_date:
        try:
            item.hide()
        except Exception:
            messages.error(request, 'Не вдалося вилучити тест <b>{}</b> з загального доступу.'.format(item.title))
        else:
            messages.success(request, 'Тест {} вилучено з загального доступу.'.format(item.title))
    return redirect('QuizSite:my_item_list')


@login_required
def create_item(request):
    if request.method == 'POST':
        form = QuizForm(request.POST)
        if form.is_valid():
            item = form.save(commit=False)
            item.author = request.user
            item.created_date = datetime.now()
            item.save()
            messages.success(request, 'Тест <b>{}</b> успішно створено.'.format(item.title))
            return redirect('QuizSite:my_item_list')
        else:
            messages.error(request, 'Не вдалося створити тест.')
            return render(request, 'item_create.html', {'form': form})

    else:
        form = QuizForm()
        return render(request, 'item_create.html', {'form': form})


@login_required
def edit_item(request, id):
    item = get_object_or_404(Item, id=id)
    if request.user != item.author:
        return Http404()
    if request.method == 'POST':
        form = QuizForm(request.POST, instance=item)
        if form.is_valid():
            saved_item = form.save(commit=False)
            saved_item.author = request.user
            saved_item.created_date = datetime.now()
            saved_item.save()
            hide(request, id)
            messages.success(request,
                             'Тест <b>{}</b> успішно відредаговано. Вам необхідно опублікувати його знову.'.format(
                                 form.cleaned_data.get('title')))
        else:
            messages.error(request, 'Тест <b>{}</b> не вдалося відредагувати. {}'.format(item.title, form.errors))
        return redirect('QuizSite:my_item_list')
    else:
        form = QuizForm()
        return render(request, 'item_edit.html', {'form': form, 'item': item})


@login_required
def validate_quiz_title(request):
    title = request.GET.get('title', None)
    id = request.GET.get('id', None)
    data = {
        'is_taken': Item.objects.exclude(id=id).filter(title__iexact=title).exists()
    }
    return JsonResponse(data)
