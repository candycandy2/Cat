chmod -R o=rx *

# ======== QPlay API Start ========
# backup original
sshpass -p "readrsync" ssh rsyncuser@10.82.246.95 rm -rf /var/www/html/jenkinsbackup/qplayApi
sshpass -p "readrsync" ssh rsyncuser@10.82.246.95 mkdir -p /var/www/html/jenkinsbackup/qplayApi
sshpass -p "readrsync" ssh rsyncuser@10.82.246.95 cp -Rp /var/www/html/qplayApi/. /var/www/html/jenkinsbackup/qplayApi

# sync new files
sshpass -p "readrsync" rsync -rvh --delete qplayApi/qplayApi/config/ rsyncuser@10.82.246.95:/var/www/html/qplayApi/config
sshpass -p "readrsync" rsync -rvh --delete qplayApi/qplayApi/app/ rsyncuser@10.82.246.95:/var/www/html/qplayApi/app
sshpass -p "readrsync" rsync -rvh --delete qplayApi/qplayApi/resources/ rsyncuser@10.82.246.95:/var/www/html/qplayApi/resources
sshpass -p "readrsync" rsync -rvh --delete qplayApi/qplayApi/bootstrap/ rsyncuser@10.82.246.95:/var/www/html/qplayApi/bootstrap
sshpass -p "readrsync" rsync -rvh --delete qplayApi/qplayApi/tests/ rsyncuser@10.82.246.95:/var/www/html/qplayApi/tests
sshpass -p "readrsync" rsync -rvh --delete qplayApi/qplayApi/database/ rsyncuser@10.82.246.95:/var/www/html/qplayApi/database
sshpass -p "readrsync" rsync -rvh --delete qplayApi/qplayApi/public/css/ rsyncuser@10.82.246.95:/var/www/html/qplayApi/public/css/
sshpass -p "readrsync" rsync -rvh --delete qplayApi/qplayApi/public/js/ rsyncuser@10.82.246.95:/var/www/html/qplayApi/public/js/

sshpass -p "readrsync" rsync -rvh --exclude 'jpush.log' --exclude '.htaccess' --exclude '.env' qplayApi/qplayApi/public/ rsyncuser@10.82.246.95:/var/www/html/qplayApi/public
sshpass -p "readrsync" rsync -vh qplayApi/qplayApi/.env.example rsyncuser@10.82.246.95:/var/www/html/qplayApi/.env.example

# create deploy version file
echo "deploy_ver=$(($BUILD_NUMBER)) deploy_time=$(date +"%b-%d-%y %H:%M:%S")" > deploy.jenkins
sshpass -p "readrsync" rsync -vh deploy.jenkins rsyncuser@10.82.246.95:/var/www/html/qplayApi

# ======== QPlay API End ========


# ======== qmessage Start ========

# backup original
sshpass -p "readrsync" ssh rsyncuser@10.82.246.95 rm -rf /var/www/html/jenkinsbackup/qmessage
sshpass -p "readrsync" ssh rsyncuser@10.82.246.95 mkdir -p /var/www/html/jenkinsbackup/qmessage
sshpass -p "readrsync" ssh rsyncuser@10.82.246.95 cp -Rp /var/www/html/qmessage/. /var/www/html/jenkinsbackup/qmessage

# sync new files
sshpass -p "readrsync" rsync -rvh --delete qmessage/config/ rsyncuser@10.82.246.95:/var/www/html/qmessage/config
sshpass -p "readrsync" rsync -rvh --delete qmessage/app/ rsyncuser@10.82.246.95:/var/www/html/qmessage/app
sshpass -p "readrsync" rsync -rvh --delete qmessage/resources/ rsyncuser@10.82.246.95:/var/www/html/qmessage/resources
sshpass -p "readrsync" rsync -rvh --delete qmessage/bootstrap/ rsyncuser@10.82.246.95:/var/www/html/qmessage/bootstrap
sshpass -p "readrsync" rsync -rvh --delete qmessage/tests/ rsyncuser@10.82.246.95:/var/www/html/qmessage/tests
sshpass -p "readrsync" rsync -rvh --delete qmessage/database/ rsyncuser@10.82.246.95:/var/www/html/qmessage/database
sshpass -p "readrsync" rsync -rvh --delete qmessage/public/js/ rsyncuser@10.82.246.95:/var/www/html/qmessage/public/js/

sshpass -p "readrsync" rsync -rvh --exclude 'jpush.log' --exclude '.htaccess' --exclude '.env' qmessage/public/ rsyncuser@10.82.246.95:/var/www/html/qmessage/public
sshpass -p "readrsync" rsync -vh qmessage/.env.example rsyncuser@10.82.246.95:/var/www/html/qmessage/.env.example

# create deploy version file
echo "deploy_ver=$(($BUILD_NUMBER)) deploy_time=$(date +"%b-%d-%y %H:%M:%S")" > deploy.jenkins
sshpass -p "readrsync" rsync -vh deploy.jenkins rsyncuser@10.82.246.95:/var/www/html/qmessage

# ======== qmessage End ========


# ======== qplay Start ========

# backup original
sshpass -p "readrsync" ssh rsyncuser@10.82.246.95 rm -rf /var/www/html/jenkinsbackup/qplay
sshpass -p "readrsync" ssh rsyncuser@10.82.246.95 mkdir -p /var/www/html/jenkinsbackup/qplay
sshpass -p "readrsync" ssh rsyncuser@10.82.246.95 cp -Rp /var/www/html/qplay/. /var/www/html/jenkinsbackup/qplay

# sync new files
sshpass -p "readrsync" rsync -rvh --delete qplay/config/ rsyncuser@10.82.246.95:/var/www/html/qplay/config
sshpass -p "readrsync" rsync -rvh --delete qplay/app/ rsyncuser@10.82.246.95:/var/www/html/qplay/app
sshpass -p "readrsync" rsync -rvh --delete qplay/resources/ rsyncuser@10.82.246.95:/var/www/html/qplay/resources
sshpass -p "readrsync" rsync -rvh --delete qplay/bootstrap/ rsyncuser@10.82.246.95:/var/www/html/qplay/bootstrap
sshpass -p "readrsync" rsync -rvh --delete qplay/tests/ rsyncuser@10.82.246.95:/var/www/html/qplay/tests
sshpass -p "readrsync" rsync -rvh --delete qplay/database/ rsyncuser@10.82.246.95:/var/www/html/qplay/database
sshpass -p "readrsync" rsync -rvh --delete qplay/public/css/ rsyncuser@10.82.246.95:/var/www/html/qplay/public/css/
sshpass -p "readrsync" rsync -rvh --delete qplay/public/js/ rsyncuser@10.82.246.95:/var/www/html/qplay/public/js/

sshpass -p "readrsync" rsync -rvh --exclude 'jpush.log' --exclude '.htaccess' --exclude '.env' qplay/public/ rsyncuser@10.82.246.95:/var/www/html/qplay/public
sshpass -p "readrsync" rsync -vh qplay/.env.example rsyncuser@10.82.246.95:/var/www/html/qplay/.env.example

# create deploy version file
echo "deploy_ver=$(($BUILD_NUMBER)) deploy_time=$(date +"%b-%d-%y %H:%M:%S")" > deploy.jenkins
sshpass -p "readrsync" rsync -vh deploy.jenkins rsyncuser@10.82.246.95:/var/www/html/qplay

# ======== qplay End ========


# ======== ENS API Start ========

# backup original
sshpass -p "readrsync" ssh rsyncuser@10.82.246.95 rm -rf /var/www/html/jenkinsbackup/ENSApi
sshpass -p "readrsync" ssh rsyncuser@10.82.246.95 mkdir -p /var/www/html/jenkinsbackup/ENSApi
sshpass -p "readrsync" ssh rsyncuser@10.82.246.95 cp -Rp /var/www/html/API/ENS/. /var/www/html/jenkinsbackup/ENSApi

# sync new files
sshpass -p "readrsync" rsync -rvh --delete API/ENS/config/ rsyncuser@10.82.246.95:/var/www/html/API/ENS/config
sshpass -p "readrsync" rsync -rvh --delete API/ENS/app/ rsyncuser@10.82.246.95:/var/www/html/API/ENS/app
sshpass -p "readrsync" rsync -rvh --delete API/ENS/resources/ rsyncuser@10.82.246.95:/var/www/html/API/ENS/resources
sshpass -p "readrsync" rsync -rvh --delete API/ENS/bootstrap/ rsyncuser@10.82.246.95:/var/www/html/API/ENS/bootstrap
sshpass -p "readrsync" rsync -rvh --delete API/ENS/tests/ rsyncuser@10.82.246.95:/var/www/html/API/ENS/tests
sshpass -p "readrsync" rsync -rvh --delete API/ENS/database/ rsyncuser@10.82.246.95:/var/www/html/API/ENS/database
sshpass -p "readrsync" rsync -rvh --delete API/ENS/public/js/ rsyncuser@10.82.246.95:/var/www/html/API/ENS/public/js/

sshpass -p "readrsync" rsync -rvh --exclude 'jpush.log' --exclude '.htaccess' --exclude '.env' API/ENS/public/ rsyncuser@10.82.246.95:/var/www/html/API/ENS/public
sshpass -p "readrsync" rsync -vh API/ENS/.env.example rsyncuser@10.82.246.95:/var/www/html/API/ENS/.env.example

# create deploy version file
echo "deploy_ver=$(($BUILD_NUMBER)) deploy_time=$(date +"%b-%d-%y %H:%M:%S")" > deploy.jenkins
sshpass -p "readrsync" rsync -vh deploy.jenkins rsyncuser@10.82.246.95:/var/www/html/API/ENS

# ======== EMS API End ========

# ======== Additional Process Start ========

# modify owner
sshpass -p "readrsync" ssh rsyncuser@10.82.246.95 chown apache.apache /var/www/html/qplay/storage
sshpass -p "readrsync" ssh rsyncuser@10.82.246.95 chown apache.apache /var/www/html/qplay/public
sshpass -p "readrsync" ssh rsyncuser@10.82.246.95 chown apache.apache /var/www/html/qplay/bootstrap/cache
sshpass -p "readrsync" ssh rsyncuser@10.82.246.95 chown apache.apache /var/www/html/qplay/public/jpush.log

# remove temporary files
sshpass -p "readrsync" ssh rsyncuser@10.82.246.95 rm /var/www/html/qplay/storage/framework/views/*

# ======== Additional Process End ========
