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
# build project
yarn build
# copy the service into the systemd folder
cp deploy/satogui.service /etc/systemd/system/satogui.service
# create the user
adduser --disabled-login satogui
# create config location and copy configs
runuser -l satogui -c 'mkdir -p /home/satogui/.config/frontend/'
cp deploy/.env.example /home/satogui/.config/frontend/.env
chown satogui /home/satogui/.config/frontend/.env
cp -r /root/satogui/.svelte-kit/output /home/satogui/frontend
#
#
# enable the service and start it
systemctl enable satogram_frontend.service
systemctl start satogram_frontend.service
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
cp -r .svelte-kit/output /home/satogui/frontend
systemctl restart satogram-backend.service
```
