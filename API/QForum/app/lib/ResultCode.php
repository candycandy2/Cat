<?php
namespace App\lib;

/**
 * 錯誤代碼
 * User: Cleo.W.Chan
 */

abstract class ResultCode
{   
    const _1_reponseSuccessful = "1"; //成功
    const _047901_reponseSuccessful = "047901"; //成功
    const _047902_TheLengthOfFieldIsTooLong = "047902"; //欄位長度太長
    const _047903_MandatoryFieldLost = "047903"; //必填字段缺失
    const _047904_NoAuthorityToAccessThisBoard = "047904"; //沒有該討論版權限
    const _047905_FieldFormatError = "047905"; //欄位格式錯誤
    const _047906_FieldFormatError = "047906"; //不能修改他人回應內容
    const _047907_OnlyPostOwnerCanModifyTitle = "047907"; //只有創建人能修改標題
    const _047908_AccountNotExist = "047908"; //帳號不存在
    const _047909_OnlyManagerCanModifyTheBoardBasicInformation = "047909"; //只有管理者才能修改討論版
    const _047910_PostIsClosed= "047910"; //貼文已關閉
    const _047911_BoardIsClosed= "047911"; //討論版已關閉
    const _047915_ContentTypeParameterInvalid = "047915"; //Content-Type錯誤
    const _047916_InputXmlFormatIsInvalid = "047916";  //傳入的xml格式錯誤,Server端無法解析 
    const _047917_InputJsonFormatIsInvalid = "047917";//傳入的json格式錯誤,Server端無法解析
    const _047930_CallAPIFailedOrErrorOccurs = '047930'; //調用JMessage API出错
    const _047998_NoData = "047998";  //查無資料
    const _047999_UnknownError = "047999";  //其他未知錯誤
}