"""
WSGI config for QuizPoint project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/2.0/howto/deployment/wsgi/
"""

import os
import time
import traceback
import signal
import sys



from django.core.wsgi import get_wsgi_application
PROJ_PATH = os.environ.get('PROJ_PATH', 'None')
ENV_PATH  = os.environ.get('WSGI_CONF', 'None')
sys.path.append(PROJ_PATH)
# adjust the Python version in the line below as needed

sys.path.append('{}/lib/python3.6/site-packages'.format($ENV_PATH)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "QuizPoint.settings")

try:
    application = get_wsgi_application()
except Exception:
    # Error loading applications
    if 'mod_wsgi' in sys.modules:
        traceback.print_exc()
        os.kill(os.getpid(), signal.SIGINT)
        time.sleep(2.5)



from whitenoise.django import DjangoWhiteNoise
application = DjangoWhiteNoise(application)
