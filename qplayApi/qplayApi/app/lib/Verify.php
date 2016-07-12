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
            || $headerSignature == null || $headerSignatureTime == null) {
            return array("code"=>ResultCode::_999001_requestParameterLostOrIncorrect,
                "message"=> "傳入參數不足或傳入參數格式錯誤");
        }

        //verify language input
        if(!array_key_exists('lang', $input) || trim($input["lang"]) == "") {
            return array("code"=>ResultCode::_999004_parameterLangLostOrIncorrect,
                "message"=>"lang參數錯誤 or 不存在");
        }
        
        //verify content-type
        if ($headerContentType != 'application/json') {
            return array("code"=>ResultCode::_999006_contentTypeParameterInvalid,
                "message"=>"Content-Type錯誤");
        }

        //TODO for test
        if($headerSignature == "Moses824")
        {
            return array("code"=>ResultCode::_1_reponseSuccessful,
                "message"=>"");
        }

        if (!self::chkSignature($headerSignature, $headerSignatureTime)) {
            return array("code"=>ResultCode::_999008_signatureIsInvalid,
                "message"=>"Signature驗證碼不正確");
        }

        return array("code"=>ResultCode::_1_reponseSuccessful,
            "message"=>"");
    }

    public static function verifyToken($uuid, $token) {
        if($token == null) {
            return array("code"=>ResultCode::_999001_requestParameterLostOrIncorrect,
                "message"=> "傳入參數不足或傳入參數格式錯誤");
        }

        $sessionList = \DB::table("qp_session")
            -> where('uuid', "=", $uuid)
            -> where('token', '=', $token)
            -> select('token_valid_date')->get();
        if(count($sessionList) < 1)
        {
            return array("code"=>ResultCode::_000908_tokenInvalid,
                "message"=> "token已经失效");
        }

        $token_valid_date = $sessionList[0]->token_valid_date;
        $ts = time() - $token_valid_date; //strtotime($token_valid_date);
        if($ts > Verify::$TOKEN_VALIDATE_TIME)
        {
            return array("code"=>ResultCode::_000907_tokenOverdue,
                "message"=> "token过期");
        }

        $userInfo = CommonUtil::getUserInfoByUUID($uuid);
        if($userInfo == null)
        {
            return array("code"=>ResultCode::_000914_userWithoutRight,
                "message"=> "账号已被停权");
        }

        return array("code"=>ResultCode::_1_reponseSuccessful,
            "token_valid_date"=>$token_valid_date,
            "message"=>"");
    }

    public static function chkSignature($signature, $signatureTime)
    {
        $nowTime = time();
        $serverSignature = self::getSignature($signatureTime);
        if (strcmp($serverSignature, $signature) == 0 and abs($nowTime - $signatureTime) < 900) {
            //15*60 15分鐘
            return true;
        } else {
            return false;
        }
    }

    public static function getSignature($signatureTime)
    {
        $ServerSignature = base64_encode(hash_hmac('sha256', $signatureTime, 'swexuc453refebraXecujeruBraqAc4e', true));
        return $ServerSignature;

    }
}