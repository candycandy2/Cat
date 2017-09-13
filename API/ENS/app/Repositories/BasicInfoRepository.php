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
     * 取得basic Info基本資料
     * @return mixed
     */
    public function getAllBasicInfoRawData($project)
    {   

        return  $this->basicInfo
            ->join( $this->userDataBaseName.'.'.$this->userTableName, $this->userTableName.'.emp_no', '=', 'en_basic_info.emp_no')
            ->where('project','=',$project)
            ->orderBy('location','asc')
            ->orderBy('function','asc')
            ->orderBy('emp_no','asc')
            ->select(
                'location',
                'function',
                'master',
                'en_basic_info.emp_no as emp_no',
                $this->userTableName.'.'.'status as status',
                $this->userTableName.'.'.'resign as resign'
                )
            ->get();
    }

    /**
     * 使用location-function 取得資本資料
     * @param  String $project   project
     * @param  String $location 地點
     * @param  String $function 分類
     * @return mixed
     */
    public function getBasicInfoByLocatnionFunction($project, $location, $function){

         return  $this->basicInfo
            ->select('row_id')
            ->where('project', '=', $project)
            ->where('location', '=', $location)
            ->where('function', '=', $function)
            ->get();
    }

    /**
     * 使用location-function 取得所屬成員
     * @param  String $project   project
     * @param  String $location 地點
     * @param  String $function 分類
     * @return mixed
     */
    public function getUserByLocationFunction($project, $location, $function){
       
        return  $this->basicInfo
            ->join( $this->userDataBaseName.'.'.$this->userTableName, $this->userTableName.'.emp_no', '=', 'en_basic_info.emp_no')
            ->where('location', '=', $location)
            ->where('function', '=', $function)
            ->where('project', '=', $project)
            ->select('en_basic_info.emp_no as emp_no')
            ->orderBy('location','asc')
            ->orderBy('function','asc')
            ->get();
    }

    public function checkUserIsMember($project, $empNo){
        $res =  $this->basicInfo
            ->join( $this->userDataBaseName.'.'.$this->userTableName, $this->userTableName.'.emp_no', '=', 'en_basic_info.emp_no')
            ->where('en_basic_info.emp_no', '=', $empNo)
            ->where('project', '=', $project)
            ->select('en_basic_info.emp_no as emp_no')
            ->orderBy('project','asc')
            ->get();
            
         if(count($res) > 0){
            return true;
         }else{
            return false;
         }
    }
}