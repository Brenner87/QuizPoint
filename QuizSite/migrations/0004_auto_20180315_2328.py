# Generated by Django 2.0.2 on 2018-03-15 21:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('QuizSite', '0003_auto_20180131_2116'),
    ]

    operations = [
        migrations.AlterField(
            model_name='item',
            name='title',
            field=models.CharField(max_length=100, unique=True),
        ),
    ]