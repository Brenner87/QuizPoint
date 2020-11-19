#!/bin/bash

if [ -z $PROJ_ALLOWED_HOSTS ]; then
    echo "PROJ_ALLOWED_HOSTS variable is empty, aborting..."
    exit 1
fi

if [ -z $PROJ_NAME ]; then
    echo "PROJ_NAME variable is empty, aborting..."
    exit 1
fi

if [ -z $PROJ_DB_ADDR ]; then
    echo "PROJ_DB_ADDR variable is empty, aborting..."
    exit 1
fi

if [ -z $WSGI_CONF ]; then
    echo "WSGI_CONF variable is empty, aborting..."
    exit 1
fi

if [ -z $PROJ_PATH ]; then
    echo "PROJ_PATH variable is empty, aborting..."
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

if [ -z $PROJ_USER ]; then
    echo "PROJ_USER variable is empty, aborting..."
    exit 1
fi

if [ -z $PROJ_GROUP ]; then
    echo "PROJ_GROUP variable is empty, aborting..."
    exit 1
fi
sleep 20
python3 ./manage.py makemigrations
python3 ./manage.py migrate
uwsgi --ini ./uwsgi.ini
