# Generated by Django 2.0.1 on 2018-01-31 20:31

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('QuizSite', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='item',
            old_name='text',
            new_name='quiz',
        ),
    ]
