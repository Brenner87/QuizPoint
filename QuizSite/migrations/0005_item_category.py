# Generated by Django 2.0.1 on 2018-03-19 18:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('QuizSite', '0004_auto_20180315_2328'),
    ]

    operations = [
        migrations.AddField(
            model_name='item',
            name='category',
            field=models.CharField(choices=[('FL', 'Зарубіжна Література'), ('PY', 'Психологія'), ('EN', 'Англійська')], default='FL', max_length=2),
            preserve_default=False,
        ),
    ]
