#/usr/bin/env python3

import psycopg2, time, sys, logging, os
from psycopg2 import OperationalError


logging.basicConfig(level='INFO')


try_count = 10
interval = 10

while try_count > 0:
    try:
        conn = psycopg2.connect(
            dbname=os.environ['DB_NAME'],
            user=os.environ['DB_USER'],
            password=os.environ['DB_QUIZPOINT_PASS'],
            host=os.environ['PROJ_DB_ADDR'],
            port=os.environ['DB_PORT']
        )
        logging.info('DB connection established.')
        break
    except OperationalError as err:
        logging.warning('Was not able to connect to DB. {} attempts left.\n{}'.format(try_count, err))
        try_count -= 1
        time.sleep(interval)
else:
    logging.error('DB connection timeout. Exiting...')
    sys.exit(1)