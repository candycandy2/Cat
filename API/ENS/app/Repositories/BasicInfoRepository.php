<?php
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
     * get all basic info data
     * 
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
            ->groupBy('location','function')
            ->orderBy('location','function')
            ->get();
    }

    public function getBasicInfoByLocatnionFunction($location, $function){

         return  $this->basicInfo
            ->select('row_id')
            ->where('location','=',$location)
            ->where('function',$function)
            ->get();
    }


    public function getUserByLocationFunction($location, $function){
        return  $this->basicInfo
            ->join( 'en_user', 'en_user.emp_no', '=', 'en_basic_info.emp_no')
            ->where('location','=',$location)
            ->where('function','=',$function)
            ->select('en_basic_info.emp_no as emp_no')
            ->get();
    }
}