FROM node:5.4.1

ENV DL_BASE_URL https://bitbucket.org/ariya/phantomjs/downloads
ENV DL_FILE     phantomjs-2.1.1-linux-x86_64.tar.bz2

RUN apt-get update

# for image thumbnails
RUN apt-get install -y imagemagick graphicsmagick

# build tool - gulp
RUN npm install gulp -g

# Git configuration
RUN git config --global user.name "docker-deployer"
RUN git config --global user.email "docker-deployer@latcraft.lv"

VOLUME /app
WORKDIR /app

# phantomjs
RUN wget "$DL_BASE_URL/$DL_FILE" -O "/$DL_FILE" \
  && tar -xjvf "/$DL_FILE" -C /
ADD docker/phantomjs /usr/local/bin/phantomjs
RUN apt-get install fontconfig

ADD docker/entrypoint.sh /bin/entrypoint.sh
ENTRYPOINT ["/bin/entrypoint.sh"]
