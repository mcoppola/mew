#!/bin/sh

## CHANGE 'WEBSITE' to project name
## CHANGE port number

echo ""
echo "Deploying mew-web on prod server 104.236.220.177"
echo "-------------------------------------------"
ssh nodeapps@104.236.220.177 '
eval `ssh-agent` && ssh-add ~/.ssh/id_rsa
cd ~/sites/mew/web
git pull
forever stop 1
forever start app.js -p 3009
'