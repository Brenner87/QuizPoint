FROM python:3.6
COPY . /opt/quizpoint
WORKDIR /opt/quizpoint
RUN useradd quizpoint && chown -R quizpoint: /opt/quizpoint && pip install --upgrade pip && pip3 install uwsgi && pip3 install -r ./requirements.txt
USER quizpoint
EXPOSE 8000

#CMD ["uwsgi", "--ini", "./uwsgi.ini"]
CMD ["/bin/bash", "./container/init.sh"]
