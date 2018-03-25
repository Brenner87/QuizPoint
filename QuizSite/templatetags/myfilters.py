from django.utils.safestring import mark_safe
from django.template import Library
from QuizSite.models import Item, Categories
from django.shortcuts import get_object_or_404
from django.db.models import Count, Q
import json

register=Library()

@register.filter(is_safe=True)
def js(obj):
    return mark_safe(json.dumps(obj))

@register.filter(name='split')
def split_filter(value, arg):
    return value.split(arg)

@register.inclusion_tag('categories.html')
def show_categories(user='all'):
    if user=='all':
        categories = Categories.objects.annotate(number_of=Count('item', filter=Q(item__published_date__isnull=False)))
    else:
        categories = Categories.objects.annotate(number_of=Count('item', filter=Q(item__author__username=user)))
    return {'categories': categories}

@register.simple_tag
def get_category(id):
    item=get_object_or_404(Categories, id=id)
    return item.name

@register.simple_tag
def get_item_count(id):
    n_count=Item.objects.filter(category=id).Count()
    return n_count






@register.simple_tag
def build_url(field_name, value, urlencode=None):
    url = '?{}={}'.format(field_name, value)
    if urlencode:
        querystring = urlencode.split('&')
        filtered_querystring = filter(lambda p: p.split('=')[0] != field_name, querystring)
        encoded_querystring = '&'.join(filtered_querystring)
        if encoded_querystring:
            url = '{}&{}'.format(url, encoded_querystring)
    return url



