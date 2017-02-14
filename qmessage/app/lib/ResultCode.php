<?php
namespace App\lib;
/**
 * Created by PhpStorm.
 * User: John.ZC.Zhuang
 * Date: 2017/1/11
 * Time: 9:31
 */
abstract class ResultCode
{
    const _1_reponseSuccessful = 1; //成功

    //QPlay
    const _999001_requestParameterLostOrIncorrect = '999001'; //傳入參數不足或傳入參數格式錯誤
    const _999002_parameterVersionLostOrIncorrect = '999002'; //version參數錯誤 or 不存在
    const _999003_parameterActionLostOrIncorrect = '999003';  //action參數錯誤 or 不存在
    const _999004_parameterLangLostOrIncorrect = '999004';  //lang參數錯誤 or 不存在
    const _999005_transactionMethodIncorrect = '999005';  //傳送方法錯誤,  ex.Method應為GET時, 卻傳POST
    const _999006_contentTypeParameterInvalid = '999006';  //Content-Type錯誤(當Client的傳送方法為POST時, 才會有此result code產生)
    const _999007_inputJsonFormatInvalid = '999007';  //傳入的json格式錯誤, Server端無法解析(當Client的傳送方法為POST時, 才會有此result code產生)
    const _999008_signatureIsInvalid = '999008';  //Signature驗證碼不正確
    const _999009_ipInBlacklist = '999009';  //禁止存取API (IP為黑名單)
    const _999010_appKeyIncorrect = '999010';  //app-key參數錯誤
    const _999011_signatureOvertime = '999011';  //signature參數錯誤或誤差超過15分鐘
    const _999012_appOffTheShelf = '999012';  //app已经下架
    const _999013_pushTokenUsed = '999013';  //push token已经使用
    const _999014_companyNotExist = '999014';  //company不存在
    const _999999_unknownError = '999999';  //其他未知錯誤

    const _000901_userNotExistError = '000901';  //員工資訊錯誤
    const _000902_passwordError = '000902';  //密码错误
    const _000903_deviceHasRegistered = "000903"; //设备已经注册
    const _000904_loginUserNotMathRegistered = "000904"; //登录用户与设备认证时的用户不同
    const _000905_deviceNotRegistered = "000905"; //设备未认证
    const _000907_tokenOverdue = "000907"; //Token过期
    const _000908_tokenInvalid = "000908"; //Token失效
    const _000909_appKeyNotExist = "000909"; //app key不存在
    const _000910_messageNotExist = '000910';  //此消息不存在
    const _000911_uuidNotExist = "000911"; //uuid不存在
    const _000912_userReceivePushMessageNotExist = "000912"; //接收推播用户不存在
    const _000913_NotNeedUpdate = "000913"; //app无需更新
    const _000914_userWithoutRight = '000914';  //用户停权
    const _000915_packageNotExist = "000915"; //package不存在
    const _000916_titleLengthTooLong = "000916"; //标题栏位太长
    const _000917_roleNotExist = "000917"; //角色不存在
    const _000918_dataIncomplete = "000918"; //数据不完整

    //QMessage
    const _998001_usernameEmptyOrInvalid = '998001'; //用户名为空或不合法
    const _998002_callAPIFailedOrErrorOccurs = '998002'; //调用JMessage API出错
    const _998003_groupOwnerEmptyOrInvalid = '998003'; //Group Owner为空或不合法
    const _998004_groupMembersEmptyOrInvalid = '998004'; //Group Members为空或不合法
    const _998005_groupIDEmptyOrInvalid = '998005'; //Group ID 为空或不合法
    const _998006_downloadFileFailed = '998006'; //下载文件失败（图片）
    const _998007_cursorEmptyOrInvalid = '998007'; //cursor(msgid)为空或不存在
}