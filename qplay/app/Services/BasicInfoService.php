<?php
/**
 * 地點(location)-分類(function)相關商業邏輯處理
 * @author Cleo.W.Chan
 */
namespace App\Services;

use App\Repositories\BasicInfoRepository;
use App\lib\ResultCode;
use App\lib\CommonUtil;
use Excel;

class BasicInfoService
{   

    protected $basicInfoRepository;

    public function __construct(BasicInfoRepository $basicInfoRepository)
    {
        $this->basicInfoRepository = $basicInfoRepository;
    }

    /**
     * 取得location-function及所屬成員
     * @param  String    appKey
     * @return mixed    成員分類列表
     */
    public function getBasicInfo($appKey){
        return $this->basicInfoRepository->getAllBasicInfoRawData($appKey);
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
            return ['ResultCode'=>ResultCode::_000919_validateError,
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
                    $userStatus = CommonUtil::getUserStatusByUserID($value);
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
            return ['ResultCode'=>ResultCode::_000901_userNotExistError,
                        'Message'=>"validate error",
                        'Content'=>implode('</br>',$errors)];
        }

        return ['ResultCode'=>ResultCode::_1_reponseSuccessful,];

    }

    /**
     * 匯入成員基本資料
     * @param  String $appKey app-key
     */
    public function importBasicInfo($appKey, $file){
        
        $insertDataArray  = [];
        Excel::selectSheets('Upload')->load($file, function($reader) use (&$insertDataArray, $appKey) {
            $data = $reader->toArray();      
            foreach ($data as $key => $uploadData) {
                $insertDataArray[] = $this->arrangeBasicInfoData($appKey, $uploadData);
                $userData = CommonUtil::getUserInfoJustByUserID($uploadData['pic']);
                $this->registerToQmessage($userData);
            }
        });

        if(count($insertDataArray)>0){
            //移除舊資料
            $this->basicInfoRepository->deleteBasicInfo($appKey);
            //寫入新資料
            $result = $this->basicInfoRepository->insertBasicInfo($insertDataArray);
        }
        
    }

    /**
     * 將excel析出的raw data 整理成資料庫批量寫入的格式，如果有未Qmessage註冊者，一併註冊
     * @param  String $appKey app-key
     * @param  Array $data 解析檔案得到的資料陣列
     * @return Array
     */
    private function arrangeBasicInfoData($appKey, $uploadData){
        $nowTimestamp = time();
        $now = date('Y-m-d H:i:s',$nowTimestamp);
        $insertData['app_key'] =  $appKey;
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
            if( $resultCode  == ResultCode::_1_reponseSuccessful || $resultCode  == '998002'){
                 $this->userRepository->updateUserByLoginId($userData->login_id, array('register_message'=>'Y'));
            }
        }
    }
}