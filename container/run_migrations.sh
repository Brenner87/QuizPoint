#!/bin/bash

set -e

if [ -z $PROJ_DB_ADDR ]; then
    echo "PROJ_DB_ADDR variable is empty, aborting..."
    exit 1
fi

if [ -z $IS_PROD ]; then
    echo "IS_PROD variable is empty, aborting..."
    exit 1
fi

if [ -z $DB_PORT ]; then
    echo "DB_PORT variable is empty, aborting..."
    exit 1
fi

if [ -z $DB_USER ]; then
    echo "DB_USER variable is empty, aborting..."
    exit 1
fi

if [ -z $DB_NAME ]; then
    echo "DB_NAME variable is empty, aborting..."
    exit 1
fi

if [ -z $DB_QUIZPOINT_PASS ]; then
    echo "DB_QUIZPOINT_PASS variable is empty, aborting..."
    exit 1
fi

if [ -z $DB_QUIZPOINT_KEY ]; then
    echo "DB_QUIZPOINT_KEY variable is empty, aborting..."
    exit 1
fi

python3 ./container/db_conn_check.py
python3 ./manage.py makemigrations
python3 ./manage.py migrate

if [ -n $PROJ_SUPERUSER ] && [ -n $PROJ_SUPERUSER_MAIL ] && [ -n $PROJ_SUPERUSER_PASS ]; then
    python3 ./manage.py shell -c "from django.contrib.auth.models import User; User.objects.create_superuser('${PROJ_SUPERUSER}', '${PROJ_SUPERUSER_MAIL}', '${PROJ_SUPERUSER_PASS}')"
fi
