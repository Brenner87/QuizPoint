from django.db import models
from django.utils import timezone
from django.urls import reverse
from django.contrib.auth.models import User

# Create your models here.



class PublishedManager(models.Manager):
    def get_queryset(self):
        return super(PublishedManager, self).get_queryset().filter(published_date__lte=timezone.now()).order_by('-published_date')

class CustomManager(models.Manager):
    def authorsItems(self, user):
        return self.filter(author=user).order_by('-created_date')

    def authorsUnpublishedItems(self, user):
        return self.get_query_set().filter(author=user, published_date__isnull=True)

class Categories(models.Model):
    code=models.CharField(max_length=2, unique=True)
    name=models.CharField(max_length=20)

    def __str__(self):
        return self.name


class Item(models.Model):
    author          = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    title           = models.CharField(max_length=100, unique=True, verbose_name=u"Назва")
    category        = models.ForeignKey(Categories, on_delete=models.CASCADE, verbose_name=u"Категорія")
    quiz            = models.CharField(max_length=4000)
    created_date    = models.DateTimeField(default=timezone.now)
    published_date  = models.DateTimeField(blank=True, null=True)
    description     = models.CharField(max_length=150, verbose_name=u"Короткий опис")

    objects = models.Manager()
    published = PublishedManager()
    custom = CustomManager()


    def get_remove_url(self):
        return reverse('QuizSite:item_delete', args=[self.id])



    def get_absolute_url(self):
        return reverse('QuizSite:run_quiz', args=[self.id])

    def hide(self):
        self.published_date = None
        self.save()

    def publish(self):
        self.published_date = timezone.now()
        self.save()

    def get_published(self):
        items=self.objects.filter(published_date__lte=datetime.now()).order_by('-published_date')
        return items

    def add_item(self, user, title, description, quiz):
        self.author=user
        self.title=title
        self.description=description
        self.quiz=quiz
        self.created_date=timezone.now()
        self.save()

    def is_owner(self, user):
        if user == self.author:
            return True
