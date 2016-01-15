FROM node:latest

VOLUME /app
WORKDIR /app

RUN npm install gulp -g

ADD docker/entrypoint.sh /bin/entrypoint.sh

ENTRYPOINT ["/bin/entrypoint.sh"]
