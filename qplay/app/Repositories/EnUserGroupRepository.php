<?php
/**
 * 用戶User相關資料處理
 * @author Cleo.W.Chan
 */
namespace App\Repositories;

use Doctrine\Common\Collections\Collection;
use App\Model\EN_Usergroup;
use DB;
use Config;

class EnUserGroupRepository
{
    /** @var User Inject QP_User model */
    protected $userGroup;
    /**
     * UserRepository constructor.
     * @param EN_Usergroup $userGroup
     */
    public function __construct(EN_Usergroup $userGroup)
    {
        $this->userGroup = $userGroup;
    }
    
    /**
     * 取得user group的資料
     * @param  string $project 專案名稱(ITS|RM)
     * @return mixed
     */
    public function getUserGroupInfo($project){
         DB::connection('mysql_ens')->statement(DB::raw('set @i:=0'));
        $userGroupInfo =   $this->userGroup
            ->join( 'qplay.qp_user', 'qp_user.emp_no', '=', 'ens.en_usergroup.emp_no')
            ->leftJoin(DB::raw('(SELECT distinct(qp_register.user_row_id) register_user_id FROM `qplay`.`qp_register`) registered'), function($join)
            {
                $join->on('qp_user.row_id', '=', 'registered.register_user_id');
            })
            ->where('project','=',$project)
            ->orderBy('usergroup','asc')
            ->select(
                'en_usergroup.row_id as row_id',
                'usergroup',
                'en_usergroup.emp_no as emp_no',
                'qplay.qp_user.login_id as login_id',
                'qplay.qp_user.status as status',
                'qplay.qp_user.resign as resign',
                'register_user_id',
                DB::raw('@i := @i + 1 as row_number')
                )
            ->get();
        return $userGroupInfo;
    }

    /**
     * 寫入user group
     * @param $data 欲寫入的資料
     * @return boolean
     */
    public function insertUserGroup(Array $data){
        return $this->userGroup->insert($data);
    }

    /**
     * 刪除user group
     * @param  string $project 專案名稱(ITS|RM)
     * @return boolean
     */
    public function deleteUserGroup($project){
         return $this->userGroup
        ->where('project', '=', $project)
        ->delete();
    }

     /**
     * 將excel析出的raw data 整理成資料庫批量寫入的格式
     * @param  String $project project
     * @param  Array $data 解析檔案得到的資料陣列
     * @return Array
     */
    public function arrangeInsertData($project, $uploadData){
        $nowTimestamp = time();
        $now = date('Y-m-d H:i:s',$nowTimestamp);
        $insertData['project'] =  $project;
        $insertData['emp_no'] = $uploadData['empno'];
        $insertData['usergroup'] = $uploadData['group'];
        $insertData['created_user'] = \Auth::user()->row_id;
        $insertData['created_at'] = $now;
        return $insertData;
    }

}