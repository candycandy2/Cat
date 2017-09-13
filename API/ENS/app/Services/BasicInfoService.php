<?php
/**
 * 地點(location)-分類(function)相關商業邏輯處理
 * @author Cleo.W.Chan
 */
namespace App\Services;

use App\Repositories\BasicInfoRepository;
use App\Repositories\UserRepository;
use App\lib\ResultCode;
use App\Components\Message;
use App\lib\CommonUtil;
use Excel;

class BasicInfoService
{   

    protected $basicInfoRepository;
    protected $userRepository;
    protected $message;

    public function __construct(BasicInfoRepository $basicInfoRepository, UserRepository $userRepository, Message $message)
    {
        $this->basicInfoRepository = $basicInfoRepository;
        $this->userRepository = $userRepository;
        $this->message = $message;
    }

    /**
     * 取得location-function及所屬成員
     * @param  String    project
     * @return Array    成員分類列表
     */
    public function getBasicInfo($project){

        $basicInfoData = $this->basicInfoRepository->getAllBasicInfoRawData($project);
        $tmpList = [];
        $functionList = [];
        if(isset($basicInfoData)){
            foreach ($basicInfoData as $value) {
                $tmpList[$value->location][$value->function][] = $value->emp_no;
            }
            foreach ($tmpList as $location => $functionObj) {
               
                foreach ($functionObj as $function => $userList) {
                    $list['location'] = $location;
                    $list['function'] = $function;
                    $list['user_list']= [];
                    $userInfoList = $this->userRepository->getUserInfoByEmpNo($userList);
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
        }
        return $functionList;
    }

    /**
     * 檢查是否存在此function-location
     * @param  String $project   project
     * @param  String $location 地點
     * @param  String $function 分類
     * @return blool           
     */
    public function checkBasicInfo($project, $location, $function){

        $res = $this->basicInfoRepository->getBasicInfoByLocatnionFunction($project, $location, $function);
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
    public function getUserByLocationFunction($project, $location, $function){
        return $this->basicInfoRepository->getUserByLocationFunction($project, $location, $function);
    }

    public function checkUserIsMember($project, $emoNo){
        return $this->basicInfoRepository->checkUserIsMember($project, $emoNo);
    }
}