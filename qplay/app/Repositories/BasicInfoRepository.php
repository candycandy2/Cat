<?php
/**
 * 地點(location)-分類(function)相關資料處理
 * @author Cleo.W.Chan
 */
namespace App\Repositories;

use Doctrine\Common\Collections\Collection;
use App\Model\EN_Basic_Info;
use App\Model\QP_User;
use DB;


class BasicInfoRepository
{
    /** @var basicInfo Inject En_Basic_Info model */
    protected $basicInfo;

    /*
     * UserRepository constructor.
     * @param EN_Basic_Info $basicInfo
     * @param QP_User $user
     */
    public function __construct(EN_Basic_Info $basicInfo, QP_User $user)
    {     
        $this->basicInfo = $basicInfo;
    }


    /**
     * 取得basic Info基本資料
     * @param String $appKey app-key
     * @return mixed
     */
    public function getAllBasicInfoRawData($appKey)
    {   
        DB::connection('mysql_ens')->statement(DB::raw('set @i:=0'));
        $basicInfo =   $this->basicInfo
            ->join( 'qplay.qp_user', 'qp_user.emp_no', '=', 'en_basic_info.emp_no')
            ->leftJoin(DB::raw('(SELECT distinct(qp_register.user_row_id) register_user_id FROM `qplay`.`qp_register`) registered'), function($join)
            {
                $join->on('qp_user.row_id', '=', 'registered.register_user_id');
            })
            ->where('app_key','=',$appKey)
            ->orderBy('location','asc')
            ->orderBy('function','asc')
            ->orderBy('emp_no','asc')
            ->select(
                'en_basic_info.row_id as row_id',
                'location',
                'function',
                'master',
                'en_basic_info.emp_no as emp_no',
                'qplay.qp_user.login_id as login_id',
                'qplay.qp_user.status as status',
                'qplay.qp_user.resign as resign',
                'register_user_id',
                DB::raw('@i := @i + 1 as row_number')
                )
            ->get();
        return $basicInfo;
    }

    /**
     * 批量寫入basic_info
     * @param  Array $data 寫入的資料，接受多筆
     */
    public function insertBasicInfo(Array $data){
        $basicIfno = $this->basicInfo->insert($data);
    }

    /**
     * 移除舊basic_info資料
     * @param String $appKey app-key
     * @return 
     */
    public function deleteBasicInfo($appKey){
        $this->basicInfo
        ->where('app_key', '=', $appKey)
        ->delete();
    }
}