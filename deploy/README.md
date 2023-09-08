# Deploy

To deploy, we need to install dependencies, build the application files, install the service file, set the environment variables, and enable the service.

```shell
# ensure build-essential and nginx are available
apt install -y ca-certificates curl gnupg
mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
NODE_MAJOR=20
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
apt update
apt install -y nodejs
# install certbot
snap install --classic certbot
# clone the repo
git clone https://github.com/satograms/satogui.git
cd satogui
# do nodejs things
corepack enable
yarn
# copy the environment file and set the values
cp .env.example .env
# build project
yarn build
# copy the service into the systemd folder
cp deploy/satogui.service /etc/systemd/system/satogui.service
# create the user
adduser --disabled-login satogui
# create config location and copy configs
runuser -l satogui -c 'mkdir -p /home/satogui/.config/frontend/ /home/satogui/frontend/'
cp .env.example /home/satogui/.config/frontend/.env
chown satogui /home/satogui/.config/frontend/.env
cp -r /root/satogui/build/ /home/satogui/frontend
cp -r /root/satogui/{package.json,yarn.lock} /home/satogui/frontend/
chown satogui -R /home/satogui/frontend/
runuser -l satogui -c 'cd /home/satogui/frontend/ && yarn install --prod --frozen-lockfile'
#
#
# enable the service and start it
systemctl enable satogui.service
systemctl start satogui.service
# copy nginx config and enable it
cp deploy/server-conf /etc/nginx/sites-available/satogram_frontend
ln -sf /etc/nginx/sites-available/satogram_frontend /etc/nginx/sites-enabled/satogram_frontend
systemctl restart nginx
# use certbot to get a cert after dns is set
certbot --nginx -d satogram.xyz
```

To update the deploy:

```shell
git pull --rebase
yarn
yarn build
cp -r /root/satogui/build/ /home/satogui/frontend
cp -r /root/satogui/{package.json,yarn.lock} /home/satogui/frontend/
chown satogui -R /home/satogui/frontend/
runuser -l satogui -c 'cd /home/satogui/frontend/ && yarn install --prod --frozen-lockfile'
systemctl restart satogui.service
```
