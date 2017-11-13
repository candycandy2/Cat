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
use DB;

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
                //"message"=> "傳入參數不足或傳入參數格式錯誤"
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect)
            );
        }

        if($headerAppKey != CommonUtil::getContextAppKey()) {
            return array("code"=>ResultCode::_999010_appKeyIncorrect,
                //"message"=> "app-key參數錯誤"
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_999010_appKeyIncorrect)
            );
        }

        //verify language input
        if(!array_key_exists('lang', $input) || trim($input["lang"]) == "") {
            return array("code"=>ResultCode::_999004_parameterLangLostOrIncorrect,
                //"message"=>"lang參數錯誤 or 不存在"
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_999004_parameterLangLostOrIncorrect)
            );
        }
        
        //verify content-type
        if (!stristr($headerContentType,'application/json')) {
            return array("code"=>ResultCode::_999006_contentTypeParameterInvalid,
                //"message"=>"Content-Type錯誤"
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_999006_contentTypeParameterInvalid)
            );
        }
        /*
        //TODO for test

        if($headerSignature == "Moses824")
        {
            return array("code"=>ResultCode::_1_reponseSuccessful,
                "message"=>"");
        }
        */

//        if (!self::chkSignature($headerSignature, $headerSignatureTime)) {
//            return array("code"=>ResultCode::_999011_signatureOvertime,
//                "message"=>"signature參數錯誤或誤差超過15分鐘");

        $sigResult = self::chkSignature($headerSignature, $headerSignatureTime);
        if ($sigResult == 1) {
            return array("code"=>ResultCode::_999008_signatureIsInvalid,
                //"message"=>"Signature驗證碼不正確"
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_999008_signatureIsInvalid)
            );
        }

        if($sigResult == 2) {
            return array("code"=>ResultCode::_999011_signatureOvertime,
                //"message"=>"signature參數錯誤或誤差超過15分鐘"
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_999011_signatureOvertime)
            );
        }

        return array("code"=>ResultCode::_1_reponseSuccessful,
            "message"=>"");
    }

    public static function verifyWithCustomerAppKey()
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
                //"message"=> "傳入參數不足或傳入參數格式錯誤"
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect)
            );
        }

        if(!self::chkAppKeyExist($headerAppKey)) {
            return array("code"=>ResultCode::_999010_appKeyIncorrect,
                //"message"=> "app-key參數錯誤"
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_999010_appKeyIncorrect)
            );
        }

        //verify language input
        if(!array_key_exists('lang', $input) || trim($input["lang"]) == "") {
            return array("code"=>ResultCode::_999004_parameterLangLostOrIncorrect,
                //"message"=>"lang參數錯誤 or 不存在"
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_999004_parameterLangLostOrIncorrect)
            );
        }

        //verify content-type
        if (!stristr($headerContentType,'application/json')) {
            return array("code"=>ResultCode::_999006_contentTypeParameterInvalid,
                //"message"=>"Content-Type錯誤"
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_999006_contentTypeParameterInvalid)
            );
        }

        /*
        //TODO for test
        if($headerSignature == "Moses824")
        {
            return array("code"=>ResultCode::_1_reponseSuccessful,
                "message"=>"");
        }
        */

//        if (!self::chkSignature($headerSignature, $headerSignatureTime)) {
//            return array("code"=>ResultCode::_999011_signatureOvertime,
//                "message"=>"signature參數錯誤或誤差超過15分鐘");

        $sigResult = self::chkSignatureCustom($headerSignature, $headerSignatureTime,$headerAppKey);
        if ($sigResult == 1) {
            return array("code"=>ResultCode::_999008_signatureIsInvalid,
                //"message"=>"Signature驗證碼不正確"
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_999008_signatureIsInvalid)
            );
        }

        if($sigResult == 2) {
            return array("code"=>ResultCode::_999011_signatureOvertime,
                //"message"=>"signature參數錯誤或誤差超過15分鐘"
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_999011_signatureOvertime)
            );
        }

        return array("code"=>ResultCode::_1_reponseSuccessful,
            "message"=>"");
    }

    public static function verifyToken($uuid, $token) {
        if($token == null || $uuid == null || trim($uuid) == "" || trim($token) == "") {
            return array("code"=>ResultCode::_999001_requestParameterLostOrIncorrect,
                //"message"=> "傳入參數不足或傳入參數格式錯誤"
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect)
            );
        }

        if(!Verify::chkUuidExist($uuid)) {
            return array("code"=>ResultCode::_000911_uuidNotExist,
                //"message"=> "uuid不存在"
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000911_uuidNotExist)
            );
        }

//        $sessionList = \DB::table("qp_session")
//            -> where('uuid', "=", $uuid)
//            -> where('token', '=', $token)  //TODO $token解密后再查
//            //-> select('token_valid_date', 'last_message_time')->get();
//            -> select('token_valid_date')->get();
        $sql = "select distinct s.token_valid_date, s.user_row_id from qp_session s, qp_register r where s.uuid = '"
            .$uuid
            ."' and s.token = '"
            .$token
            ."' and s.uuid = r.uuid and s.user_row_id = r.user_row_id and r.`status` = 'A'";
        $sessionList = DB::select($sql, []);
        if(count($sessionList) < 1)
        {
            return array("code"=>ResultCode::_000908_tokenInvalid,
                //"message"=> "token已经失效"
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000908_tokenInvalid)
            );
        }

        $token_valid_date = $sessionList[0]->token_valid_date;
        //$last_message_time = $sessionList[0]->last_message_time;
        //$ts = time() - $token_valid_date; //strtotime($token_valid_date);
        //if($ts > Verify::$TOKEN_VALIDATE_TIME)
        if(time() > $token_valid_date)
        {
            return array("code"=>ResultCode::_000907_tokenOverdue,
                //"message"=> "token过期"
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000907_tokenOverdue)
            );
        }

//        $userInfo = CommonUtil::getUserInfoByUUID($uuid);
//        if($userInfo == null)
//        {
//            return array("code"=>ResultCode::_000914_userWithoutRight,
//                "message"=> "账号已被停权");
//        }
        $checkUserResult = Verify::verifyUserByUserRowID($sessionList[0]->user_row_id);
        if($checkUserResult["code"] != ResultCode::_1_reponseSuccessful) {
            return $checkUserResult;
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
                //"message"=>"員工資訊錯誤"
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000901_userNotExistError)
            );
        }
        if($userStatus == 1) {
            return array("code"=>ResultCode::_000901_userNotExistError,
                //"message"=>"員工資訊錯誤"
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000901_userNotExistError)
            );
        }
        if($userStatus == 2) {
            return array("code"=>ResultCode::_000914_userWithoutRight,
                //"message"=>"账号已被停权"
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000914_userWithoutRight)
            );
        }

        return array("code"=>ResultCode::_1_reponseSuccessful,
            "message"=>"");
    }

    public static function verifyUserByUserID4Logout($loginid, $domain)
    {
        $userStatus = CommonUtil::getUserStatusByUserID($loginid, $domain);
        if($userStatus == 0) {
            return array("code"=>ResultCode::_000901_userNotExistError,
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000901_userNotExistError)
            );
        }
        //供logout使用，即使用户停权或离职，仍可以loginout
        if($userStatus == 1) {
            return array("code"=>ResultCode::_1_reponseSuccessful,
                //"message"=>"員工資訊錯誤"
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000901_userNotExistError)
            );
        }
        if($userStatus == 2) {
            return array("code"=>ResultCode::_1_reponseSuccessful,
                //"message"=>"账号已被停权"
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000914_userWithoutRight)
            );
        }

        return array("code"=>ResultCode::_1_reponseSuccessful,
            "message"=>"");
    }

    public static function verifyUserByUserRowID($userRowId) {
        $userStatus = CommonUtil::getUserStatusByUserRowID($userRowId);
        if($userStatus == 0) {
            return array("code"=>ResultCode::_000901_userNotExistError,
                //"message"=>"員工資訊錯誤"
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000901_userNotExistError)
            );
        }
        if($userStatus == 1) {
            return array("code"=>ResultCode::_000901_userNotExistError,
                //"message"=>"員工資訊錯誤"
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000901_userNotExistError)
            );
        }
        if($userStatus == 2) {
            return array("code"=>ResultCode::_000914_userWithoutRight,
                //"message"=>"账号已被停权"
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000914_userWithoutRight)
            );
        }

        return array("code"=>ResultCode::_1_reponseSuccessful,
            "message"=>"");
    }

    public static function verifyUserByUserIDAndCompany($loginid, $company)
    {
        $userStatus = CommonUtil::getUserStatusByUserIDAndCompany($loginid, $company);
        if($userStatus == 0) {
            return array("code"=>ResultCode::_000901_userNotExistError,
                //"message"=>"員工資訊錯誤"
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000901_userNotExistError)
            );
        }
        if($userStatus == 1) {
            return array("code"=>ResultCode::_000901_userNotExistError,
                //"message"=>"員工資訊錯誤"
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000901_userNotExistError)
            );
        }
        if($userStatus == 2) {
            return array("code"=>ResultCode::_000914_userWithoutRight,
                //"message"=>"账号已被停权"
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000914_userWithoutRight)
            );
        }

        return array("code"=>ResultCode::_1_reponseSuccessful,
            "message"=>"");
    }

    public static function verifyUserByUserIDAndDomain($loginid, $domain)
    {
        $userStatus = CommonUtil::getUserStatusByUserIDAndDomain($loginid, $domain);
        if($userStatus == 0) {
            return array("code"=>ResultCode::_000901_userNotExistError,
                //"message"=>"員工資訊錯誤"
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000901_userNotExistError)
            );
        }
        if($userStatus == 1) {
            return array("code"=>ResultCode::_000901_userNotExistError,
                //"message"=>"員工資訊錯誤"
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000901_userNotExistError)
            );
        }
        if($userStatus == 2) {
            return array("code"=>ResultCode::_000914_userWithoutRight,
                //"message"=>"账号已被停权"
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000914_userWithoutRight)
            );
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
        $key = CommonUtil::getSecretKeyByAppKey(CommonUtil::getContextAppKey());
        $ServerSignature = base64_encode(hash_hmac('sha256', $signatureTime, $key, true));
        return $ServerSignature;

    }

    /*
    public static function chkSignatureYellowPage($signature, $signatureTime)
    {
        $nowTime = time();
        $serverSignature = self::getSignatureYellowPage($signatureTime);
        if(strcmp($serverSignature, $signature) != 0) {
            return 1; //不匹配
        }

        if(abs($nowTime - $signatureTime) > 900) {
            return 2; //超时
        }

        return 3;
    }

    public static function getSignatureYellowPage($signatureTime)
    {
        $key = CommonUtil::getSecretKeyByAppKey("appyellowpagetest");
        $ServerSignature = base64_encode(hash_hmac('sha256', $signatureTime, $key, true));
        return $ServerSignature;
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
            || trim($headerContentType) == "" || trim($headerAppKey) == ""
            || trim($headerSignature) == "" || trim($headerSignatureTime) == "") {
            return array("code"=>ResultCode::_999001_requestParameterLostOrIncorrect,
                "message"=> "傳入參數不足或傳入參數格式錯誤");
        }

        if($headerAppKey != "appyellowpagetest") {
            return array("code"=>ResultCode::_999010_appKeyIncorrect,
                "message"=> "app-key參數錯誤");
        }

        //verify language input
        if(!array_key_exists('lang', $input) || trim($input["lang"]) == "") {
            return array("code"=>ResultCode::_999004_parameterLangLostOrIncorrect,
                "message"=>"lang參數錯誤 or 不存在");
        }

        //verify content-type
        if (!stristr($headerContentType,'application/json')) {
            return array("code"=>ResultCode::_999006_contentTypeParameterInvalid,
                "message"=>"Content-Type錯誤");
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
                    "message"=>"Signature驗證碼不正確");
            }

            if($sigResult == 2) {
                return array("code"=>ResultCode::_999011_signatureOvertime,
                    "message"=>"signature參數錯誤或誤差超過15分鐘");
            }
        }

        //通用api參數判斷
        if(!array_key_exists('uuid', $input) || trim($input["uuid"]) == "")
        {
            return array("code"=>ResultCode::_999001_requestParameterLostOrIncorrect,
                "message"=>"傳入參數不足或傳入參數格式錯誤");
        }

        $token = $request->header('token');
        $uuid = $input["uuid"];

        if(!self::chkUuidExist($uuid)) {
            return array("code"=>ResultCode::_000911_uuidNotExist,
                "message"=>"uuid不存在");
        }

        return self::verifyToken($uuid, $token);

    }

//rrs start

    public static function chkSignatureRRS($signature, $signatureTime)
    {
        $nowTime = time();
        $serverSignature = self::getSignatureRRS($signatureTime);
        if(strcmp($serverSignature, $signature) != 0) {
            return 1; //不匹配
        }

        if(abs($nowTime - $signatureTime) > 900) {
            return 2; //超?
        }

        return 3;
    }

    public static function getSignatureRRS($signatureTime)
    {
        $key = CommonUtil::getSecretKeyByAppKey("apprrstest");
        $ServerSignature = base64_encode(hash_hmac('sha256', $signatureTime, $key, true));
        return $ServerSignature;
    }

    public static function verifyRRS() {
        $request = Request::instance();
        $input = Input::get();
        $headerContentType = $request->header('Content-Type');
        $headerAppKey = $request->header('App-Key');
        $headerSignature = $request->header('Signature');
        $headerSignatureTime = $request->header('Signature-Time');

        //verify parameter count
        if($headerContentType == null || $headerAppKey == null
            || $headerSignature == null || $headerSignatureTime == null
            || trim($headerContentType) == "" || trim($headerAppKey) == ""
            || trim($headerSignature) == "" || trim($headerSignatureTime) == "") {
            return array("code"=>ResultCode::_999001_requestParameterLostOrIncorrect,
                "message"=> "傳入參數不足或傳入參數格式錯誤");
        }

        if($headerAppKey != "apprrstest") {
            return array("code"=>ResultCode::_999010_appKeyIncorrect,
                "message"=> "app-key參數錯誤");
        }

        //verify language input
        if(!array_key_exists('lang', $input) || trim($input["lang"]) == "") {
            return array("code"=>ResultCode::_999004_parameterLangLostOrIncorrect,
                "message"=>"lang參數錯誤 or 不存在");
        }

        //verify content-type
        if (!stristr($headerContentType,'application/json')) {
            return array("code"=>ResultCode::_999006_contentTypeParameterInvalid,
                "message"=>"Content-Type錯誤");
        }

        //TODO for test
        if($headerSignature == "Moses824")
        {
//            return array("code"=>ResultCode::_1_reponseSuccessful,
//                "message"=>"");
        } else {
            $sigResult = self::chkSignatureRRS($headerSignature, $headerSignatureTime);
            if ($sigResult == 1) {
                return array("code"=>ResultCode::_999008_signatureIsInvalid,
                    "message"=>"Signature驗證碼不正確");
            }

            if($sigResult == 2) {
                return array("code"=>ResultCode::_999011_signatureOvertime,
                    "message"=>"signature參數錯誤或誤差超過15分鐘");
            }
        }

        //通用api參數判斷
        if(!array_key_exists('uuid', $input) || trim($input["uuid"]) == "")
        {
            return array("code"=>ResultCode::_999001_requestParameterLostOrIncorrect,
                "message"=>"傳入參數不足或傳入參數格式錯誤");
        }

        $token = $request->header('token');
        $uuid = $input["uuid"];

        if(!self::chkUuidExist($uuid)) {
            return array("code"=>ResultCode::_000911_uuidNotExist,
                "message"=>"uuid不存在");
        }

        return self::verifyToken($uuid, $token);

    }
//rrs end
    */

//custom begin
    public static function chkSignatureCustom($signature, $signatureTime,$appKey)
    {
        $nowTime = time();
        $serverSignature = self::getSignatureCustom($signatureTime,$appKey);
        if(strcmp($serverSignature, $signature) != 0) {
            return 1; //不匹配
        }

        if(abs($nowTime - $signatureTime) > 900) {
            return 2; //超?
        }

        return 3;
    }

    public static function getSignatureCustom($signatureTime,$appKey)
    {
        $key = CommonUtil::getSecretKeyByAppKey($appKey);
        $ServerSignature = base64_encode(hash_hmac('sha256', $signatureTime, $key, true));
        return $ServerSignature;
    }

    /**
     * 驗證客製App,可驗證非qplay專案
     * @param  boolean $needCheckUuid 是否需正uuid及token
     * @return json
     */
    public static function verifyCustom($needCheckUuid) {
        $request = Request::instance();
        $input = Input::get();
        $headerContentType = $request->header('Content-Type');
        $headerAppKey = $request->header('App-Key');
        $headerSignature = $request->header('Signature');
        $headerSignatureTime = $request->header('Signature-Time');

        //verify parameter count
        if($headerContentType == null || $headerAppKey == null
            || $headerSignature == null || $headerSignatureTime == null
            || trim($headerContentType) == "" || trim($headerAppKey) == ""
            || trim($headerSignature) == "" || trim($headerSignatureTime) == "") {
            return array("code"=>ResultCode::_999001_requestParameterLostOrIncorrect,
                //"message"=> "vcustom傳入參數不足或傳入參數格式錯誤"
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_999001_requestParameterLostOrIncorrect)
            );
        }
        //检查app_key是否存在
        if(!self::chkAppKeyExist($headerAppKey)) {
            return array("code"=>ResultCode::_999010_appKeyIncorrect,
                //"message"=> "app-key參數錯誤"
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_999010_appKeyIncorrect)
            );
        }

        //verify language input
        if(!array_key_exists('lang', $input) || trim($input["lang"]) == "") {
            return array("code"=>ResultCode::_999004_parameterLangLostOrIncorrect,
                //"message"=>"lang參數錯誤 or 不存在"
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_999004_parameterLangLostOrIncorrect)
            );
        }

        //verify content-type
        if (!stristr($headerContentType,'application/json')) {
            return array("code"=>ResultCode::_999006_contentTypeParameterInvalid,
                //"message"=>"Content-Type錯誤"
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_999006_contentTypeParameterInvalid)
            );
        }

        /*
        //TODO for test
        if($headerSignature == "Moses824")
        {
//            return array("code"=>ResultCode::_1_reponseSuccessful,
//                "message"=>"");
        } else {
            $sigResult = self::chkSignatureCustom($headerSignature, $headerSignatureTime,$headerAppKey);
            if ($sigResult == 1) {
                return array("code"=>ResultCode::_999008_signatureIsInvalid,
                    //"message"=>"Signature驗證碼不正確"
                    "message"=> CommonUtil::getMessageContentByCode(ResultCode::_999008_signatureIsInvalid)
                );
            }

            if($sigResult == 2) {
                return array("code"=>ResultCode::_999011_signatureOvertime,
                    //"message"=>"signature參數錯誤或誤差超過15分鐘"
                    "message"=> CommonUtil::getMessageContentByCode(ResultCode::_999011_signatureOvertime)
                );
            }
        }
        */
        $sigResult = self::chkSignatureCustom($headerSignature, $headerSignatureTime,$headerAppKey);
        if ($sigResult == 1) {
            return array("code"=>ResultCode::_999008_signatureIsInvalid,
                //"message"=>"Signature驗證碼不正確"
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_999008_signatureIsInvalid)
            );
        }

        if($sigResult == 2) {
            return array("code"=>ResultCode::_999011_signatureOvertime,
                //"message"=>"signature參數錯誤或誤差超過15分鐘"
                "message"=> CommonUtil::getMessageContentByCode(ResultCode::_999011_signatureOvertime)
            );
        }

        //sendPushMessage專用不需UUID參數判斷
        if($needCheckUuid)
        {
            $token = $request->header('token');
            $uuid = $input["uuid"];

            if(!self::chkUuidExist($uuid)) {
                return array("code"=>ResultCode::_000911_uuidNotExist,
                    //"message"=>"uuid不存在"
                    "message"=> CommonUtil::getMessageContentByCode(ResultCode::_000911_uuidNotExist)
                );
            }
            return self::verifyToken($uuid, $token);
        } else {
            return array("code"=>ResultCode::_1_reponseSuccessful,
                "message"=>"");
        }
    }
//custom end
}