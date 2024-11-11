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

## Deploy Docker Develop Environment
### Startup Preparation
if dev then
```
git clone https://github.com/0verseas/0verAdmin.git ./0verAdmin-dev/
cd ./0verAdmin-dev/
git checkout dev
```
if official then
```
git clone https://github.com/0verseas/0verAdmin.git
cd ./0verAdmin/
```

```
npm install
cp ./src/env.js.example ./src/env.js
cp ./docker/.env.example ./docker/.env
```
#### Edit Config Files
modify baseUrl, isProduction, reCAPTCHA_site_key
```
vim ./src/env.js
```
modfiy NETWORKS, DOMAIN_NAME, ENTRYPOINTS
*If dev then modfiy COMPOSE_PROJECT_NAME and CONTAINER_NAME*
```
vim ./docker/.env
```
#### *If want Container Block Exclude IPs Other than Ours*
modify uncomment row 28
```
vim ./docker/docker-compose.yaml
```
### Build
```
sudo npm run docker-build
```
### StartUp
*at ./docker/ path*
```
sudo docker-compose up -d
```
### Stop
*at ./docker/ path*
```
sudo docker-compose down
```
### ✨Nonstop Container and Apply New Edit Docker-Compose Setting (Use Only Container is running)✨
The command will not effect on the running container if you have not edited any of the settings on docker-compose.yaml
*at ./docker/ path*
```
sudo docker-compose up --detach
```