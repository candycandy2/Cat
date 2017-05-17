#--dry-run

# ------ Create directory ------
sshpass -p "readrsync" ssh rsyncuser@10.82.246.95 mkdir -p /var/www/html/rsynctest/qplay
sshpass -p "readrsync" ssh rsyncuser@10.82.246.95 mkdir -p /var/www/html/rsynctest/qplayApi
sshpass -p "readrsync" ssh rsyncuser@10.82.246.95 mkdir -p /var/www/html/rsynctest/qplayApi/qplayApi
sshpass -p "readrsync" ssh rsyncuser@10.82.246.95 mkdir -p /var/www/html/rsynctest/API
sshpass -p "readrsync" ssh rsyncuser@10.82.246.95 mkdir -p /var/www/html/rsynctest/API/ENS
sshpass -p "readrsync" ssh rsyncuser@10.82.246.95 mkdir -p /var/www/html/rsynctest/qmessage

# ------ QPlay ------
sshpass -p "readrsync" rsync -rvh --delete qplay/config/ rsyncuser@10.82.246.95:/var/www/html/rsynctest/qplay/config
sshpass -p "readrsync" rsync -rvh --delete qplay/app/ rsyncuser@10.82.246.95:/var/www/html/rsynctest/qplay/app
sshpass -p "readrsync" rsync -rvh --delete qplay/resources/ rsyncuser@10.82.246.95:/var/www/html/rsynctest/qplay/resources
sshpass -p "readrsync" rsync -rvh --delete qplay/bootstrap/ rsyncuser@10.82.246.95:/var/www/html/rsynctest/qplay/bootstrap
sshpass -p "readrsync" rsync -rvh --delete qplay/tests/ rsyncuser@10.82.246.95:/var/www/html/rsynctest/qplay/tests
sshpass -p "readrsync" rsync -rvh --delete qplay/database/ rsyncuser@10.82.246.95:/var/www/html/rsynctest/qplay/database

sshpass -p "readrsync" rsync -rvh --exclude 'jpush.log' --exclude '.htaccess' --exclude '.env' qplay/public/ rsyncuser@10.82.246.95:/var/www/html/rsynctest/qplay/public
sshpass -p "readrsync" rsync -vh qplay/.env.example rsyncuser@10.82.246.95:/var/www/html/rsynctest/qplay/.env.example

# ------ QPlay API ------
sshpass -p "readrsync" rsync -rvh --delete qplayApi/qplayApi/config/ rsyncuser@10.82.246.95:/var/www/html/rsynctest/qplayApi/qplayApi/config
sshpass -p "readrsync" rsync -rvh --delete qplayApi/qplayApi/app/ rsyncuser@10.82.246.95:/var/www/html/rsynctest/qplayApi/qplayApi/app
sshpass -p "readrsync" rsync -rvh --delete qplayApi/qplayApi/resources/ rsyncuser@10.82.246.95:/var/www/html/rsynctest/qplayApi/qplayApi/resources
sshpass -p "readrsync" rsync -rvh --delete qplayApi/qplayApi/bootstrap/ rsyncuser@10.82.246.95:/var/www/html/rsynctest/qplayApi/qplayApi/bootstrap
sshpass -p "readrsync" rsync -rvh --delete qplayApi/qplayApi/tests/ rsyncuser@10.82.246.95:/var/www/html/rsynctest/qplayApi/qplayApi/tests
sshpass -p "readrsync" rsync -rvh --delete qplayApi/qplayApi/database/ rsyncuser@10.82.246.95:/var/www/html/rsynctest/qplayApi/qplayApi/database

sshpass -p "readrsync" rsync -rvh --exclude 'jpush.log' --exclude '.htaccess' --exclude '.env' qplayApi/qplayApi/public/ rsyncuser@10.82.246.95:/var/www/html/rsynctest/qplayApi/qplayApi/public
sshpass -p "readrsync" rsync -vh qplayApi/qplayApi/.env.example rsyncuser@10.82.246.95:/var/www/html/rsynctest/qplayApi/qplayApi/.env.example

# ------ ENS API ------
sshpass -p "readrsync" rsync -rvh --delete API/ENS/config/ rsyncuser@10.82.246.95:/var/www/html/rsynctest/API/ENS/config
sshpass -p "readrsync" rsync -rvh --delete API/ENS/app/ rsyncuser@10.82.246.95:/var/www/html/rsynctest/API/ENS/app
sshpass -p "readrsync" rsync -rvh --delete API/ENS/resources/ rsyncuser@10.82.246.95:/var/www/html/rsynctest/API/ENS/resources
sshpass -p "readrsync" rsync -rvh --delete API/ENS/bootstrap/ rsyncuser@10.82.246.95:/var/www/html/rsynctest/API/ENS/bootstrap
sshpass -p "readrsync" rsync -rvh --delete API/ENS/tests/ rsyncuser@10.82.246.95:/var/www/html/rsynctest/API/ENS/tests
sshpass -p "readrsync" rsync -rvh --delete API/ENS/database/ rsyncuser@10.82.246.95:/var/www/html/rsynctest/API/ENS/database

sshpass -p "readrsync" rsync -rvh --exclude 'jpush.log' --exclude '.htaccess' --exclude '.env' API/ENS/public/ rsyncuser@10.82.246.95:/var/www/html/rsynctest/API/ENS/public
sshpass -p "readrsync" rsync -vh API/ENS/.env.example rsyncuser@10.82.246.95:/var/www/html/rsynctest/API/ENS/.env.example

# ------ QMessage ------
sshpass -p "readrsync" rsync -rvh --delete qmessage/config/ rsyncuser@10.82.246.95:/var/www/html/rsynctest/qmessage/config
sshpass -p "readrsync" rsync -rvh --delete qmessage/app/ rsyncuser@10.82.246.95:/var/www/html/rsynctest/qmessage/app
sshpass -p "readrsync" rsync -rvh --delete qmessage/resources/ rsyncuser@10.82.246.95:/var/www/html/rsynctest/qmessage/resources
sshpass -p "readrsync" rsync -rvh --delete qmessage/bootstrap/ rsyncuser@10.82.246.95:/var/www/html/rsynctest/qmessage/bootstrap
sshpass -p "readrsync" rsync -rvh --delete qmessage/tests/ rsyncuser@10.82.246.95:/var/www/html/rsynctest/qmessage/tests
sshpass -p "readrsync" rsync -rvh --delete qmessage/database/ rsyncuser@10.82.246.95:/var/www/html/rsynctest/qmessage/database

sshpass -p "readrsync" rsync -rvh --exclude 'jpush.log' --exclude '.htaccess' --exclude '.env' qmessage/public/ rsyncuser@10.82.246.95:/var/www/html/rsynctest/qmessage/public
sshpass -p "readrsync" rsync -vh qmessage/.env.example rsyncuser@10.82.246.95:/var/www/html/rsynctest/qmessage/.env.example
