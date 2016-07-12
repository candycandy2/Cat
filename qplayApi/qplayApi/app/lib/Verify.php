<?php
namespace App\lib;

/**
 * Created by PhpStorm.
 * User: Moses.Zhu
 * Date: 16-6-20
 * Time: 下午1:25
 */

use App\lib\ResultCode;
use Request;
use App\lib\SystemList;

class Verify
{
    /**
     * 確認傳送資料是否為json
     *    Accept: application/json
     * Content-Type: application/json
     *
     * 這三種方法是用來檢查 request 的 header。
     * 1. Request::isJson() 用來檢查 HTTP_CONTENT_TYPE是否存在 application/json
     * 2. Request::wantsJson用來檢查 HTTP_ACCEPT 是否存在 application/json
     * 3. Request::format 用來檢查 request 要求的回傳格式
     */
    public static function json()
    {
        $request = Request::instance();
        $RequestPathArr = explode('/', \Request::path());

        $RequestCount = count($RequestPathArr);
        if ($request->header('Content-Type') != 'application/json') {
            return ResultCode::_999006_contentTypeParameterInvalid;
        } else {
            if (!SystemList::isSystemAllowed($request->header('App-Key'))) {
                return ResultCode::_999002_parameterVersionLostOrIncorrect;

            } else {
                if (strlen($request->header('Signature-Time')) != 10) {
                    return ResultCode::_999001_requestParameterLostOrIncorrect;
                } else {
                    //TODO marked for test
                    if (!self::chkSignature($request->header('Signature'), $request->header('Signature-Time'))) {
                        return ResultCode::_999008_signatureIsInvalid;
                    } else {
                        if (!SystemList::isSystemVersionCorrect($request->header('App-Key'), $RequestPathArr[$RequestCount - 3])) {
                            return ResultCode::_999002_parameterVersionLostOrIncorrect;
                        }
                    }
                }
            }
        }
        return ResultCode::_1_reponseSuccessful;
    }

    public static function chkSignature($signature, $SignatureTime)
    {
        $nowTime = time();
        $SignatureTime = Request::header('Signature-Time');
        $ServerSignature = self::getSignature($SignatureTime);
        if (strcmp($ServerSignature, $signature) == 0 and abs($nowTime - $SignatureTime) < 900) {
            //15*60 15分鐘
            return true;
        } else {
            return false;
        }
    }

    public static function getSignature($SignatureTime)
    {
        $ServerSignature = base64_encode(hash_hmac('sha256', 'swexuc453refebraXecujeruBraqAc4e', $SignatureTime, true));
        return $ServerSignature;

    }

    public static function node($node, $data)
    {
        foreach ($node as $f_k => $f_v) {
            if (!isset($data[$f_v])) {
                return ResultCode::_99004_awsS3TokenExpired;
            }
        }
        return 1;
    }

    /**
     * check the header without checking time over 15 mins
     *
     * @return String resultCode
     */
    public static function jsonWithoutTime()
    {
        $request = Request::instance();
        $RequestPathArr = explode('/', \Request::path());
        $RequestCount = count($RequestPathArr);
        if ($request->header('Content-Type') != 'application/json') {
            return ResultCode::_999006_contentTypeParameterInvalid;
        } else {
            if (!SystemList::isSystemAllowed($request->header('App-Key'))) {
                return ResultCode::_999002_parameterVersionLostOrIncorrect;

            } else {
                if (strlen($request->header('Signature-Time')) != 10) {
                    return ResultCode::_999001_requestParameterLostOrIncorrect;
                } else {
                    if (!self::chkSignatureWithoutTime($request->header('Signature'), $request->header('Signature-Time'))) {
                        return ResultCode::_999008_signatureIsInvalid;
                    } else {
                        if (!SystemList::isSystemVersionCorrect($request->header('App-Key'), $RequestPathArr[$RequestCount - 3])) {
                            return ResultCode::_999002_parameterVersionLostOrIncorrect;
                        }
                    }
                }
            }
        }
        return ResultCode::_1_reponseSuccessful;
    }

    public static function chkSignatureWithoutTime($signature, $SignatureTime)
    {
        $nowTime = time();
        $SignatureTime = Request::header('Signature-Time');
        $ServerSignature = self::getSignature($SignatureTime);
        if (strcmp($ServerSignature, $signature) == 0) {
            return true;
        } else {
            return false;
        }
    }
}