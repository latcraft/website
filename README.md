[![Build Status](https://travis-ci.org/latcraft/website.svg?branch=master)](https://travis-ci.org/latcraft/website)

# LatCraft website sources

This repository contains *Gulp* project that builds **LatCraft** website.

# Requisites

- The project local setup and dependencies are being handled by [Docker](https://www.docker.com/).
- The web site build uses [node.js](https://nodejs.org/) and [gulp.js](http://gulpjs.com/).
- The project team owns and maintains [latcraft/website](https://hub.docker.com/r/latcraft/website/) docker image ready to use.

# How to use docker image

The *Docker* image provides access to a preconfigured *Gulp* and *Npm*
environment. Particularly, `run.sh` could be thought of as a convenience command-line prefix (analogous to `sudo` or `env`). Because of the way *Docker* service works, it might need to use `sudo` (and ask for your user credentials).

You don't need to build *Docker* image yourself. You are welcome to use LatCraft team's
crafted and maintained version. You could obtain it by running `docker pull latcraft/website`.

# How to build site

- If it is the first time you run the web site build, then install all the `node` modules by executing: 

        ./run.sh npm install
 
- To build or to rebuild web site, fire the following command:
 
        ./run.sh gulp build

- Or just run `./run.sh gulp` to start local web server on port `9009` and go to
  <http://localhost:9009> in your browser. There is also a short-cut to start
  gulp if you are on Windows.

- By default website is built for `local` development environment. Adding `--environment stage` or `--environment live` arguments builds the website for `staging` or `production` accordingly.

> You also fuck Docker and run commands directly on your machine. That is – `npm install`, `gulp` etc.

# How to deploy to production

- Run `./run.sh gulp clean`, to perform clean build.
- Run `./run.sh gulp build --environment live`, to build the website for production.
- Run `./run.sh gulp deploy --environment live`, to deploy.
- Visit <http://latcraft.lv> and have fun!

```
Deployment to production is performed automatically by Travis CI upon push to master.
```

