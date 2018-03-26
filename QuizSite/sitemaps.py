from django.contrib.sitemaps import Sitemap
from .models import Item




class QuizSitemap(Sitemap):
    changefreq='daily'
    priority=0.9

    def items(self):
        return Item.published.all()

    def lastmod(self, obj):
        return obj.published_date