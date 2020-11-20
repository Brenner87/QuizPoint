#!/usr/bin/env python3
import requests
import sys
from requests.exceptions import ConnectionError

try:
    response = requests.get('http://localhost:8000')
    if response.status_code != 200:
        sys.exit(1)
except ConnectionError:
    sys.exit(1)
