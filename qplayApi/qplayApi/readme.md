qplayApi Readme.md
=============================

## Version x.x.x - Published 2018 June 21

## Contents
- [Deploy SOP](#DeployProcedure)

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
