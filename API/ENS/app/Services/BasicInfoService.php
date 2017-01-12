<?php
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

    public function checkBasicInfo($location, $function){
        $res = $this->basicInfoRepository->getBasicInfoByLocatnionFunction($location, $function);
        if(!is_null($res) && count($res) > 0){
            return true;
        }else{
            return false;
        }
    }

    public function getUserByFunctionLocation(){
        $res = $this->basicInfoRepository->getBasicInfoByLocatnionFunction($location, $function);
    }
    
}