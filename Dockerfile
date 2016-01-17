FROM node:5.4.1

VOLUME /app
WORKDIR /app

RUN apt-get update

RUN apt-get install -y imagemagick graphicsmagick

# compiles and installs phantomjs
RUN apt-get install -y build-essential g++ flex bison gperf ruby perl \
  libsqlite3-dev libfontconfig1-dev libicu-dev libfreetype6 libssl-dev \
  libpng-dev libjpeg-dev python libx11-dev libxext-dev \
  git
RUN git clone --recurse-submodules git://github.com/ariya/phantomjs.git /tmp/phantomjs-build
RUN cd /tmp/phantomjs-build && ./build.py
RUN cp /tmp/phantomjs-build/bin/phantomjs /usr/local/bin/phantomjs-bin && rm -rf /tmp/phantomjs-build
ADD docker/phantomjs /usr/local/bin/phantomjs
RUN echo "deb http://httpredir.debian.org/debian jessie contrib" | tee -a /etc/apt/sources.list
RUN apt-get update && apt-get install -y \
  fontconfig                       \
  libfontconfig-dev                \
  libfontenc-dev                   \
  libfontenc1                      \
  libxfont-dev                     \
  libxfont1                        \
  xfonts-base                      \
  xfonts-100dpi                    \
  xfonts-75dpi                     \
  xfonts-cyrillic                  \
  ttf-mscorefonts-installer        \
  libxext-dev                      \
  libwayland-dev


RUN npm install gulp -g

ADD docker/entrypoint.sh /bin/entrypoint.sh

RUN git config --global user.name "docker-deployer"
RUN git config --global user.email "docker-deployer@latcraft.lv"

ENTRYPOINT ["/bin/entrypoint.sh"]
