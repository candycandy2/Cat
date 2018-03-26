<?php
namespace App\lib;

/**
 * 錯誤代碼
 * User: Cleo.W.Chan
 */

abstract class ResultCode
{   
    //通用驗證
    const _1_reponseSuccessful = "1"; //成功

    const _999001_requestParameterLostOrIncorrect = '999001'; //傳入參數不足或傳入參數格式錯誤
    const _999004_parameterLangLostOrIncorrect = '999004';  //lang參數錯誤 or 不存在
    const _999005_transactionMethodIncorrect = '999005';  //傳送方法錯誤,  ex.Method應為GET時, 卻傳POST
    const _999006_contentTypeParameterInvalid = '999006';  //Content-Type錯誤(當Client的傳送方法為POST時, 才會有此result code產生)
    const _999007_inputJsonFormatInvalid = '999007';  //傳入的json格式錯誤, Server端無法解析(當Client的傳送方法為POST時, 才會有此result code產生)
    const _999008_signatureIsInvalid = '999008';  //Signature驗證碼不正確
    const _999009_ipInBlacklist = '999009';  //禁止存取API (IP為黑名單)
    const _999010_appKeyIncorrect = '999010';  //app-key參數錯誤
    const _999011_signatureOvertime = '999011';  //signature參數錯誤或誤差超過15分鐘
    const _999999_unknownError = '999999';  //其他未知錯誤
    
    //QStorage
    const _997901_TheLengthOfFieldIsTooLong = "997901"; //欄位長度太長
    const _997902_MandatoryFieldLost = "997902"; //必填字段缺失
    const _997903_FieldFormatError = "997903"; //欄位格式錯誤
    const _997904_AccountNotExist = "997904"; //帳號不存在
    const _997907_UploadDataTypeIsNotAllow = "997907"; //上傳類型不符規定
    const _997908_FileSizeExceedsTheAllowableLimit = "997908"; //上传档案超过大小限制
    const _997909_NoFileToDelete = "997909"; //查無檔案可刪除
    const _997910_uuidNotExist = "997910"; //uuid不存在
    const _997998_NoAuthorityToDeleteThisFile = "997998";  //沒有權限刪除此檔案
    const _997999_UnknownError = "997999";  //其他未知錯誤  

}