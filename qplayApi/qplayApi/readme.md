qplayApi Readme.md
=============================

## Version x.x.x - Published 2018 July 25

## Contents

- [Deploy SOP](#DeployProcedure)
- [DeployBackEnd-Production-SyncUser](#DeployBackEnd-Production-SyncUser)

----

<h2 id="DeployProcedure">Deploy SOP</h2>

### 1. 基礎建設


### 2. 環境設定


### 3. 資料設定
    getVersionLog Api 相關 Table
	    qp_app_version
	    qp_error_code
    addAppEvaluation Api 相關 Table 
	    qp_app_head
	    qp_app_evaluation

### 4. 檔案覆蓋
    新增 Jenkins 專案 DeployBackEnd-Staging-QPlay3API 處理檔案更新
    
    git checkout 2af0dae05483d2451eb08608feb217511af869fe .
    chmod -R o=rx *
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Http/Controllers/qplayController.php rsyncuser@13.75.117.225:/var/www/html/qplayApi/app/Http/Controllers/qplayController.php

    git checkout f332dff26ba1537382c679967ba1859ebbb3e3a3 .
    chmod -R o=rx *
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Http/Controllers/qplayController.php rsyncuser@13.75.117.225:/var/www/html/qplayApi/app/Http/Controllers/qplayController.php

    git checkout 0844825b7715b192c702d035f43a213ba41ba37b .
    chmod -R o=rx *
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Http/Controllers/appVersionController.php rsyncuser@13.75.117.225:/var/www/html/qplayApi/app/Http/Controllers/appVersionController.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Http/routes.php rsyncuser@13.75.117.225:/var/www/html/qplayApi/app/Http/routes.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Model/QP_App_Version.php rsyncuser@13.75.117.225:/var/www/html/qplayApi/app/Model/QP_App_Version.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Repositories/AppVersionRepository.php rsyncuser@13.75.117.225:/var/www/html/qplayApi/app/Repositories/AppVersionRepository.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Services/AppVersionService.php rsyncuser@13.75.117.225:/var/www/html/qplayApi/app/Services/AppVersionService.php

    git checkout 16cabc37184d77ed5f15847a331350d1ff9886f4 .
    chmod -R o=rx *
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Http/Controllers/appEvaluationController.php rsyncuser@13.75.117.225:/var/www/html/qplayApi/app/Http/Controllers/appEvaluationController.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Http/Controllers/appVersionController.php rsyncuser@13.75.117.225:/var/www/html/qplayApi/app/Http/Controllers/appVersionController.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Http/routes.php rsyncuser@13.75.117.225:/var/www/html/qplayApi/app/Http/routes.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Model/QP_App_Evaluation.php rsyncuser@13.75.117.225:/var/www/html/qplayApi/app/Model/QP_App_Evaluation.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Model/QP_App_Head.php rsyncuser@13.75.117.225:/var/www/html/qplayApi/app/Model/QP_App_Head.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Model/QP_Project.php rsyncuser@13.75.117.225:/var/www/html/qplayApi/app/Model/QP_Project.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Repositories/AppEvaluationRepository.php rsyncuser@13.75.117.225:/var/www/html/qplayApi/app/Repositories/AppEvaluationRepository.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Repositories/AppVersionRepository.php rsyncuser@13.75.117.225:/var/www/html/qplayApi/app/Repositories/AppVersionRepository.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Repositories/ProjectRepository.php rsyncuser@13.75.117.225:/var/www/html/qplayApi/app/Repositories/ProjectRepository.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Services/AppEvaluationService.php rsyncuser@13.75.117.225:/var/www/html/qplayApi/app/Services/AppEvaluationService.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Services/AppVersionService.php rsyncuser@13.75.117.225:/var/www/html/qplayApi/app/Services/AppVersionService.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Services/ProjectService.php rsyncuser@13.75.117.225:/var/www/html/qplayApi/app/Services/ProjectService.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/lib/ResultCode.php rsyncuser@13.75.117.225:/var/www/html/qplayApi/app/lib/ResultCode.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/lib/Verify.php rsyncuser@13.75.117.225:/var/www/html/qplayApi/app/lib/Verify.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/database/migrations/2018_05_04_074730_create_update_evaluation_calculate_avg_score_trigger.php rsyncuser@13.75.117.225:/var/www/html/qplayApi/database/migrations/2018_05_04_074730_create_update_evaluation_calculate_avg_score_trigger.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/database/migrations/2018_05_04_110245_create_insert_evaluation_calculate_avg_score_trigger.php rsyncuser@13.75.117.225:/var/www/html/qplayApi/database/migrations/2018_05_04_110245_create_insert_evaluation_calculate_avg_score_trigger.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/database/migrations/2018_05_04_113438_create_delete_evaluation_calculate_avg_score_trigger.php rsyncuser@13.75.117.225:/var/www/html/qplayApi/database/migrations/2018_05_04_113438_create_delete_evaluation_calculate_avg_score_trigger.php

    git checkout 1e74fe08fa2116f101feb46c74a8a3aa26c654aa .
    chmod -R o=rx *
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Http/Controllers/customController.php rsyncuser@13.75.117.225:/var/www/html/qplayApi/app/Http/Controllers/customController.php

    git checkout fe0206f9541b925720aac6578db4b2ada0d69422 .
    chmod -R o=rx *
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Http/Controllers/customController.php rsyncuser@13.75.117.225:/var/www/html/qplayApi/app/Http/Controllers/customController.php

    git checkout 9adfed3f631d2cb1b75f9d64a7a62a299b843af3 .
    chmod -R o=rx *
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Http/Controllers/appVersionController.php rsyncuser@13.75.117.225:/var/www/html/qplayApi/app/Http/Controllers/appVersionController.php

    git checkout 90bed231f1fce50ec6d858295c821950ead93c6d .
    chmod -R o=rx *
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Http/Controllers/appVersionController.php rsyncuser@13.75.117.225:/var/www/html/qplayApi/app/Http/Controllers/appVersionController.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Repositories/AppVersionRepository.php rsyncuser@13.75.117.225:/var/www/html/qplayApi/app/Repositories/AppVersionRepository.php

<h2 id="DeployBackEnd-Production-SyncUser">DeployBackEnd-Production-SyncUser</h2>

    # staging server
    #serverIP=13.75.117.225

    # production server
    serverIP=23.99.120.80

    #if false; then
    #fi
    git checkout master

    # ------ add release tag ------
    git tag -a v1.4.1.$BUILD_NUMBER.Production.BackEnd.SyncUser -m "v1.4.1.$BUILD_NUMBER[Production] BackEnd.SyncUser"
    git push origin --tags

    chmod -R o=rx *

    # ======== SyncUser Start ========

    #1. 基礎建設(安裝需要的外部元件等)
    #   執行 Jenkins Job (DeployBackEnd-Staging-SyncUser)
    #   a. 確認已有gpg加解密，並匯入私鑰
    #     $gpg --import qlay-B40883D8-Secret.asc
    #     $gpg --list-secret-ksys

    sshpass -p "kDsl24D1S" rsync -vh /Users/samuel.hsieh/qlay-B40883DB-Secret.asc rsyncuser@$serverIP:/var/www/html/qplayApi/qlay-B40883DB–Secret.asc
    sshpass -p "kDsl24D1S" ssh rsyncuser@$serverIP gpg --import /var/www/html/qplayApi/qlay-B40883DB–Secret.asc
    sshpass -p "kDsl24D1S" ssh rsyncuser@$serverIP gpg --list-secret-keys

    #   b. 透過 composer 安裝外部元件
    #     更新 qplayApi/composer, qplayApi/composer.json
    #     刪除 qplayApi/composer.lock
    #     執行 composer update

    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/composer rsyncuser@$serverIP:/var/www/html/qplayApi/composer
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/composer.json rsyncuser@$serverIP:/var/www/html/qplayApi/composer.json
    sshpass -p "kDsl24D1S" ssh rsyncuser@$serverIP rm -rf /var/www/html/qplayApi/composer.lock
    # 會有 permission denied error, 使用手動
    #sshpass -p "kDsl24D1S" ssh rsyncuser@$serverIP /var/www/html/qplayApi/composer update


    #2. 環境設定(設定 .env config 等)
    #   N/A


    #3. 資料設定 (DB 修改)
    #   a. 執行 Jenkins Job (DeployBackEnd-Staging-SyncUser)
    #     qp_user新增欄位, qp_user_sync新增表, 

    sshpass -p "kDsl24D1S" ssh rsyncuser@$serverIP "mysql -usamuel.hsieh -pPiroshka0421 -e 'use qplay; ALTER TABLE \`qp_user\` ADD \`password\` VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL AFTER \`emp_name\`;'"
    sshpass -p "kDsl24D1S" ssh rsyncuser@$serverIP "mysql -usamuel.hsieh -pPiroshka0421 -e 'use qplay; ALTER TABLE \`qp_user\` ADD \`emp_id\` CHAR(6) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL AFTER \`password\`;'"
    sshpass -p "kDsl24D1S" ssh rsyncuser@$serverIP "mysql -usamuel.hsieh -pPiroshka0421 -e 'use qplay; ALTER TABLE \`qp_user\` ADD \`ad_flag\` CHAR(1) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT \"Y\" AFTER \`register_message\`, ADD \`reset_pwd\` CHAR(1) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT \"N\" AFTER \`ad_flag\`, ADD \`source_from\` VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL AFTER \`reset_pwd\`;'"

    sshpass -p "kDsl24D1S" ssh rsyncuser@$serverIP "mysql -usamuel.hsieh -pPiroshka0421 -e 'show databases; use qplay; CREATE TABLE \`qplay\`.\`qp_user_sync\` (\`row_id\` int(10) NOT NULL AUTO_INCREMENT, \`login_name\` varchar(50) DEFAULT NULL, \`emp_no\` varchar(50) NOT NULL, \`emp_name\` varchar(50) NOT NULL, \`emp_name_ch\` varchar(50) DEFAULT NULL, \`emp_id\` char(6) DEFAULT NULL, \`mail_account\` varchar(50) DEFAULT NULL, \`ext_no\` varchar(50) DEFAULT NULL, \`domain\` varchar(50) DEFAULT NULL, \`site_code\` varchar(10) NOT NULL, \`company\` varchar(600) DEFAULT NULL, \`dept_code\` varchar(36) NOT NULL, \`active\` varchar(1) NOT NULL, \`dimission_date\` datetime DEFAULT \"0000-00-00 00:00:00\", \`ad_flag\` char(1) NOT NULL DEFAULT \"Y\", \`source_from\` varchar(50) DEFAULT NULL, PRIMARY KEY (\`row_id\`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;'"
    sshpass -p "kDsl24D1S" ssh rsyncuser@$serverIP "mysql -usamuel.hsieh -pPiroshka0421 -e 'use qplay; ALTER TABLE \`qp_user_sync\` ADD KEY \`emp_no\` (\`emp_no\`);'"


    #4. 檔案覆蓋
    #a. 執行 Jenkins Job (DeployBackEnd-Staging-SyncUser) 更新修改的檔案，共 29 個
    git checkout 1c24f923d0afe860dfb68b6bf357f783ba43fcb7 .
    chmod -R o=rx *

    sshpass -p "kDsl24D1S" ssh rsyncuser@$serverIP mkdir -p /var/www/script
    sshpass -p "kDsl24D1S" ssh rsyncuser@$serverIP mkdir -p /var/www/script/qplay
    sshpass -p "kDsl24D1S" ssh rsyncuser@$serverIP mkdir -p /var/www/script/qplay/syncuser
    sshpass -p "kDsl24D1S" ssh rsyncuser@$serverIP mkdir -p /var/www/script/qplay/syncuser/lib

    sshpass -p "kDsl24D1S" rsync -vh SCRIPT/qplay/syncuser/lib/error_handle.php rsyncuser@$serverIP:/var/www/script/qplay/syncuser/lib/error_handle.php
    sshpass -p "kDsl24D1S" rsync -vh SCRIPT/qplay/syncuser/syncuser.sh rsyncuser@$serverIP:/var/www/script/qplay/syncuser/syncuser.sh

    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Http/Controllers/mailController.php rsyncuser@$serverIP:/var/www/html/qplayApi/app/Http/Controllers/mailController.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Http/Controllers/syncUserController.php rsyncuser@$serverIP:/var/www/html/qplayApi/app/Http/Controllers/syncUserController.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Http/routes.php rsyncuser@$serverIP:/var/www/html/qplayApi/app/Http/routes.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Model/QP_Push_Token.php rsyncuser@$serverIP:/var/www/html/qplayApi/app/Model/QP_Push_Token.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Model/QP_Register.php rsyncuser@$serverIP:/var/www/html/qplayApi/app/Model/QP_Register.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Model/QP_Role.php rsyncuser@$serverIP:/var/www/html/qplayApi/app/Model/QP_Role.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Model/QP_Session.php rsyncuser@$serverIP:/var/www/html/qplayApi/app/Model/QP_Session.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Model/QP_User.php rsyncuser@$serverIP:/var/www/html/qplayApi/app/Model/QP_User.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Model/QP_User_Sync.php rsyncuser@$serverIP:/var/www/html/qplayApi/app/Model/QP_User_Sync.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Repositories/PushTokenRepository.php rsyncuser@$serverIP:/var/www/html/qplayApi/app/Repositories/PushTokenRepository.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Repositories/RegisterRepository.php rsyncuser@$serverIP:/var/www/html/qplayApi/app/Repositories/RegisterRepository.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Repositories/RoleRepository.php rsyncuser@$serverIP:/var/www/html/qplayApi/app/Repositories/RoleRepository.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Repositories/SessionRepository.php rsyncuser@$serverIP:/var/www/html/qplayApi/app/Repositories/SessionRepository.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Repositories/UserRepository.php rsyncuser@$serverIP:/var/www/html/qplayApi/app/Repositories/UserRepository.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Repositories/UserSyncRepository.php rsyncuser@$serverIP:/var/www/html/qplayApi/app/Repositories/UserSyncRepository.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Services/RegisterService.php rsyncuser@$serverIP:/var/www/html/qplayApi/app/Services/RegisterService.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Services/RoleService.php rsyncuser@$serverIP:/var/www/html/qplayApi/app/Services/RoleService.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/Services/SyncUserService.php rsyncuser@$serverIP:/var/www/html/qplayApi/app/Services/SyncUserService.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/app/lib/PushUtil.php rsyncuser@$serverIP:/var/www/html/qplayApi/app/lib/PushUtil.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/config/app.php rsyncuser@$serverIP:/var/www/html/qplayApi/config/app.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/config/syncuser.php rsyncuser@$serverIP:/var/www/html/qplayApi/config/syncuser.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/resources/views/emails/empno_duplicate.blade.php rsyncuser@$serverIP:/var/www/html/qplayApi/resources/views/emails/empno_duplicate.blade.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/tests/SyncUserControllerUnitTest.php rsyncuser@$serverIP:/var/www/html/qplayApi/tests/SyncUserControllerUnitTest.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/tests/SyncUserServiceUnitTest.php rsyncuser@$serverIP:/var/www/html/qplayApi/tests/SyncUserServiceUnitTest.php
    sshpass -p "kDsl24D1S" rsync -vh qplayApi/qplayApi/tests/UserRepositoryUnitTest.php rsyncuser@$serverIP:/var/www/html/qplayApi/tests/UserRepositoryUnitTest.php


    #5. 功能設定
    #  a. 修改 syncuser.sh ”執行排程的日期”及”下載檔案路徑”設定


    echo "deploy_ver=$(($BUILD_NUMBER))_SyncUser deploy_time=$(date +"%b-%d-%y %H:%M:%S")" > deploy.jenkins
    cp deploy.jenkins qplay/
    sshpass -p "kDsl24D1S" rsync -vh deploy.jenkins rsyncuser@$serverIP:/var/www/html/qplay


    # ======== SyncUser End ========
