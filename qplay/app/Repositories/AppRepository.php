<?php
namespace App\Repositories;

use DB;

class AppRepository
{

    public function insertAppHead($db, $projectId, $appKey, $createdAt, $createdUser){

         $newAppRowId = \DB::table("qp_app_head")
            -> insertGetId(
                [   'project_row_id'=> $projectId,
                    'package_name'=>\Config::get('app.app_package').'.'.$appKey,
                    'default_lang_row_id'=>3,
                    'icon_url'=>'',
                    'security_level'=>3,
                    'created_at'=>$createdAt,
                    'created_user'=>$createdUser]);
        return $newAppRowId;
    }

    public function insertAppLine($db, $appRowId, $appKey, $createdAt, $createdUser){
        \DB::table("qp_app_line")
            -> insert(
                [   'app_row_id'=> $appRowId,
                    'lang_row_id'=>3,
                    'app_name'=>$appKey,
                    'app_summary'=>'',
                    'app_description'=>'',
                    'created_at'=>$createdAt,
                    'created_user'=>$createdUser]);
    }
} 