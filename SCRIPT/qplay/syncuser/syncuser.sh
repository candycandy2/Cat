#!/bin/bash
#Program: 
#   This program dpwnload file and decrypt file from url
#History
#   2018/06/29 Cleo.W.Chan First Realse

#execute date
DATE=`date +%Y%m%d`
echo 'start sync QPlay user : '$DATE

#new log folder
mkdir -p log
# this array defined the which url need to sync, you can append as [$source_from]='$url'
declare -A arr
arr+=( 
["flower"]='http://10.82.239.140/QTunnel/Sync/' 
["qcsflower"]='http://10.82.239.140/QTunnel/SyncQCS/'
)

for key in ${!arr[@]}; do
    URL="${arr[${key}]}$DATE.xls.gpg"
    TIMES=0 
    RETRY=3 #set the tretry times
    while [ $TIMES -lt $RETRY ]
    do
        echo 'download file: '$key
        mkdir -p -m700 /var/www/html/qplayApi/storage/app/syncuser 
        wget --no-check-certificate --tries=3 --waitretry=1  --append-output=log/syncuser-`date +%Y-%-m-%d`.txt -N -P /var/www/html/qplayApi/storage/app/syncuser/${key}/original ${URL}
        if [[ "$?" != 0 ]]; then
            #Download fail, retry
            TIMES=$(($TIMES+1))
        else
            #Success
            echo 'decrypt file: '$key
            mkdir -p /var/www/html/qplayApi/storage/app/syncuser/${key}/undo/
            gpg --batch --yes --output /var/www/html/qplayApi/storage/app/syncuser/${key}/undo/${DATE}.xls --decrypt /var/www/html/qplayApi/storage/app/syncuser/${key}/original/${DATE}.xls.gpg 
            sudo chown -R apache:apache /var/www/html/qplayApi/storage/app/syncuser
            sudo chmod 700 -R /var/www/html/qplayApi/storage/app/syncuser
            break
        fi
    done
    if [ "${TIMES}" == "${RETRY}" ]; then
        php ./lib/error_handle.php ${key} $DATE log/syncuser-`date +%Y-%-m-%d`.txt
    fi
    sleep 3
done
    echo 'call syncUserJob ... '
    #if fist time sync,please set first=Y to set source_from to user who are already in qp_user 
    curl -X GET 'http://qplaydev.benq.com/qplayApi/public/v101/qplay/syncUserJob?first=Y'
exit 0 