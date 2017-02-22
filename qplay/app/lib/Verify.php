<?php
namespace App\lib;

/**
 * Created by PhpStorm.
 * User: Moses.Zhu
 * Date: 16-6-20
 * Time: 下午1:25
 */

use Request;
use Illuminate\Support\Facades\Input;

class Verify
{
    static $TOKEN_VALIDATE_TIME = 2 * 86400;  //TODO 未来从DB取

    /**
     * 1. 確認傳送資料是否為json
     *     Accept: application/json
     *     Content-Type: application/json
     *
     *     這三種方法是用來檢查 request 的 header。
     *     a. Request::isJson() 用來檢查 HTTP_CONTENT_TYPE是否存在 application/json
     *     b. Request::wantsJson用來檢查 HTTP_ACCEPT 是否存在 application/json
     *     c. Request::format 用來檢查 request 要求的回傳格式
     *
     * 2. 確認以下必要參數是否傳遞
     *     a. app-key
     *     b. signature-time
     *     c. signature
     *     d. content-type已于第1點檢查
     *
     *
     */
    public static function verify()
    {
        $request = Request::instance();
        $input = Input::get();
        $headerContentType = $request->header('Content-Type');
        $headerAppKey = $request->header('App-Key');
        $headerSignature = $request->header('Signature');
        $headerSignatureTime = $request->header('Signature-Time');

        //verify parameter count
        if($headerContentType == null || $headerAppKey == null
            || $headerSignature == null || $headerSignatureTime == null
            || trim($headerContentType) == "" || trim($headerAppKey) == "" || trim($headerSignature) == "" || trim($headerSignatureTime) == "") {
            return array("code"=>ResultCode::_999001_requestParameterLostOrIncorrect,
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect));
        }

        if($headerAppKey != "qplay") {
            return array("code"=>ResultCode::_999010_appKeyIncorrect,
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_999010_appKeyIncorrect));
        }

        //verify language input
        if(!array_key_exists('lang', $input) || trim($input["lang"]) == "") {
            return array("code"=>ResultCode::_999004_parameterLangLostOrIncorrect,
                "message"=>CommonUtil::getMessageContentByCode(ResultCode::_999004_parameterLangLostOrIncorrect));
        }
        
        //verify content-type
        if (!stristr($headerContentType,'application/json')) {
            return array("code"=>ResultCode::_999006_contentTypeParameterInvalid,
                "message"=>CommonUtil::getMessageContentByCode(ResultCode::_999006_contentTypeParameterInvalid));
        }

        //TODO for test
        if($headerSignature == "Moses824")
        {
            return array("code"=>ResultCode::_1_reponseSuccessful,
                "message"=>"");
        }

//        if (!self::chkSignature($headerSignature, $headerSignatureTime)) {
//            return array("code"=>ResultCode::_999011_signatureOvertime,
//                "message"=>"signature參數錯誤或誤差超過15分鐘");

        $sigResult = self::chkSignature($headerSignature, $headerSignatureTime);
        if ($sigResult == 1) {
            return array("code"=>ResultCode::_999008_signatureIsInvalid,
                "message"=>CommonUtil::getMessageContentByCode(ResultCode::_999008_signatureIsInvalid));
        }

        if($sigResult == 2) {
            return array("code"=>ResultCode::_999011_signatureOvertime,
                "message"=>CommonUtil::getMessageContentByCode(ResultCode::_999011_signatureOvertime));
        }

        return array("code"=>ResultCode::_1_reponseSuccessful,
            "message"=>"");
    }

    public static function verifyToken($uuid, $token) {
        if($token == null || $uuid == null || trim($uuid) == "" || trim($token) == "") {
            return array("code"=>ResultCode::_999001_requestParameterLostOrIncorrect,
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect));
        }

        if(!Verify::chkUuidExist($uuid)) {
            return array("code"=>ResultCode::_000911_uuidNotExist,
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000911_uuidNotExist));
        }

        $sessionList = \DB::table("qp_session")
            -> where('uuid', "=", $uuid)
            -> where('token', '=', $token)
            //-> select('token_valid_date', 'last_message_time')->get();
            -> select('token_valid_date')->get();
        if(count($sessionList) < 1)
        {
            return array("code"=>ResultCode::_000908_tokenInvalid,
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000908_tokenInvalid));
        }

        $token_valid_date = $sessionList[0]->token_valid_date;
        //$last_message_time = $sessionList[0]->last_message_time;
        $ts = time() - $token_valid_date; //strtotime($token_valid_date);
        if($ts > Verify::$TOKEN_VALIDATE_TIME)
        {
            return array("code"=>ResultCode::_000907_tokenOverdue,
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000907_tokenOverdue));
        }

        $userInfo = CommonUtil::getUserInfoByUUID($uuid);
        if($userInfo == null)
        {
            return array("code"=>ResultCode::_000914_userWithoutRight,
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000914_userWithoutRight));
        }

        return array("code"=>ResultCode::_1_reponseSuccessful,
            "token_valid_date"=>$token_valid_date,
            //"last_message_time"=>$last_message_time,
            "message"=>"");
    }

    public static function verifyUserByUserID($loginid, $domain)
    {
        $userStatus = CommonUtil::getUserStatusByUserID($loginid, $domain);
        if($userStatus == 0) {
            return array("code"=>ResultCode::_000901_userNotExistError,
                "message"=>CommonUtil::getMessageContentByCode(ResultCode::_000901_userNotExistError));
        }
        if($userStatus == 1) {
            return array("code"=>ResultCode::_000901_userNotExistError,
                "message"=>CommonUtil::getMessageContentByCode(ResultCode::_000901_userNotExistError));
        }
        if($userStatus == 2) {
            return array("code"=>ResultCode::_000914_userWithoutRight,
                "message"=>CommonUtil::getMessageContentByCode(ResultCode::_000914_userWithoutRight));
        }

        return array("code"=>ResultCode::_1_reponseSuccessful,
            "message"=>"");
    }

    public static function verifyUserByUserIDAndCompany($loginid, $company)
    {
        $userStatus = CommonUtil::getUserStatusByUserIDAndCompany($loginid, $company);
        if($userStatus == 0) {
            return array("code"=>ResultCode::_000901_userNotExistError,
                "message"=>CommonUtil::getMessageContentByCode(ResultCode::_000901_userNotExistError));
        }
        if($userStatus == 1) {
            return array("code"=>ResultCode::_000901_userNotExistError,
                "message"=>CommonUtil::getMessageContentByCode(ResultCode::_000901_userNotExistError));
        }
        if($userStatus == 2) {
            return array("code"=>ResultCode::_000914_userWithoutRight,
                "message"=>CommonUtil::getMessageContentByCode(ResultCode::_000914_userWithoutRight));
        }

        return array("code"=>ResultCode::_1_reponseSuccessful,
            "message"=>"");
    }

    public static function chkUuidExist($uuid)
    {
        $registerInfoList = \DB::table("qp_register")
            -> where('uuid', "=", $uuid)
            -> where('status', '=', 'A')
            -> select('row_id')->get();
        if(count($registerInfoList) > 0 ) {
            return true;
        } else {
            return false;
        }
    }

    public static function chkAppKeyExist($appKey)
    {
        $projectList = \DB::table("qp_project")
            -> where('app_key', "=", $appKey)
            -> select('row_id')->get();
        if(count($projectList) > 0 ) {
            return true;
        } else {
            return false;
        }
    }

    public static function chkSignature($signature, $signatureTime)
    {
        $nowTime = time();
        $serverSignature = self::getSignature($signatureTime);
        if(strcmp($serverSignature, $signature) != 0) {
            return 1; //不匹配
        }

        if(abs($nowTime - $signatureTime) > 900) {
            return 2; //超时
        }

        return 3;
    }

    public static function getSignature($signatureTime)
    {
        $ServerSignature = base64_encode(hash_hmac('sha256', $signatureTime, 'swexuc453refebraXecujeruBraqAc4e', true));
        return $ServerSignature;

    }

    public static function chkSignatureYellowPage($signature, $signatureTime)
    {
        //TODO
        return 3;
    }

    public static function verifyYellowPage() {
        $request = Request::instance();
        $input = Input::get();
        $headerContentType = $request->header('Content-Type');
        $headerAppKey = $request->header('App-Key');
        $headerSignature = $request->header('Signature');
        $headerSignatureTime = $request->header('Signature-Time');

        //verify parameter count
        if($headerContentType == null || $headerAppKey == null
            || $headerSignature == null || $headerSignatureTime == null
            || trim($headerContentType) == "" || trim($headerAppKey) == "" || trim($headerSignature) == "" || trim($headerSignatureTime) == "") {
            return array("code"=>ResultCode::_999001_requestParameterLostOrIncorrect,
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect));
        }

        if($headerAppKey != "yellowpage") {
            return array("code"=>ResultCode::_999010_appKeyIncorrect,
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_999010_appKeyIncorrect));
        }

        //verify language input
        if(!array_key_exists('lang', $input) || trim($input["lang"]) == "") {
            return array("code"=>ResultCode::_999004_parameterLangLostOrIncorrect,
                "message"=>CommonUtil::getMessageContentByCode(ResultCode::_999004_parameterLangLostOrIncorrect));
        }

        //verify content-type
        if (!stristr($headerContentType,'application/json')) {
            return array("code"=>ResultCode::_999006_contentTypeParameterInvalid,
                "message"=>CommonUtil::getMessageContentByCode(ResultCode::_999006_contentTypeParameterInvalid));
        }

        //TODO for test
        if($headerSignature == "Moses824")
        {
//            return array("code"=>ResultCode::_1_reponseSuccessful,
//                "message"=>"");
        } else {
            $sigResult = self::chkSignatureYellowPage($headerSignature, $headerSignatureTime);
            if ($sigResult == 1) {
                return array("code"=>ResultCode::_999008_signatureIsInvalid,
                    "message"=>CommonUtil::getMessageContentByCode(ResultCode::_999008_signatureIsInvalid));
            }

            if($sigResult == 2) {
                return array("code"=>ResultCode::_999011_signatureOvertime,
                    "message"=>CommonUtil::getMessageContentByCode(ResultCode::_999011_signatureOvertime));
            }
        }

        //通用api參數判斷
        if(!array_key_exists('uuid', $input) || trim($input["uuid"]) == "")
        {
            return array("code"=>ResultCode::_999001_requestParameterLostOrIncorrect,
                "message"=>CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect));
        }

        $token = $request->header('token');
        $uuid = $input["uuid"];

        if(!self::chkUuidExist($uuid)) {
            return array("code"=>ResultCode::_000911_uuidNotExist,
                "message"=>CommonUtil::getMessageContentByCode(ResultCode::_000911_uuidNotExist));
        }

        return self::verifyToken($uuid, $token);
    }
}