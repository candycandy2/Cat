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
    /** @var user Inject QP_User model */
    protected $user;
    /** @var userDataBaseName user 資料庫名稱 */
    protected $userDataBaseName;
    /** @var userTableName user 資料表名稱 */
    protected $userTableName;

    /*
     * UserRepository constructor.
     * @param EN_Basic_Info $basicInfo
     * @param QP_User $user
     */
    public function __construct(EN_Basic_Info $basicInfo, QP_User $user)
    {     
        $this->basicInfo = $basicInfo;
        $this->userDataBaseName = \Config::get('database.connections.mysql_qplay.database');
        $this->userTableName = $user->getTableName();
    }

    /**
     * 取得所有function-locatio基本資料
     * @return mixed
     */
    public function getAllBasicInfo()
    {   

        return  $this->basicInfo
            ->select(
                'location',
                'function',
                DB::raw('GROUP_CONCAT(emp_no SEPARATOR ",") as users')
                )
            ->groupBy('location', 'function')
            ->orderBy('location','asc')
            ->orderBy('function','asc')
            ->get();
    }

    /**
     * 使用location-function 取得資本資料
     * @param  String $location 地點
     * @param  String $function 分類
     * @return mixed
     */
    public function getBasicInfoByLocatnionFunction($location, $function){

         return  $this->basicInfo
            ->select('row_id')
            ->where('location', '=', $location)
            ->where('function', '=', $function)
            ->get();
    }

    /**
     * 使用location-function 取得所屬成員
     * @param  String $location 地點
     * @param  String $function 分類
     * @return mixed
     */
    public function getUserByLocationFunction($location, $function){
       
        return  $this->basicInfo
            ->join( $this->userDataBaseName.'.'.$this->userTableName, $this->userTableName.'.emp_no', '=', 'en_basic_info.emp_no')
            ->where('location', '=', $location)
            ->where('function', '=', $function)
            ->select('en_basic_info.emp_no as emp_no')
            ->orderBy('location','asc')
            ->orderBy('function','asc')
            ->get();
    }

    /**
     * 取得location下所有function
     * @param  string $location 機房地點
     * @return mixed
     */
    public function getAllFunctionByLocation($location){
        return  $this->basicInfo
            ->where('location', '=', $location)
            ->select('function')
            ->get();
    }

    /**
     * 批量寫入basic_info
     * @param  Array $data 寫入的資料，接受多筆
     */
    public function insertBasicInfo(Array $data){
        $basicIfno = $this->basicInfo->insert($data);
    }

    public function deleteBasicInfo(){
        $this->basicInfo::truncate();    
    }
}