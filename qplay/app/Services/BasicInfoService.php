<?php
/**
 * 地點(location)-分類(function)相關商業邏輯處理
 * @author Cleo.W.Chan
 */
namespace App\Services;

use App\Repositories\BasicInfoRepository;
use App\Repositories\UserRepository;
use App\Repositories\EnUserGroupRepository;
use App\Repositories\BoardUserRepository;
use App\lib\ResultCode;
use App\lib\CommonUtil;
use App\lib\MessageUtil;
use Excel;

class BasicInfoService
{   

    protected $basicInfoRepository;
    protected $userRepository;
    protected $enUserGroupRepository;
    protected $boardUserRepository;
    protected $message;

    public function __construct(BasicInfoRepository $basicInfoRepository,
                                UserRepository $userRepository,
                                EnUserGroupRepository $enUserGroupRepository,
                                BoardUserRepository $boardUserRepository)
    {
        $this->basicInfoRepository = $basicInfoRepository;
        $this->userRepository = $userRepository;
        $this->enUserGroupRepository = $enUserGroupRepository;
        $this->boardUserRepository = $boardUserRepository;
        $this->message = new MessageUtil();
    }

    /**
     * 取得location-function及所屬成員
     * @param  String    project
     * @return mixed    成員分類列表
     */
    public function getBasicInfo($project){
        return $this->basicInfoRepository->getAllBasicInfoRawData($project);
    }

    /**
     * 取得管理者資訊
     * @param  string $project 專案名稱
     * @return mixed
     */
    public function getUserGroupInfo($project){
        return $this->enUserGroupRepository->getUserGroupInfo($project);
    }

    /**
     * 驗證上傳的Basic info 資訊
     * @param  File $file 匯入的excel檔案
     * @return json       驗證結果
     */
    public function validateUploadBasicInfo($file){
        //檢查欄位是否存在
        $chkField = array('member'=>['EmpNo','Ext','Function','Location','PIC','Master'],
                          'group'=>['EmpNo', 'Ext', 'Group','PIC']);
        $data = [];
        $lossSheet = [];
        $fieldMsg = "";
        $sheetMsg = "";
        $dataMsg = "";
        
        $sheetNames = Excel::load($file)->getSheetNames();
        if(!in_array('member', $sheetNames)){
            $lossSheet[]='member';
        }
        if(!in_array('group', $sheetNames)){
           $lossSheet[]='group';
        } 
        if(count($lossSheet) > 0){
            $sheetMsg = str_replace('%s', implode('、',  $lossSheet), trans('messages.ERR_SHEET_NOT_EXIST'));
            return ['ResultCode'=>ResultCode::_000919_validateError,
                        'Message'=>"validate error",
                        'Content'=> $sheetMsg ];
        }
        foreach ($chkField as $sheetName => $field) {
            $data = $this->getExcelData($file, $sheetName );
            $fieldErr = $this->validateField($field, $data['excelTitle']);
            if(count($fieldErr) > 0){
                $fieldMsg .= "<h5>[".$sheetName." sheet]</h5>";
                $fieldMsg .= implode('</br>',$fieldErr);
            }
            $dataErr = $this->validateData($data['excel']);
            if(count($dataErr) > 0){
                $dataMsg .= "<h5>[".$sheetName." sheet]</h5>";
                $dataMsg .= implode('</br>',$dataErr);
            }
        }
        if($fieldMsg != ""){
            return ['ResultCode'=>ResultCode::_000919_validateError,
                        'Message'=>"validate error",
                        'Content'=> $fieldMsg ];
        }
        if($dataMsg != ""){
            return ['ResultCode'=>ResultCode::_000901_userNotExistError,
                        'Message'=>"validate error",
                        'Content'=>$dataMsg];
        }
        return ['ResultCode'=>ResultCode::_1_reponseSuccessful,];

    }

    /**
     * 匯入成員基本資料
     * @param  String $project project
     */
    public function importBasicInfo($project, $file){

        $insertDataArray  = ['member'=>[],'group'=>[]];
        $boardUserArray = [];
        $boardId = $this->getBoardIdByProject($project)->board_id;

        Excel::selectSheets('member')->load($file, function($reader) use (&$insertDataArray, &$boardUserArray, $project, $boardId) {
            $data = $reader->toArray();      
            foreach ($data as $key => $uploadData) {
                $insertDataArray['member'][] = $this->basicInfoRepository->arrangeInsertData($project, $uploadData);
                $boardUserArray[$uploadData['empno']] = $this->boardUserRepository->arrangeInsertData($boardId, $uploadData);
            }
        });

        Excel::selectSheets('group')->load($file, function($reader) use (&$insertDataArray, &$boardUserArray, $project, $boardId) {
            $data = $reader->toArray();      
            foreach ($data as $key => $uploadData) {
                $insertDataArray['group'][] = $this->enUserGroupRepository->arrangeInsertData($project, $uploadData);
                $boardUserArray[$uploadData['empno']] = $this->boardUserRepository->arrangeInsertData($boardId, $uploadData);
            }
        });
        $memberData = $insertDataArray['member'];
        $groupData = $insertDataArray['group'];
        if(count($memberData)>0){
            //移除舊資料，寫入新 資料
            $this->basicInfoRepository->deleteBasicInfo($project);
            $result = $this->basicInfoRepository->insertBasicInfo($memberData);
        }

        if(count($groupData)>0){
            //移除舊資料，寫入新 資料
            $this->enUserGroupRepository->deleteUserGroup($project);
            $result = $this->enUserGroupRepository->insertUserGroup($groupData);
        }

        if(count($boardUserArray)>0){
            //移除舊資料，寫入新 資料
            $this->boardUserRepository->deleteUserByBoardId($boardId);
            $result = $this->boardUserRepository->insertBoardUser($boardUserArray);
        }
        
    }

    private function getExcelData($file, $sheetName){
        $excel = [];
        $excelTitle = [];
        Excel::selectSheets($sheetName)->load($file, function($reader) use (&$excel, &$sheetName, &$excelTitle) {
            $excel = $reader->toArray();
            $objExcel = $reader->getExcel();
            $sheet = $objExcel->getSheetByName($sheetName);
            $highestColumn = $sheet->getHighestColumn();
            $excelTitle = $sheet->rangeToArray('A1:' . $highestColumn . '1',NULL, TRUE, FALSE)[0];
        });

        return array(
            'excel'=>$excel,
            'excelTitle'=>$excelTitle
        );

    }

    private function validateField($chkField, $excelTitle){
        $lostField = [];
        $errorMsg = '';
        foreach ($chkField as  $FieldName) {
            if(!is_numeric(array_search($FieldName,$excelTitle))){
                $lostField[] = trans('messages.ERR_MISSING_FIELD').' : ' . $FieldName;
            }
        }
        return $lostField;
    }

    private function validateData($excel){
        $errorRow = [];
        foreach ($excel as $index => $row) {
           $requireStr = trans('messages.ERR_NOT_BLANK');
           $num = $index + 2;
           foreach ($row as $key => $value) {
               if($value == ''){
                    $errorRow[$num][] = $key.' - '.$requireStr ;
               }
               if(strtolower($key) == 'pic'){
                    //0:用戶不存在|1:已離職|2:已停權
                    $userStatus = CommonUtil::getUserStatusByUserID($value);
                    if($userStatus == 0){
                        $errorRow[$num][] = $value.' - '.trans('messages.ERR_USER_NOT_EXIST') ;
                    }else if($userStatus == 1){
                        $errorRow[$num][] = $value.' - '.trans('messages.ERR_USER_RESIGNED') ;
                    }else if($userStatus == 2){
                        $errorRow[$num][] = $value.' - '.trans('messages.ERR_USER_SUSPENDED');
                    }
               }
           }
        }
        $errors = [];
        foreach ($errorRow as $index => $errorArr) {
            $tmpMsg = str_replace('%s', $index, trans('messages.ERR_ROW_DATA_ERROR')).' : ';
            foreach ($errorArr as $key => $errorStr) {
                if($key!=0){
                     $tmpMsg.='、'.$errorStr;
                 }else{
                     $tmpMsg.=$errorStr;
                 }
            }
            $errors[] =  $tmpMsg;
        }
        return $errors;
    }

    private function getBoardIdByProject($project){
        return \DB::table('qp_board')->where('board_name', $project)
            ->join('qp_board_type','qp_board_type.row_id','=','qp_board.board_type_id')
            ->where('type_name','ENS')
            ->select('qp_board.row_id as board_id')
            ->first();
    }
}