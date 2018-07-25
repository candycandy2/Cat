
qplay Readme.md
=============================

## Version x.x.x - Published 2018 July 25

## Contents
- [DeployBackEnd-Production-QAccountPhase1](#DeployBackEnd-Production-QAccountPhase1)

----

<h2 id="DeployBackEnd-Production-QAccountPhase1">DeployBackEnd-Production-QAccountPhase1</h2>

    # staging server
    serverIP=23.99.120.80

    #if false; then
    #fi
    #git checkout master

    # ------ add release tag ------
    git tag -a v1.4.1.$BUILD_NUMBER.Production.BackEnd.QAccountPhase1 -m "v1.4.1.$BUILD_NUMBER[Production] BackEnd.QAccountPhase1"
    git push origin --tags

    chmod -R o=rx *

    # ======== QAccountPhase1 Start ========

    # backup original
    #sshpass -p "kDsl24D1S" ssh rsyncuser@$serverIP rm -rf /var/www/html/jenkinsbackup/qstorage
    #sshpass -p "kDsl24D1S" ssh rsyncuser@$serverIP mkdir -p /var/www/html/jenkinsbackup/qstorage
    #sshpass -p "kDsl24D1S" ssh rsyncuser@$serverIP cp -Rp /var/www/html/qstorage/. /var/www/html/jenkinsbackup/qstorage


    # sync new files
    git checkout be3698bb21d11e362c7e1d293014e5bcb55693fd .
    chmod -R o=rx *

    sshpass -p "kDsl24D1S" rsync -vh qplay/app/Http/Controllers/AuthController.php rsyncuser@$serverIP:/var/www/html/qplay/app/Http/Controllers/AuthController.php
    sshpass -p "kDsl24D1S" rsync -vh qplay/app/Http/Controllers/CompanyController.php rsyncuser@$serverIP:/var/www/html/qplay/app/Http/Controllers/CompanyController.php
    sshpass -p "kDsl24D1S" rsync -vh qplay/app/Http/routes.php rsyncuser@$serverIP:/var/www/html/qplay/app/Http/routes.php
    sshpass -p "kDsl24D1S" rsync -vh qplay/app/Model/QP_Company.php rsyncuser@$serverIP:/var/www/html/qplay/app/Model/QP_Company.php
    sshpass -p "kDsl24D1S" rsync -vh qplay/app/Model/QP_Company_Log.php rsyncuser@$serverIP:/var/www/html/qplay/app/Model/QP_Company_Log.php
    sshpass -p "kDsl24D1S" rsync -vh qplay/app/Repositories/CompanyRepository.php rsyncuser@$serverIP:/var/www/html/qplay/app/Repositories/CompanyRepository.php
    sshpass -p "kDsl24D1S" rsync -vh qplay/app/Services/CompanyService.php rsyncuser@$serverIP:/var/www/html/qplay/app/Services/CompanyService.php
    sshpass -p "kDsl24D1S" rsync -vh qplay/app/lib/ResultCode.php rsyncuser@$serverIP:/var/www/html/qplay/app/lib/ResultCode.php
    sshpass -p "kDsl24D1S" rsync -vh qplay/resources/lang/en/messages.php rsyncuser@$serverIP:/var/www/html/qplay/resources/lang/en/messages.php
    sshpass -p "kDsl24D1S" rsync -vh qplay/resources/lang/zh-cn/messages.php rsyncuser@$serverIP:/var/www/html/qplay/resources/lang/zh-cn/messages.php
    sshpass -p "kDsl24D1S" rsync -vh qplay/resources/lang/zh-tw/messages.php rsyncuser@$serverIP:/var/www/html/qplay/resources/lang/zh-tw/messages.php
    sshpass -p "kDsl24D1S" rsync -vh qplay/resources/views/auth/login.blade.php rsyncuser@$serverIP:/var/www/html/qplay/resources/views/auth/login.blade.php
    sshpass -p "kDsl24D1S" ssh rsyncuser@$serverIP mkdir -p /var/www/html/qplay/resources/views/company_maintain
    sshpass -p "kDsl24D1S" rsync -vh qplay/resources/views/company_maintain/company_list.blade.php rsyncuser@$serverIP:/var/www/html/qplay/resources/views/company_maintain/company_list.blade.php
    sshpass -p "kDsl24D1S" rsync -vh qplay/resources/views/company_maintain/company_list.blade.php rsyncuser@$serverIP:/var/www/html/qplay/resources/views/company_maintain/company_list.blade.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Http/Controllers/qplayController.php rsyncuser@$serverIP:/var/www/html/qplayApi/app/Http/Controllers/qplayController.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Http/routes.php rsyncuser@$serverIP:/var/www/html/qplayApi/app/Http/routes.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Model/QP_Company.php rsyncuser@$serverIP:/var/www/html/qplayApi/app/Model/QP_Company.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Model/QP_User.php rsyncuser@$serverIP:/var/www/html/qplayApi/app/Model/QP_User.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Repositories/CompanyRepository.php rsyncuser@$serverIP:/var/www/html/qplayApi/app/Repositories/CompanyRepository.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Services/CompanyService.php rsyncuser@$serverIP:/var/www/html/qplayApi/app/Services/CompanyService.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/resources/views/login.blade.php rsyncuser@$serverIP:/var/www/html/qplayApi/resources/views/login.blade.php


    git checkout 56023b35df983edd3271f00cb5fccd1e44bb184b .
    chmod -R o=rx *

    sshpass -p "kDsl24D1S" rsync -vh qplay/app/Http/Controllers/AuthController.php rsyncuser@$serverIP:/var/www/html/qplay/app/Http/Controllers/AuthController.php
    sshpass -p "kDsl24D1S" rsync -vh qplay/app/Repositories/CompanyRepository.php rsyncuser@$serverIP:/var/www/html/qplay/app/Repositories/CompanyRepository.php
    sshpass -p "kDsl24D1S" rsync -vh qplay/app/Services/CompanyService.php rsyncuser@$serverIP:/var/www/html/qplay/app/Services/CompanyService.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Http/Controllers/qplayController.php rsyncuser@$serverIP:/var/www/html/qplayApi/app/Http/Controllers/qplayController.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Repositories/CompanyRepository.php rsyncuser@$serverIP:/var/www/html/qplayApi/app/Repositories/CompanyRepository.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Services/CompanyService.php rsyncuser@$serverIP:/var/www/html/qplayApi/app/Services/CompanyService.php

    git checkout 3a2e8178579f9623b59a4ca5e4302a8a27d189f2 .
    chmod -R o=rx *
    sshpass -p "kDsl24D1S" rsync -vh qplay/app/Http/Controllers/AuthController.php rsyncuser@$serverIP:/var/www/html/qplay/app/Http/Controllers/AuthController.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Http/Controllers/qplayController.php rsyncuser@$serverIP:/var/www/html/qplayApi/app/Http/Controllers/qplayController.php


    # create deploy version file
    echo "deploy_ver=$(($BUILD_NUMBER))_QAccountPhase1 deploy_time=$(date +"%b-%d-%y %H:%M:%S")" > deploy.jenkins
    cp deploy.jenkins qplay/
    sshpass -p "kDsl24D1S" rsync -vh deploy.jenkins rsyncuser@$serverIP:/var/www/html/qplay

    #git pull
    #git add qplay/deploy.jenkins
    #git commit -m "v1.4.1.$BUILD_NUMBER[Production] BackEnd  QAccountPhase1"
    #git push

    # ======== QAccountPhase1 End ========
