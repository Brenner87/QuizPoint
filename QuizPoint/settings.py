"""
Django settings for QuizPoint project.

Generated by 'django-admin startproject' using Django 2.0.1.

For more information on this file, see
https://docs.djangoproject.com/en/2.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.0/ref/settings/
"""

import os
import dj_database_url

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR        = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

is_prod = os.environ.get('IS_HEROKU', None)

if is_prod:
    #here goes all your heroku config
    DB_USER     = 'quizpoint'
    DB_NAME     = 'quizpoint'
    DB_HOST     = 'localhost'
    DB_PORT     = ''
    DB_PASSWORD = ''
    SECRET_KEY  = ''
else:

    STUFF_DIR       = 'D:\OneDrive\PythonLearning\QuizPointStuff'
    DB_DIR          = os.path.join(STUFF_DIR, 'db_cred')
    SECRET_KEY_DIR  = os.path.join(STUFF_DIR, 'secret_key')
    DB_USER         = 'vagrant'
    DB_NAME         = 'quizpoint'
    DB_HOST         = '192.168.56.102'
    DB_PORT         = '5432'
    DB_PASSWORD     = open(os.path.join(DB_DIR, DB_USER), 'r')
    # Quick-start development settings - unsuitable for production
    # See https://docs.djangoproject.com/en/2.0/howto/deployment/checklist/
    # SECURITY WARNING: keep the secret key used in production secret!
    with open(os.path.join(SECRET_KEY_DIR, 'QuizPoint')) as f:
        SECRET_KEY = f.read().strip()

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = ['127.0.0.1', '.herokuapp.com']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'widget_tweaks',
    'django.contrib.sites',
    'django.contrib.sitemaps',
    'QuizSite',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'QuizPoint.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'QuizPoint.wsgi.application'


# Database
# https://docs.djangoproject.com/en/2.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': DB_NAME,
        'USER': DB_USER,
        'PASSWORD': DB_PASSWORD,
        'HOST': DB_HOST,
        'PORT': DB_PORT,
    }
}

db_from_env = dj_database_url.config(conn_max_age=500)
DATABASES['default'].update(db_from_env)


# Password validation
# https://docs.djangoproject.com/en/2.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/2.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.0/howto/static-files/
STATIC_URL  = '/static/'
STATIC_ROOT=os.path.join(BASE_DIR, 'QuizSite', 'static')
