# Generated by Django 2.0.2 on 2018-03-23 20:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('QuizSite', '0008_auto_20180323_2232'),
    ]

    operations = [
        migrations.AlterField(
            model_name='item',
            name='description',
            field=models.CharField(max_length=150, verbose_name='Короткий опис'),
        ),
        migrations.AlterField(
            model_name='item',
            name='quiz',
            field=models.CharField(max_length=4000),
        ),
    ]
