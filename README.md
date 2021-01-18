# 0verAdmin
好像該開始做後台了

## Install
```
git clone https://github.com/0verseas/0verAdmin.git
cd 0verAdmin
npm install
cp src/env.js.example src/env.js
```
edit the config file in `src/env.js`

## Run
```
npm run serve
```

## Deploy
```
npm run build
```
the built static files will be in the `dist`

## Docker 🐳
1. Install [Docker](https://docs.docker.com/engine/install/) & [Docker Compose](https://docs.docker.com/compose/install/)
2. Edit docker compose file: `docker/docker-compose.yaml`
2. `cp docker/.env.example docker/.env` and edit it (if you need).
3. If static file doesn't yet be built, you should build it before running docker.
3. `cd docker && docker-compose up -d`
