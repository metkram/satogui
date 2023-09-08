#!/bin/bash

yarn
yarn build
cp -r /root/satogui/build/ /home/satogui/frontend
cp -r /root/satogui/{package.json,yarn.lock} /home/satogui/frontend/
chown satogui -R /home/satogui/frontend/
runuser -l satogui -c 'cd /home/satogui/frontend/ && yarn install --prod --frozen-lockfile'
systemctl restart satogui.service
systemctl status satogui.service
