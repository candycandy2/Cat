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
     * @param  String    appKey
     * @return Array    成員分類列表
     */
    public function getBasicInfo($appKey){

        $basicInfoData = $this->basicInfoRepository->getAllBasicInfoRawData($appKey);

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
     * 取得成員資訊
     * @param  Array    $appKey  app_key
     * @return Array    成員列表
     */
    public function getBasicInfoMemberRawData($appKey){
        $members = [];
        $member=[];
        $basicInfoData = $this->basicInfoRepository->getAllBasicInfoRawData($appKey);
         if(isset($basicInfoData)){
             foreach ($basicInfoData as $value) {

                $empNoArr = (array)$value->emp_no;
                $userInfoList = $this->userRepository->getUserInfoByEmpNo($empNoArr);
                foreach ($userInfoList as $userInfo) {
                      $member['location'] = $value->location;
                      $member['function'] = $value->function;
                      $member['master'] = $value->master;
                      $member['emp_no'] = $userInfo->emp_no;
                      $member['login_id'] = $userInfo->login_id;
                      $member['email'] = $userInfo->email;
                      $member['user_ext_no'] = $userInfo->ext_no;
                      $member['status'] = $value->status;
                      $member['resign'] = $value->resign;
                      $members[] = $member;
                }
             }
         }
        
         return $members;

    }

    /**
     * 檢查是否存在此function-location
     * @param  String $appKey   app-key
     * @param  String $location 地點
     * @param  String $function 分類
     * @return blool           
     */
    public function checkBasicInfo($appKey, $location, $function){

        $res = $this->basicInfoRepository->getBasicInfoByLocatnionFunction($appKey, $location, $function);
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
    public function getUserByLocationFunction($appKey, $location, $function){
        return $this->basicInfoRepository->getUserByLocationFunction($appKey, $location, $function);
    }

    /**
     * 驗證上傳的Basic info 資訊
     * @param  File $file 匯入的excel檔案
     * @return json       驗證結果
     */
    public function validateUploadBasicInfo($file){
 
        $excel = [];
        $excelTitle = [];

        Excel::selectSheets('Upload')->load($file, function($reader) use (&$excel,&$excelTitle) {
            $excel = $reader->toArray();
            $objExcel = $reader->getExcel();
            $sheet = $objExcel->getSheet(0);
            $highestColumn = $sheet->getHighestColumn();
            $excelTitle = $sheet->rangeToArray('A1:' . $highestColumn . '1',NULL, TRUE, FALSE)[0];
        });
        $field = ['EmpNo','Ext','Function','Location','PIC','Master'];
        $lostField = [];
        $errorMsg = '';
        foreach ($field as  $FieldName) {
            if(!is_numeric(array_search($FieldName,$excelTitle))){
                $lostField[] = $FieldName;
            }
        }
        //檢查excel column
        if(count($lostField) > 0){
            $errorMsg = '缺少欄位: ' . implode(',',$lostField);
            return ['ResultCode'=>ResultCode::_014905_fieldFormatError,
                        'Message'=>"validate error",
                        'Content'=> $errorMsg ];
        }
        //逐列檢查
        $errorRow = [];

        foreach ($excel as $index => $row) {
           $requireStr = '不可空白';
           $num = $index + 2;
           foreach ($row as $key => $value) {
               if($value == ''){
                    $errorRow[$num][] = $key.'-'.$requireStr ;
               }
               if(strtolower($key) == 'pic'){
                    //0:用戶不存在|1:已離職|2:已停權
                    $userStatus = CommonUtil::getUserStatusJustByUserID($value);
                    if($userStatus == 0){
                        $errorRow[$num][] = $value.'-用戶不存在' ;
                    }else if($userStatus == 1){
                        $errorRow[$num][] = $value.'-已離職' ;
                    }else if($userStatus == 2){
                        $errorRow[$num][] = $value.'-已停權';
                    }
               }
           }
        }
        $errors = [];
        foreach ($errorRow as $index => $errorArr) {
            $tmpMsg = '第'.$index.'列發現資料錯誤:';
            foreach ($errorArr as $key => $errorStr) {
                if($key!=0){
                     $tmpMsg.='、'.$errorStr;
                 }else{
                     $tmpMsg.=$errorStr;
                 }
            }
            $errors[] =  $tmpMsg;
        }
        if(count($errorRow) > 0){
            return ['ResultCode'=>ResultCode::_014908_accountNotExist,
                        'Message'=>"validate error",
                        'Content'=>implode('</br>',$errors)];
        }

        return ['ResultCode'=>ResultCode::_1_reponseSuccessful,];

    }

    /**
     * TODO app-key
     * 匯入成員基本資料
     */
    public function importBasicInfo($file){
        
        $insertDataArray  = [];
        Excel::selectSheets('Upload')->load($file, function($reader) use (&$insertDataArray) {
            $data = $reader->toArray();      
            foreach ($data as $key => $uploadData) {
                $insertDataArray[] = $this->arrangeBasicInfoData($uploadData);
                $userData = $this->userRepository->getUserInfoByLoginId($uploadData['pic']);
                $this->registerToQmessage($userData);
            }
        });

        if(count($insertDataArray)>0){
            //移除舊資料
            $this->basicInfoRepository->deleteBasicInfo();
            //寫入新資料
            $result = $this->basicInfoRepository->insertBasicInfo($insertDataArray);
        }
        
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
        $insertData['master'] = $uploadData['master'];
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
            $resultCode = json_decode($res)->ResultCode;
            if( $resultCode  == ResultCode::_1_reponseSuccessful || $resultCode  == $this->message::_998002_userAlreadyExist){
                 $this->userRepository->updateUserByLoginId($userData->login_id, array('register_message'=>'Y'));
            }
        }
    }
}