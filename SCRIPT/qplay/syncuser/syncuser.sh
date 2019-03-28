#!/bin/bash
#Program:
#   This program dpwnload file and decrypt file from url
#History
#   2018/06/29 Cleo.W.Chan First Realse
#   2018/07/06 Samuel.Hsieh Parameterize
#              staging/production first execute command: syncuser.sh staging/production first
#              staging/production normal execute command: syncuser.sh staging/production
#              dev first execute command: syncuser.sh dev first
#              dev narmal execute command: syncuser.sh dev
#   2018/07/13 Cleo.W.Chan Fix Bug
#			   according to command parameter,pass env patameter to error_handle
#   2018/07/23 Cleo.W.Chan Fix Bug
#              if download file all fail,delete storage/app/syncuser folder
#   2019/01/17 Cleo.W.Chan Modify API Link
#              no longer need first parameter assign dev/staging/production server address
# 	2019/03/28 Cleo.W.Chan Fix Bug
#			   if any one of source download faild, do not sync qplay user
case $1 in
	"staging")
        ServerADD=sa.benq.com
        Protocol='https'
        env='test'
        curlGetAddress="http://qplaytest.benq.com/qplayApi/public/v101/qplay/syncUserJob"
        ;;
    "production")
        ServerADD=sa.benq.com
        Protocol='https'
        env=''
        curlGetAddress="http://qplay.benq.com/qplayApi/public/v101/qplay/syncUserJob"
        ;;
    *) # dev or typo
        ServerADD=10.82.239.140
        Protocol='http'
        env='dev'
        curlGetAddress="http://qplaydev.benq.com/qplayApi/public/v101/qplay/syncUserJob"
        ;;
esac

#execute date
DATE=`date +%Y%m%d`
echo 'start sync QPlay user : '$DATE
#new log folder
mkdir -p log
# this array defined the which url need to sync, you can append as [$source_from]='$url'
# if you want to add new source to parse, you also need to add qplayApi\config\syncuser.php
declare -A arr
arr+=(
["flower"]=$Protocol'://'$ServerADD'/QTunnel/Sync/'
["qcsflower"]=$Protocol'://'$ServerADD'/QTunnel/SyncQCS/'
["partner"]='http://bpm.partner.com.tw/QTunnel/Sync/'
["ehr"]=$Protocol'://'$ServerADD'/QTunnel/SynceHR/'
)

STATUS=true
FAILED_SOURCE=""

for sourceFrom in ${!arr[@]}; do
    URL="${arr[${sourceFrom}]}$DATE.xls.gpg"
    TIMES=0
    RETRY=3 #set the tretry times
    while [ $TIMES -lt $RETRY ]
    do
        echo 'download file: '$sourceFrom
        mkdir -p -m700 /var/www/html/qplayApi/storage/app/syncuser
        wget --no-check-certificate --tries=3 --waitretry=1  --append-output=log/syncuser-`date +%Y-%-m-%d`.txt -N -P /var/www/html/qplayApi/storage/app/syncuser/${sourceFrom}/original ${URL}
        if [[ "$?" != 0 ]]; then
            #Download fail, retry
            TIMES=$(($TIMES+1))
        else
            #Success
            echo 'decrypt file: '$sourceFrom
            mkdir -p /var/www/html/qplayApi/storage/app/syncuser/${sourceFrom}/undo/
            gpg --batch --yes --output /var/www/html/qplayApi/storage/app/syncuser/${sourceFrom}/undo/${DATE}.xls --decrypt /var/www/html/qplayApi/storage/app/syncuser/${sourceFrom}/original/${DATE}.xls.gpg
            sudo chown -R apache:apache /var/www/html/qplayApi/storage/app/syncuser
            sudo chmod 700 -R /var/www/html/qplayApi/storage/app/syncuser
            break
        fi
    done
    if [ "${TIMES}" == "${RETRY}" ]; then
		STATUS=false
		FAILED_SOURCE=${FAILED_SOURCE}','${sourceFrom}
    fi
    sleep 3
done

if [ "${STATUS}" = true ]; then
    echo 'Call syncUserJob ... '
    curl -X GET $curlGetAddress
else
	#send error mail
	FAILED_SOURCE=${FAILED_SOURCE:1}
	php ./lib/error_handle.php ${FAILED_SOURCE} $DATE log/syncuser-`date +%Y-%-m-%d`.txt ${env}
	
	#delete syncuser source folder
    rm -d /var/www/html/qplayApi/storage/app/syncuser
	echo 'Sync User Failed : Download source file error !'
fi
exit 0
