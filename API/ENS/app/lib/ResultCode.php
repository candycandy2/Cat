<?php
namespace App\lib;

/**
 * 錯誤代碼
 * User: Cleo.W.Chan
 * Date: 16-12-09
 * Time: 下午1:26
 */

abstract class ResultCode
{
    const _1_reponseSuccessful = 1; //成功
    const _014901_reponseSuccessful = "014901";
    const _014902_locationOrFunctionNotFound = "014902"; //Location或是Function錯誤
    const _014903_mandatoryFieldLost = "014903";  //必填欄位缺失
    const _014904_noEventData = "014904";  //查無事件資料
    const _014905_fieldFormatError = "014905";  //欄位格式錯誤
    const _014906_noCategoryInformation = "014906";  //查無分類基本資料
    const _014907_noAuthority = "014907";  //權限不足
    const _014908_accountNotExist = "014908";  //帳號不存在
    const _014909_noTaskData = "014909";  //查無Task資料
    const _014910_eventClosed = "014910";  //事件已經完成
    const _014911_relatedEventStatusError = "014911";  //关联事件状态异常
    const _014912_eventTypeError = "014912";  //事件类型错误
    const _014913_eventStatusCodeError = "014913";  //事件狀態碼錯誤
    const _014914_taskStatusCodeError = "014914";  //任務状态码错误 
    const _014915_contentTypeParameterInvalid = "014915";  //Content-Type錯誤
    const _014916_inputXmlFormatInvalid = "014916";  //傳入的xml格式錯誤, Server端無法解析  
    const _014917_inputJsonFormatInvalid = "014917";  //傳入的json格式錯誤, Server端無法解析
    const _014918_memberNotRegistered = "014918";  //新增聊天室失敗, 成員未註冊
    const _014919_chatroomMemberInvalid = "014919";  //聊天室成員不存在
    const _014920_chatroomIdInvalid = "014920";  //傳入的聊天室編號無法識別 
    const _014921_pushUserError = "014921";  //成員已離職或停權
    const _014922_projectInvalid = "014922";  //project參數不存在
    const _014923_noAuthority = "014923";  //沒有任何專案權限
    const _014999_unknownError = "014999";  //其他未知錯誤    
}
