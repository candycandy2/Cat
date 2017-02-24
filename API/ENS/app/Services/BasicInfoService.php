<?php
/**
 * 地點(location)-分類(function)相關商業邏輯處理
 * @author Cleo.W.Chan
 */
namespace App\Services;

use App\Repositories\BasicInfoRepository;
use App\Repositories\UserRepository;

class BasicInfoService
{   

    protected $basicInfoRepository;
    protected $userRepository;

    public function __construct(BasicInfoRepository $basicInfoRepository, UserRepository $userRepository)
    {
        $this->basicInfoRepository = $basicInfoRepository;
        $this->userRepository = $userRepository;
    }
    /**
     * 取得location-function及所屬成員
     * @return Array    成員分類列表
     */
    public function getBasicInfo(){

        $basicInfoData = $this->basicInfoRepository->getAllBasicInfo();
        $functionList = [];

        if(isset($basicInfoData)){
            foreach ($basicInfoData as $value) {

                $list['location'] = $value->location;
                $list['function'] = $value->function;
                $list['user_list']= [];
                $empNoArr = explode(',',$value->users);
                
                $userInfoList = $this->userRepository->getUserInfoByEmpNO($empNoArr);

               foreach ($userInfoList as $userInfo) {
                   
                   $user['emp_no'] = $userInfo->emp_no;
                   $user['login_id'] = $userInfo->login_id;
                   $user['user_ext_no'] = $userInfo->ext_no;
                   $user['email'] = $userInfo->email;
                   $list['user_list'][]= $user;
                }
                if((count($list['user_list']) > 0)){
                    $functionList[] = $list;
                }
            }
        }

        return $functionList;
    }

    /**
     * 檢查是否存在此function-location
     * @param  String $location 地點
     * @param  String $function 分類
     * @return blool           
     */
    public function checkBasicInfo($location, $function){
        $res = $this->basicInfoRepository->getBasicInfoByLocatnionFunction($location, $function);
        if(!is_null($res) && count($res) > 0){
            return true;
        }else{
            return false;
        }
    }

    /**
     * 用funciotn-location查詢有哪些成員
     * @return Collection     query result  
     */
    public function getUserByFunctionLocation(){
        $res = $this->basicInfoRepository->getBasicInfoByLocatnionFunction($location, $function);
    }
    
}