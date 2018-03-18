from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

# Create your models here.



class PublishedManager(models.Manager):
    def get_queryset(self):
        return super(PublishedManager, self).get_queryset().filter(published_date__lte=timezone.now()).order_by('-published_date')

class CustomManager(models.Manager):
    def authorsItems(self, user):
        return self.filter(author=user)

    def authorsUnpublishedItems(self, user):
        return self.get_query_set().filter(author=user, published_date__isnull=True)


class Item(models.Model):
    author = models.ForeignKey('auth.User', on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=100, unique=True)
    quiz = models.TextField(max_length=10000)
    created_date = models.DateTimeField(default=timezone.now)
    published_date = models.DateTimeField(blank=True, null=True)
    description = models.TextField(max_length=300)

    object = models.Manager()
    published = PublishedManager()
    custom = CustomManager()


    def get_remove_url(self):
        return reverse('QuizSite:item_delete', args=[self.id])


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
