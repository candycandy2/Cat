#--dry-run

# ------ Create directory ------
sshpass -p "readrsync" ssh rsyncuser@10.82.246.95 mkdir -p /var/www/html/rsynctest/qplay
sshpass -p "readrsync" ssh rsyncuser@10.82.246.95 mkdir -p /var/www/html/rsynctest/qplayApi
sshpass -p "readrsync" ssh rsyncuser@10.82.246.95 mkdir -p /var/www/html/rsynctest/qplayApi/qplayApi
sshpass -p "readrsync" ssh rsyncuser@10.82.246.95 mkdir -p /var/www/html/rsynctest/API
sshpass -p "readrsync" ssh rsyncuser@10.82.246.95 mkdir -p /var/www/html/rsynctest/API/ENS
sshpass -p "readrsync" ssh rsyncuser@10.82.246.95 mkdir -p /var/www/html/rsynctest/qmessage

# ------ QPlay ------
sshpass -p "readrsync" rsync -rvh qplay/config/* rsyncuser@10.82.246.95:/var/www/html/rsynctest/qplay/config
sshpass -p "readrsync" rsync -rvh qplay/app/* rsyncuser@10.82.246.95:/var/www/html/rsynctest/qplay/app
sshpass -p "readrsync" rsync -rvh qplay/resources/* rsyncuser@10.82.246.95:/var/www/html/rsynctest/qplay/resources
sshpass -p "readrsync" rsync -rvh qplay/bootstrap/* rsyncuser@10.82.246.95:/var/www/html/rsynctest/qplay/bootstrap
sshpass -p "readrsync" rsync -rvh qplay/tests/* rsyncuser@10.82.246.95:/var/www/html/rsynctest/qplay/tests
sshpass -p "readrsync" rsync -rvh qplay/database/* rsyncuser@10.82.246.95:/var/www/html/rsynctest/qplay/database

sshpass -p "readrsync" rsync -rvh --exclude 'jpush.log' --exclude '.htaccess' qplay/public/* rsyncuser@10.82.246.95:/var/www/html/rsynctest/qplay/public
sshpass -p "readrsync" rsync -vh qplay/.env.example rsyncuser@10.82.246.95:/var/www/html/rsynctest/qplay/.env.example

# ------ QPlay API ------
sshpass -p "readrsync" rsync -rvh qplayApi/qplayApi/config/* rsyncuser@10.82.246.95:/var/www/html/rsynctest/qplayApi/qplayApi/config
sshpass -p "readrsync" rsync -rvh qplayApi/qplayApi/app/* rsyncuser@10.82.246.95:/var/www/html/rsynctest/qplayApi/qplayApi/app
sshpass -p "readrsync" rsync -rvh qplayApi/qplayApi/resources/* rsyncuser@10.82.246.95:/var/www/html/rsynctest/qplayApi/qplayApi/resources
sshpass -p "readrsync" rsync -rvh qplayApi/qplayApi/bootstrap/* rsyncuser@10.82.246.95:/var/www/html/rsynctest/qplayApi/qplayApi/bootstrap
sshpass -p "readrsync" rsync -rvh qplayApi/qplayApi/tests/* rsyncuser@10.82.246.95:/var/www/html/rsynctest/qplayApi/qplayApi/tests
sshpass -p "readrsync" rsync -rvh qplayApi/qplayApi/database/* rsyncuser@10.82.246.95:/var/www/html/rsynctest/qplayApi/qplayApi/database

sshpass -p "readrsync" rsync -rvh --exclude 'jpush.log' --exclude '.htaccess' qplayApi/qplayApi/public/* rsyncuser@10.82.246.95:/var/www/html/rsynctest/qplayApi/qplayApi/public
sshpass -p "readrsync" rsync -vh qplayApi/qplayApi/.env.example rsyncuser@10.82.246.95:/var/www/html/rsynctest/qplayApi/qplayApi/.env.example

# ------ ENS API ------
sshpass -p "readrsync" rsync -rvh API/ENS/config/* rsyncuser@10.82.246.95:/var/www/html/rsynctest/API/ENS/config
sshpass -p "readrsync" rsync -rvh API/ENS/app/* rsyncuser@10.82.246.95:/var/www/html/rsynctest/API/ENS/app
sshpass -p "readrsync" rsync -rvh API/ENS/resources/* rsyncuser@10.82.246.95:/var/www/html/rsynctest/API/ENS/resources
sshpass -p "readrsync" rsync -rvh API/ENS/bootstrap/* rsyncuser@10.82.246.95:/var/www/html/rsynctest/API/ENS/bootstrap
sshpass -p "readrsync" rsync -rvh API/ENS/tests/* rsyncuser@10.82.246.95:/var/www/html/rsynctest/API/ENS/tests
sshpass -p "readrsync" rsync -rvh API/ENS/database/* rsyncuser@10.82.246.95:/var/www/html/rsynctest/API/ENS/database

sshpass -p "readrsync" rsync -rvh --exclude 'jpush.log' --exclude '.htaccess' API/ENS/public/* rsyncuser@10.82.246.95:/var/www/html/rsynctest/API/ENS/public
sshpass -p "readrsync" rsync -vh API/ENS/.env.example rsyncuser@10.82.246.95:/var/www/html/rsynctest/API/ENS/.env.example

# ------ QMessage ------
sshpass -p "readrsync" rsync -rvh qmessage/config/* rsyncuser@10.82.246.95:/var/www/html/rsynctest/qmessage/config
sshpass -p "readrsync" rsync -rvh qmessage/app/* rsyncuser@10.82.246.95:/var/www/html/rsynctest/qmessage/app
sshpass -p "readrsync" rsync -rvh qmessage/resources/* rsyncuser@10.82.246.95:/var/www/html/rsynctest/qmessage/resources
sshpass -p "readrsync" rsync -rvh qmessage/bootstrap/* rsyncuser@10.82.246.95:/var/www/html/rsynctest/qmessage/bootstrap
sshpass -p "readrsync" rsync -rvh qmessage/tests/* rsyncuser@10.82.246.95:/var/www/html/rsynctest/qmessage/tests
sshpass -p "readrsync" rsync -rvh qmessage/database/* rsyncuser@10.82.246.95:/var/www/html/rsynctest/qmessage/database

# need to clarify
# sshpass -p "readrsync" rsync -rvh --exclude 'jpush.log' --exclude '.htaccess' qmessage/public/* rsyncuser@10.82.246.95:/var/www/html/rsynctest/qmessage/public
# sshpass -p "readrsync" rsync -vh qmessage/.env.example rsyncuser@10.82.246.95:/var/www/html/rsynctest/qmessage/.env.example
