<?php
namespace App\lib;


use Request;
use Illuminate\Support\Facades\Input;
use DB;
use App\lib\CommonUtil;
use App\lib\ResultCode;

class Verify
{
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
     */

    /**
     * @param bool $needCheckUuid
     * @return array
     * 同qplayapi的的verifyCustom
     */
    public static function verify($needCheckUuid = false) {
        $request = Request::instance();
        $input = Input::get();
        $headerContentType = trim($request->header('Content-Type'));
        $headerAppKey = trim($request->header('App-Key'));
        $headerSignature = trim($request->header('Signature'));
        $headerSignatureTime = trim($request->header('Signature-Time'));

        //TODO for test
        /*if($headerSignature == "Moses824")
        {
            return array("code"=>ResultCode::_1_reponseSuccessful,
                "message"=>"");
        }*/

        //0.检查传入参数个数
        if(empty($headerContentType) || empty($headerAppKey) || empty($headerSignature) || empty($headerSignatureTime)) {
            return CommonUtil::ResultFactory(ResultCode::_999001_requestParameterLostOrIncorrect,
                "傳入參數不足或傳入參數格式錯誤");
        }

        //1.检查app_key是否存在
        if(!self::chkAppKeyExist($headerAppKey)) {
            return CommonUtil::ResultFactory(ResultCode::_999010_appKeyIncorrect,
                "app-key參數錯誤");
        }

        //2.检查lang是否存在
        if(!array_key_exists('lang', $input) || trim($input["lang"]) == "") {
            return CommonUtil::ResultFactory(ResultCode::_999004_parameterLangLostOrIncorrect,
                "lang參數錯誤或不存在");
        }

        //3.检查content-type
        if (!stristr($headerContentType,'application/json')) {
            return CommonUtil::ResultFactory(ResultCode::_999006_contentTypeParameterInvalid,
                "Content-Type錯誤");
        }

        //4.检查Signature/Signature Time
        $sigResult = self::chkSignature($headerSignature, $headerSignatureTime,$headerAppKey);
        if ($sigResult == 1) {
            return CommonUtil::ResultFactory(ResultCode::_999008_signatureIsInvalid,
                "Signature驗證碼不正確");
        }
        if($sigResult == 2) {
            return CommonUtil::ResultFactory(ResultCode::_999011_signatureOvertime,
                "Signature參數錯誤或誤差超過15分鐘");
        }

        //5.检查UUID(可选)
        if($needCheckUuid)
        {
            $token = trim($request->header('token'));
            $uuid = trim($input["uuid"]);
            return self::verifyToken($uuid, $token);
        } else {
            return CommonUtil::ResultFactory(ResultCode::_1_reponseSuccessful,"Success");
        }
    }

    /**
     * @param $uuid
     * @param $token
     * @return array
     * 检查Token和UUID
     */
    public static function verifyToken($uuid, $token) {
        if(empty($token)|| empty($uuid)) {
            return CommonUtil::ResultFactory(ResultCode::_999001_requestParameterLostOrIncorrect,
                "傳入參數不足或傳入參數格式錯誤");
        }

        if(!Verify::chkUuidExist($uuid)) {
            return CommonUtil::ResultFactory(ResultCode::_000911_uuidNotExist,
                "uuid不存在");
        }

        $sql = "select distinct s.token_valid_date, s.user_row_id from qp_session s, qp_register r where s.uuid = '"
            .$uuid
            ."' and s.token = '"
            .$token
            ."' and s.uuid = r.uuid and s.user_row_id = r.user_row_id and r.`status` = 'A'";
        $sessionList = DB::select($sql, []);

        if(count($sessionList) < 1){
            return CommonUtil::ResultFactory(ResultCode::_000908_tokenInvalid
                ,"token已经失效");
        }

        $token_valid_date = $sessionList[0]->token_valid_date;
        if(time() > $token_valid_date){
            return CommonUtil::ResultFactory(ResultCode::_000907_tokenOverdue,
                "token过期");
        }

        $checkUserResult = Verify::verifyUserByUserRowID($sessionList[0]->user_row_id);
        if($checkUserResult["code"] != ResultCode::_1_reponseSuccessful) {
            return $checkUserResult;
        }

        return CommonUtil::ResultFactory(ResultCode::_1_reponseSuccessful,
            "Success");
    }

    public static function chkUuidExist($uuid)
    {
        $registerInfoList = \DB::connection("qplay")
            -> table("qp_register")
            -> where('uuid', "=", $uuid)
            -> where('status', '=', 'A')
            -> select('row_id')
            -> get();
        if(count($registerInfoList) > 0 ) {
            return true;
        } else {
            return false;
        }
    }

    public static function chkAppKeyExist($appKey)
    {
        $projectList = \DB::connection("qplay")
            -> table("qp_project")
            -> where('app_key', "=", $appKey)
            -> select('row_id')->get();
        if(count($projectList) > 0 ) {
            return true;
        } else {
            return false;
        }
    }

    public static function chkSignature($signature, $signatureTime,$appKey)
    {
        $nowTime = time();
        $serverSignature = self::getSignature($signatureTime,$appKey);
        if(strcmp($serverSignature, $signature) != 0) {
            return 1; //不匹配
        }

        if(abs($nowTime - $signatureTime) > 900) {
            return 2; //超时
        }
        return 3;
    }

    public static function getSignature($signatureTime,$appKey)
    {
        $key = CommonUtil::getSecretKeyByAppKey($appKey);
        $ServerSignature = base64_encode(hash_hmac('sha256', $signatureTime, $key, true));
        return $ServerSignature;
    }

    public static function verifyUserByUserRowID($userRowId) {
        $userStatus = CommonUtil::getUserStatusByUserRowID($userRowId);
        if($userStatus == 0) {
            return CommonUtil::ResultFactory(ResultCode::_000901_userNotExistError,
                "員工資訊錯誤");
        }
        if($userStatus == 1) {
            return CommonUtil::ResultFactory(ResultCode::_000901_userNotExistError,
                "員工資訊錯誤");
        }
        if($userStatus == 2) {
            return CommonUtil::ResultFactory(ResultCode::_000914_userWithoutRight,
                "账号已被停权");
        }
        return CommonUtil::ResultFactory(ResultCode::_1_reponseSuccessful,"Success");
    }
}