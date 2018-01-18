<?php
/**
 * 
 * User: Cleo.W.Chan
 * Date: 16-12-16
 * Time: 下午1:25
 */

namespace App\lib;
use Illuminate\Support\Facades\Input;
use App\Model\QP_User as QP_User;
use App\Model\QP_Project as QP_Project;
use App\Model\QP_Register as QP_Register;
use App\lib\ResultCode as ResultCode;
use Request;
use DB;
use Config;

class Verify
{
    /**
     * 1. 確認以下必要參數是否傳遞
     *     a. conteyt-type
     *     b. app-key
     *     c. Signature-Time
     *     d. Signature
     *     e. account
     */
    public static function verify()
    {
        $request = Request::instance();
        $input = Input::get();
        $headerContentType = $request->header('Content-Type');
        $headerAppKey = $request->header('app-key');
        $headerSignature = $request->header('Signature');
        $headerSignatureTime = $request->header('Signature-Time');
        $headerAccount = $request->header('account');
        $uuid = $request->uuid;
        $lang = $request->lang;
         //verify parameter count
        if($headerContentType == null || $headerAppKey == null
            || $headerSignature == null || $headerSignatureTime == null || $headerAccount == null || 
            $uuid == null || $lang ==null||
             trim($headerContentType) == "" || trim($headerAppKey) == "" ||
             trim($headerSignature) == "" || trim($headerSignatureTime) == "" || trim($headerAccount) == "" ||
             trim($uuid) == "" || trim($lang) =="" ) {
            return array("code"=>ResultCode::_999001_requestParameterLostOrIncorrect,
                "message"=> trans('result_code.'.ResultCode::_999001_requestParameterLostOrIncorrect));
        }

        if(!self::chkAppKeyExist($headerAppKey)) {
            return array("code"=>ResultCode::_999010_appKeyIncorrect,
                "message"=>trans('result_code.'.ResultCode::_999010_appKeyIncorrect));
        }

        $sigResult = self::chkSignature($headerAppKey, $headerSignature, $headerSignatureTime);
        if ($sigResult == 1) {
            return array("code"=>ResultCode::_999008_signatureIsInvalid,
                "message"=>trans('result_code.'.ResultCode::_999008_signatureIsInvalid));
        }

        if($sigResult == 2) {
            return array("code"=>ResultCode::_999011_signatureOvertime,
                "message"=>trans('result_code.'.ResultCode::_999011_signatureOvertime));
        }

        if(!self::checkUserStatusByEmpNo($headerAccount)) {
            return array("code"=>ResultCode::_997904_AccountNotExist,
                "message"=>trans('result_code.'.ResultCode::_997904_AccountNotExist));
        }

       if(!self::chkUuidExist($uuid)) {
            return array("code"=>ResultCode::_997910_uuidNotExist,
                "message"=>trans('result_code.'.ResultCode::_997910_uuidNotExist));
        }
        
        
        return array("code"=>ResultCode::_1_reponseSuccessful,
            "message"=>trans('result_code.'.ResultCode::_1_reponseSuccessful));
    }

    public static function chkAppKeyExist($appKey)
    {
        $projectList = QP_Project::where('app_key', "=", $appKey)
            -> select('row_id')->get();
        if(count($projectList) > 0 ) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 檢查用戶狀態
     * @param  String $empNo 員工編號
     * @return boolean       true:該用戶存在|false:用戶不存在
     */
    public static function checkUserStatusByEmpNo($account)
    {   
        $result = true;
        $userList = QP_User::where("emp_no", $account)
            -> where('status', '<>', 'N')
            -> where('resign', '<>', 'Y')
            -> select('row_id', 'status', 'resign','emp_no')->get();

        if(count($userList) < 1) {
            $result = false; //用户不存在
        }
        return $result;
    }

    
    public static function chkSignature($appKey, $signature, $signatureTime)
    {
        $nowTime = time();
        $serverSignature = self::getSignature($appKey, $signatureTime);

        if(strcmp($serverSignature, $signature) != 0) {
            return 1; //不匹配
        }

        if(abs($nowTime - $signatureTime) > 900) {
            return 2; //超时
        }

        return 3;
    }


    public static function getSignature($appKey, $signatureTime)
    {
        $key = self::getSecretKeyByAppKey($appKey);
        $ServerSignature = base64_encode(hash_hmac('sha256', $signatureTime, $key, true));
        return $ServerSignature;
    }

    public static function getSecretKeyByAppKey($appKey) {
        $projectList = QP_Project::where('qp_project.app_key', '=', $appKey)
            -> select('qp_project.row_id', 'qp_project.secret_key')->get();
        if(count($projectList) > 0) {
            return $projectList[0]->secret_key;
        }

        return null;
    }

    public static function chkUuidExist($uuid)
    {
        $registerInfoList = QP_Register::where('uuid', "=", $uuid)
            -> where('status', '=', 'A')
            -> select('row_id')->get();
        if(count($registerInfoList) > 0 ) {
            return true;
        } else {
            return false;
        }
    }
}