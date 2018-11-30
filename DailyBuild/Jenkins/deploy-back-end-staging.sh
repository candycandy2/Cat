# ======== QPlay API Start ========
# backup original
sshpass -p "kDsl24D1S" ssh rsyncuser@qplaytest.benq.com rm -rf /var/www/html/jenkinsbackup/qplayApi
sshpass -p "kDsl24D1S" ssh rsyncuser@qplaytest.benq.com mkdir -p /var/www/html/jenkinsbackup/qplayApi
sshpass -p "kDsl24D1S" ssh rsyncuser@qplaytest.benq.com cp -Rp /var/www/html/qplayApi/. /var/www/html/jenkinsbackup/qplayApi

# sync new files
sshpass -p "kDsl24D1S" rsync -rvh --delete qplayApi/qplayApi/config/ rsyncuser@qplaytest.benq.com:/var/www/html/qplayApi/config
sshpass -p "kDsl24D1S" rsync -rvh --delete qplayApi/qplayApi/app/ rsyncuser@qplaytest.benq.com:/var/www/html/qplayApi/app
sshpass -p "kDsl24D1S" rsync -rvh --delete qplayApi/qplayApi/resources/ rsyncuser@qplaytest.benq.com:/var/www/html/qplayApi/resources
sshpass -p "kDsl24D1S" rsync -rvh --delete qplayApi/qplayApi/bootstrap/ rsyncuser@qplaytest.benq.com:/var/www/html/qplayApi/bootstrap
sshpass -p "kDsl24D1S" rsync -rvh --delete qplayApi/qplayApi/tests/ rsyncuser@qplaytest.benq.com:/var/www/html/qplayApi/tests
sshpass -p "kDsl24D1S" rsync -rvh --delete qplayApi/qplayApi/database/ rsyncuser@qplaytest.benq.com:/var/www/html/qplayApi/database
sshpass -p "kDsl24D1S" rsync -rvh --delete qplayApi/qplayApi/public/css/ rsyncuser@qplaytest.benq.com:/var/www/html/qplayApi/public/css/
sshpass -p "kDsl24D1S" rsync -rvh --delete qplayApi/qplayApi/public/js/ rsyncuser@qplaytest.benq.com:/var/www/html/qplayApi/public/js/

sshpass -p "kDsl24D1S" rsync -rvh --exclude 'jpush.log' --exclude '.htaccess' --exclude '.env' qplayApi/qplayApi/public/ rsyncuser@qplaytest.benq.com:/var/www/html/qplayApi/public
sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/.env.example rsyncuser@qplaytest.benq.com:/var/www/html/qplayApi/.env.example

# create deploy version file
echo "deploy_ver=$(($BUILD_NUMBER)) deploy_time=$(date +"%b-%d-%y %H:%M:%S")" > deploy.jenkins
sshpass -p "kDsl24D1S" rsync -vh deploy.jenkins rsyncuser@qplaytest.benq.com:/var/www/html/qplayApi

# ======== QPlay API End ========


# ======== qmessage Start ========

# backup original
sshpass -p "kDsl24D1S" ssh rsyncuser@qplaytest.benq.com rm -rf /var/www/html/jenkinsbackup/qmessage
sshpass -p "kDsl24D1S" ssh rsyncuser@qplaytest.benq.com mkdir -p /var/www/html/jenkinsbackup/qmessage
sshpass -p "kDsl24D1S" ssh rsyncuser@qplaytest.benq.com cp -Rp /var/www/html/qmessage/. /var/www/html/jenkinsbackup/qmessage

# sync new files
sshpass -p "kDsl24D1S" rsync -rvh --delete qmessage/config/ rsyncuser@qplaytest.benq.com:/var/www/html/qmessage/config
sshpass -p "kDsl24D1S" rsync -rvh --delete qmessage/app/ rsyncuser@qplaytest.benq.com:/var/www/html/qmessage/app
sshpass -p "kDsl24D1S" rsync -rvh --delete qmessage/resources/ rsyncuser@qplaytest.benq.com:/var/www/html/qmessage/resources
sshpass -p "kDsl24D1S" rsync -rvh --delete qmessage/bootstrap/ rsyncuser@qplaytest.benq.com:/var/www/html/qmessage/bootstrap
sshpass -p "kDsl24D1S" rsync -rvh --delete qmessage/tests/ rsyncuser@qplaytest.benq.com:/var/www/html/qmessage/tests
sshpass -p "kDsl24D1S" rsync -rvh --delete qmessage/database/ rsyncuser@qplaytest.benq.com:/var/www/html/qmessage/database
sshpass -p "kDsl24D1S" rsync -rvh --delete qmessage/public/js/ rsyncuser@qplaytest.benq.com:/var/www/html/qmessage/public/js/

sshpass -p "kDsl24D1S" rsync -rvh --exclude 'jpush.log' --exclude '.htaccess' --exclude '.env' qmessage/public/ rsyncuser@qplaytest.benq.com:/var/www/html/qmessage/public
sshpass -p "kDsl24D1S" rsync -vh qmessage/.env.example rsyncuser@qplaytest.benq.com:/var/www/html/qmessage/.env.example

# create deploy version file
echo "deploy_ver=$(($BUILD_NUMBER)) deploy_time=$(date +"%b-%d-%y %H:%M:%S")" > deploy.jenkins
sshpass -p "kDsl24D1S" rsync -vh deploy.jenkins rsyncuser@qplaytest.benq.com:/var/www/html/qmessage

# ======== qmessage End ========


# ======== qplay Start ========

# backup original
sshpass -p "kDsl24D1S" ssh rsyncuser@qplaytest.benq.com rm -rf /var/www/html/jenkinsbackup/qplay
sshpass -p "kDsl24D1S" ssh rsyncuser@qplaytest.benq.com mkdir -p /var/www/html/jenkinsbackup/qplay
sshpass -p "kDsl24D1S" ssh rsyncuser@qplaytest.benq.com cp -Rp /var/www/html/qplay/. /var/www/html/jenkinsbackup/qplay

# sync new files
sshpass -p "kDsl24D1S" rsync -rvh --delete qplay/config/ rsyncuser@qplaytest.benq.com:/var/www/html/qplay/config
sshpass -p "kDsl24D1S" rsync -rvh --delete qplay/app/ rsyncuser@qplaytest.benq.com:/var/www/html/qplay/app
sshpass -p "kDsl24D1S" rsync -rvh --delete qplay/resources/ rsyncuser@qplaytest.benq.com:/var/www/html/qplay/resources
sshpass -p "kDsl24D1S" rsync -rvh --delete qplay/bootstrap/ rsyncuser@qplaytest.benq.com:/var/www/html/qplay/bootstrap
sshpass -p "kDsl24D1S" rsync -rvh --delete qplay/tests/ rsyncuser@qplaytest.benq.com:/var/www/html/qplay/tests
sshpass -p "kDsl24D1S" rsync -rvh --delete qplay/database/ rsyncuser@qplaytest.benq.com:/var/www/html/qplay/database
sshpass -p "kDsl24D1S" rsync -rvh --delete qplay/public/css/ rsyncuser@qplaytest.benq.com:/var/www/html/qplay/public/css/
sshpass -p "kDsl24D1S" rsync -rvh --delete qplay/public/js/ rsyncuser@qplaytest.benq.com:/var/www/html/qplay/public/js/

sshpass -p "kDsl24D1S" rsync -rvh --exclude 'jpush.log' --exclude '.htaccess' --exclude '.env' qplay/public/ rsyncuser@qplaytest.benq.com:/var/www/html/qplay/public
sshpass -p "kDsl24D1S" rsync -vh qplay/.env.example rsyncuser@qplaytest.benq.com:/var/www/html/qplay/.env.example

# create deploy version file
echo "deploy_ver=$(($BUILD_NUMBER)) deploy_time=$(date +"%b-%d-%y %H:%M:%S")" > deploy.jenkins
sshpass -p "kDsl24D1S" rsync -vh deploy.jenkins rsyncuser@qplaytest.benq.com:/var/www/html/qplay

# ======== qplay End ========


# ======== ENS API Start ========

# backup original
sshpass -p "kDsl24D1S" ssh rsyncuser@qplaytest.benq.com rm -rf /var/www/html/jenkinsbackup/ENSApi
sshpass -p "kDsl24D1S" ssh rsyncuser@qplaytest.benq.com mkdir -p /var/www/html/jenkinsbackup/ENSApi
sshpass -p "kDsl24D1S" ssh rsyncuser@qplaytest.benq.com cp -Rp /var/www/html/API/ENS/. /var/www/html/jenkinsbackup/ENSApi

# sync new files
sshpass -p "kDsl24D1S" rsync -rvh --delete API/ENS/config/ rsyncuser@qplaytest.benq.com:/var/www/html/API/ENS/config
sshpass -p "kDsl24D1S" rsync -rvh --delete API/ENS/app/ rsyncuser@qplaytest.benq.com:/var/www/html/API/ENS/app
sshpass -p "kDsl24D1S" rsync -rvh --delete API/ENS/resources/ rsyncuser@qplaytest.benq.com:/var/www/html/API/ENS/resources
sshpass -p "kDsl24D1S" rsync -rvh --delete API/ENS/bootstrap/ rsyncuser@qplaytest.benq.com:/var/www/html/API/ENS/bootstrap
sshpass -p "kDsl24D1S" rsync -rvh --delete API/ENS/tests/ rsyncuser@qplaytest.benq.com:/var/www/html/API/ENS/tests
sshpass -p "kDsl24D1S" rsync -rvh --delete API/ENS/database/ rsyncuser@qplaytest.benq.com:/var/www/html/API/ENS/database
sshpass -p "kDsl24D1S" rsync -rvh --delete API/ENS/public/js/ rsyncuser@qplaytest.benq.com:/var/www/html/API/ENS/public/js/

sshpass -p "kDsl24D1S" rsync -rvh --exclude 'jpush.log' --exclude '.htaccess' --exclude '.env' API/ENS/public/ rsyncuser@qplaytest.benq.com:/var/www/html/API/ENS/public
sshpass -p "kDsl24D1S" rsync -vh API/ENS/.env.example rsyncuser@qplaytest.benq.com:/var/www/html/API/ENS/.env.example

# create deploy version file
echo "deploy_ver=$(($BUILD_NUMBER)) deploy_time=$(date +"%b-%d-%y %H:%M:%S")" > deploy.jenkins
sshpass -p "kDsl24D1S" rsync -vh deploy.jenkins rsyncuser@qplaytest.benq.com:/var/www/html/API/ENS

# ======== EMS API End ========
