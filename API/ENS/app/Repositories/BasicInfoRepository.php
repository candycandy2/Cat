<?php
/**
 * 地點(location)-分類(function)相關資料處理
 * @author Cleo.W.Chan
 */
namespace App\Repositories;

use Doctrine\Common\Collections\Collection;
use App\Model\EN_User;
use App\Model\EN_Basic_Info;
use DB;

class BasicInfoRepository
{
    /** @var User Inject En_Basic_Info model */
    protected $basicInfo;
   
    /*
     * UserRepository constructor.
     * @param EN_Basic_Info $basicInfo
     */
    public function __construct(EN_Basic_Info $basicInfo)
    {     
        $this->basicInfo = $basicInfo;
    }

    /**
     * 取得所有function-locatio基本資料
     * @return Collection
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
     * @return Collection
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
     * @return Collection
     */
    public function getUserByLocationFunction($location, $function){
        return  $this->basicInfo
            ->join( 'en_user', 'en_user.emp_no', '=', 'en_basic_info.emp_no')
            ->where('location', '=', $location)
            ->where('function', '=', $function)
            ->select('en_basic_info.emp_no as emp_no')
            ->orderBy('location','asc')
            ->orderBy('function','asc')
            ->get();
    }

    /**
     * 取得location下所有function
     * @param  [type] $location [description]
     * @return [type]           [description]
     */
    public function getAllFunctionByLocation($location){
        return  $this->basicInfo
            ->where('location', '=', $location)
            ->select('function')
            ->get();
    }
}