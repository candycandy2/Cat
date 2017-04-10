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
                
                $userInfoList = $this->userRepository->getUserInfoByEmpNo($empNoArr);

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
    
    /**
     * 匯入成員基本資料
     */
    public function importBasicInfo($file){
        
        //$filePath = 'public\exports\\'.'Upload_ENS_Template'.'.xlsx';
    
        Excel::selectSheets('Upload')->load($file, function($reader) {
            $data = $reader->toArray();
            $insertDataArray  = [];         
            foreach ($data as $key => $uploadData) {
                $insertDataArray[] = $this->arrangeBasicInfoData($uploadData);
                $userData = $this->userRepository->getUserInfoByLoginId($uploadData['pic']);
                $this->registerToQmessage($userData);
            }
            if(count($insertDataArray)>0){
                //移除舊資料
                $this->basicInfoRepository->deleteBasicInfo();
                //寫入新資料
                $result = $this->basicInfoRepository->insertBasicInfo($insertDataArray);
            }
        });
        
    }

    /**
     * 將excel析出的raw data 整理成資料庫批量寫入的格式，如果有未Qmessage註冊者，一併註冊
     * @param  Array $data 解析檔案得到的資料陣列
     * @return Array
     */
    private function arrangeBasicInfoData($uploadData){
        $nowTimestamp = time();
        $now = date('Y-m-d H:i:s',$nowTimestamp);
        $insertData['location'] = $uploadData['location'];
        $insertData['function'] = $uploadData['function'];
        $insertData['emp_no'] = $uploadData['empno'];
        $insertData['created_at'] = $now;
        return $insertData;
    }

    /**
     * 與Qmessage註冊
     * @param  Array $userData  使用者資訊
     */
    private function registerToQmessage($userData){
        if(!is_null($userData) && $userData->register_message == 'N'){
            $res = $this->message->register($userData->login_id);
            if(json_decode($res)->ResultCode == ResultCode::_1_reponseSuccessful){
                 $this->userRepository->updateUserByLoginId(array('register_message'=>'Y'));
            }
        }
    }
}