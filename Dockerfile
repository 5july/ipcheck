FROM ubuntu:latest

COPY ./requirments.txt /app/requirements.txt

RUN apt-get update -y && apt-get install -y python3-pip python3-dev

WORKDIR /app

RUN pip3 install -r requirements.txt

COPY . /app

#ENV LC_ALL=C.UTF-8
#ENV export LANG=C.UTF-8

ENTRYPOINT [ "python3" ]
CMD [ "run.py" ]
